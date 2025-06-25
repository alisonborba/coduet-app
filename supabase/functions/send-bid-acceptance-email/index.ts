
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { applicationId }: EmailRequest = await req.json();

    // Get application details with helper and publisher info
    const { data: application, error: appError } = await supabaseClient
      .from('applications')
      .select(`
        *,
        posts (*),
        helper_profile:profiles!applications_helper_id_fkey (*),
        publisher_profile:profiles!posts_publisher_id_fkey (*)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('Application not found');
    }

    console.log('Sending bid acceptance email for application:', applicationId);
    console.log('Helper email would be:', application.helper_profile?.email);
    console.log('Publisher contact:', application.publisher_profile?.name, application.publisher_profile?.email);

    // For now, just log the email details since we haven't set up Resend
    // In a real implementation, you would send the actual email here
    const emailContent = {
      to: application.helper_profile?.email,
      subject: `Your bid has been accepted for "${application.posts.title}"`,
      message: `
        Congratulations! Your bid for "${application.posts.title}" has been accepted.
        
        Publisher Contact Information:
        Name: ${application.publisher_profile?.name}
        Email: ${application.publisher_profile?.email}
        Phone: ${application.publisher_profile?.phone}
        Skype: ${application.publisher_profile?.skype}
        
        Please contact the publisher to discuss the project details and next steps.
        
        Bid Amount: ${application.bid_amount} SOL
      `
    };

    console.log('Email content:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification logged (not actually sent - Resend not configured)' 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bid-acceptance-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
