import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const REDIRECT_URL = "https://www.eurovisadz.com";

const emailHtml = (actionLink: string, type: string) => {
  // Modern email template with better styling
  const buttonColor = "#4F46E5"; // Indigo color
  const logoUrl = "https://www.eurovisadz.com/logo.png"; // Replace with your actual logo
  const siteName = "EuroVisa DZ";

  // Determine the action type to customize the message
  let actionText = "Sign In";
  let greeting = "Welcome back!";
  let message = "Click the button below to sign in to your account.";
  
  if (type === "signup") {
    actionText = "Confirm Your Account";
    greeting = "Welcome to EuroVisa DZ!";
    message = "Click the button below to confirm your email address and complete your registration.";
  } else if (type === "recovery") {
    actionText = "Reset Password";
    greeting = "Password Reset Request";
    message = "Click the button below to reset your password.";
  } else if (type === "invite") {
    actionText = "Accept Invitation";
    greeting = "You've been invited!";
    message = "Click the button below to accept your invitation and join EuroVisa DZ.";
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${actionText} - ${siteName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
          background-color: ${buttonColor};
          padding: 30px 40px;
          text-align: center;
        }
        
        .email-header img {
          max-height: 45px;
          width: auto;
        }
        
        .email-content {
          padding: 40px 40px;
        }
        
        .email-greeting {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        
        .email-message {
          font-size: 16px;
          color: #4B5563;
          margin-bottom: 32px;
        }
        
        .email-button {
          display: block;
          background-color: ${buttonColor};
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          text-align: center;
          margin: 32px 0;
          transition: background-color 0.15s ease;
        }
        
        .email-button:hover {
          background-color: #4338CA;
        }
        
        .email-alternative {
          font-size: 14px;
          color: #6B7280;
          margin: 24px 0;
        }
        
        .email-link {
          color: ${buttonColor};
          font-size: 14px;
          word-break: break-all;
        }
        
        .email-footer {
          text-align: center;
          padding: 20px 40px 40px;
          color: #6B7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
          margin-top: 40px;
        }
        
        .social-links {
          margin: 20px 0;
        }
        
        .social-icon {
          display: inline-block;
          margin: 0 8px;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 0;
            width: 100%;
            border-radius: 0;
          }
          
          .email-header, .email-content, .email-footer {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1 style="color: white; margin: 0;">EuroVisa DZ</h1>
        </div>
        <div class="email-content">
          <div class="email-greeting">${greeting}</div>
          <div class="email-message">${message}</div>
          <a href="${actionLink}" class="email-button" target="_blank">${actionText}</a>
          <div class="email-alternative">
            If the button above doesn't work, copy and paste this link into your browser:
            <div class="email-link">${actionLink}</div>
          </div>
        </div>
        <div class="email-footer">
          <div>© ${new Date().getFullYear()} ${siteName}. All rights reserved.</div>
          <div style="margin-top: 8px;">Algeria - France - Spain - Italy</div>
          <div class="social-links">
            <a href="https://facebook.com/eurovisadz" class="social-icon" target="_blank" style="color: ${buttonColor};">Facebook</a>
            <a href="https://instagram.com/eurovisadz" class="social-icon" target="_blank" style="color: ${buttonColor};">Instagram</a>
            <a href="https://twitter.com/eurovisadz" class="social-icon" target="_blank" style="color: ${buttonColor};">Twitter</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestData = await req.json();

    // This is the critical part that modifies the auth email
    if (requestData.type === "signup" || 
        requestData.type === "magiclink" || 
        requestData.type === "recovery" || 
        requestData.type === "invite") {
      
      // Extract the token from the original link
      let token = "";
      const regex = /token=([^&]+)/;
      const match = requestData.action_link.match(regex);
      
      if (match && match[1]) {
        token = match[1];
      }
      
      // Update the action link to point to our custom domain
      // We keep the token and add the necessary parameters
      let customActionLink = `${REDIRECT_URL}/auth/callback?token=${token}&type=${requestData.type}`;
      
      if (requestData.type === "invite" || requestData.type === "recovery") {
        customActionLink = `${REDIRECT_URL}/auth/password-reset?token=${token}`;
      }
      
      // Generate custom HTML for the email
      const html = emailHtml(customActionLink, requestData.type);
      
      // Return the customized email
      return new Response(
        JSON.stringify({
          html,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Pass through for other request types
    return new Response(
      JSON.stringify({}),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error processing auth email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
