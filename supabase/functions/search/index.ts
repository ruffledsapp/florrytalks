import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    console.log('Processing search query:', query);

    if (!perplexityKey) {
      console.error('Missing Perplexity API key');
      throw new Error('Configuration error: Missing API key');
    }

    console.log('Calling Perplexity API...');
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a search assistant. Format your responses as a list of results. Each result MUST follow this EXACT format:\nTitle: [A clear, concise title]\nContent: [Detailed, informative content]\n\nEach result MUST be separated by a newline. Every result MUST have both a Title and Content field.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Perplexity API error: ${response.statusText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // Enhanced validation and processing
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Perplexity API');
    }

    // Process and validate each result
    const results = data.choices[0].message.content
      .split('\n\n')
      .map(block => {
        const titleMatch = block.match(/Title:\s*(.+)/);
        const contentMatch = block.match(/Content:\s*(.+)/);
        
        if (!titleMatch || !contentMatch) {
          console.warn('Skipping malformed result block:', block);
          return null;
        }

        return {
          title: titleMatch[1].trim(),
          content: contentMatch[1].trim()
        };
      })
      .filter(result => result !== null);

    console.log('Processed results:', results);

    const processedData = {
      ...data,
      choices: [{
        ...data.choices[0],
        message: {
          ...data.choices[0].message,
          content: results
        }
      }]
    };

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});