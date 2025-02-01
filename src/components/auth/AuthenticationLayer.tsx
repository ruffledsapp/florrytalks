import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/assets/icons";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AuthenticationLayer = () => {
  const { session, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error('Failed to sign in. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h1 className="text-4xl font-['Indie_Flower'] font-bold text-[#1A1F2C]">
          Welcome to FlurryTalks
        </h1>
        <p className="text-lg text-gray-600 font-['Indie_Flower']">
          Join us to start exploring!
        </p>
        <Button
          onClick={handleSignIn}
          className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#8B5CF6] transition-colors"
        >
          <Icons.User className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
    );
  }

  return null;
};

export default AuthenticationLayer;