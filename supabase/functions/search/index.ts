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

    // First, check if we have a cached result
    const { data: cachedResults } = await supabase
      .from('search_logs')
      .select('perplexity_results')
      .eq('query', query)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cachedResults?.perplexity_results) {
      console.log('Returning cached results for query:', query);
      return new Response(JSON.stringify(cachedResults.perplexity_results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no cache, call Perplexity API
    console.log('Calling Perplexity API for query:', query);
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
            content: 'Return structured search results in a clear, concise format.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    console.log('Received response from Perplexity API');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});