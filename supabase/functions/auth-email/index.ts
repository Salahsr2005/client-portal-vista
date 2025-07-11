import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const REDIRECT_URL = "https://www.eurovisadz.com";

const emailHtml = (actionLink: string, type: string) => {
  // Professional email template with agency branding
  const primaryColor = "#3B82F6"; // Blue color matching brand
  const secondaryColor = "#1E40AF"; // Darker blue
  const logoUrl = "https://www.eurovisadz.com/logo.png";
  const siteName = "EuroVisa DZ";
  const agencyName = "EuroVisa DZ - Your Gateway to European Education";
  const agencyDescription = "Leading educational consultancy specializing in European university admissions and visa services for Algerian students.";

  // Determine the action type to customize the message
  let actionText = "Verify Account";
  let greeting = "Welcome to EuroVisa DZ!";
  let message = "Thank you for choosing EuroVisa DZ as your trusted partner for European education. Click the button below to verify your email address and complete your registration.";
  let additionalInfo = "Once verified, you'll have access to our comprehensive platform featuring personalized consultations, university programs, and visa assistance services.";
  
  if (type === "signup") {
    actionText = "Verify Your Account";
    greeting = "Welcome to EuroVisa DZ!";
    message = "Thank you for joining EuroVisa DZ, your trusted partner for European education. Click the button below to verify your email address and unlock access to our exclusive platform.";
    additionalInfo = "After verification, you'll be able to explore thousands of programs, get personalized consultations, and receive expert guidance throughout your study abroad journey.";
  } else if (type === "recovery") {
    actionText = "Reset Your Password";
    greeting = "Password Reset Request";
    message = "We received a request to reset your password for your EuroVisa DZ account. Click the button below to create a new secure password.";
    additionalInfo = "If you didn't request this password reset, please ignore this email and your account will remain secure.";
  } else if (type === "invite") {
    actionText = "Accept Invitation";
    greeting = "You've Been Invited!";
    message = "You've been invited to join EuroVisa DZ, the premier platform for European education opportunities. Click the button below to accept your invitation.";
    additionalInfo = "Join thousands of successful students who have achieved their European education dreams through our platform.";
  } else if (type === "magiclink") {
    actionText = "Sign In Securely";
    greeting = "Secure Login to EuroVisa DZ";
    message = "Click the button below to securely sign in to your EuroVisa DZ account.";
    additionalInfo = "This secure link will expire in 1 hour for your security.";
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
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          color: #1f2937;
          line-height: 1.6;
        }
        
        .email-container {
          max-width: 650px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }
        
        .email-header {
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
          padding: 40px;
          text-align: center;
          position: relative;
        }
        
        .email-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
          opacity: 0.3;
        }
        
        .logo-container {
          position: relative;
          z-index: 2;
        }
        
        .email-header img {
          max-height: 50px;
          width: auto;
          margin-bottom: 15px;
        }
        
        .agency-title {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.025em;
        }
        
        .agency-tagline {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.5px;
        }
        
        .email-content {
          padding: 50px 40px;
          background: #ffffff;
        }
        
        .email-greeting {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .email-message {
          font-size: 17px;
          color: #374151;
          margin-bottom: 25px;
          line-height: 1.7;
          text-align: center;
        }
        
        .additional-info {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 35px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 10px;
          border-left: 4px solid ${primaryColor};
        }
        
        .email-button {
          display: block;
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin: 35px auto;
          max-width: 280px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          letter-spacing: 0.5px;
        }
        
        .email-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
        }
        
        .email-alternative {
          font-size: 14px;
          color: #6B7280;
          margin: 30px 0;
          text-align: center;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .email-link {
          color: ${primaryColor};
          font-size: 13px;
          word-break: break-all;
          margin-top: 10px;
          display: block;
          padding: 10px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .services-preview {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 25px;
          border-radius: 12px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
        }
        
        .services-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .services-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        
        .service-item {
          font-size: 14px;
          color: #475569;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .email-footer {
          background: #f8fafc;
          text-align: center;
          padding: 40px;
          color: #6B7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
        }
        
        .company-info {
          margin-bottom: 20px;
        }
        
        .company-name {
          font-weight: 600;
          color: #374151;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .company-address {
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .social-links {
          margin: 25px 0;
        }
        
        .social-icon {
          display: inline-block;
          margin: 0 12px;
          padding: 8px 16px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .social-icon:hover {
          background: ${primaryColor};
          color: white !important;
          transform: translateY(-1px);
        }
        
        .contact-info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
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
          <div class="logo-container">
            <h1 class="agency-title">${siteName}</h1>
            <p class="agency-tagline">Your Gateway to European Education</p>
          </div>
        </div>
        <div class="email-content">
          <div class="email-greeting">${greeting}</div>
          <div class="email-message">${message}</div>
          
          <div class="additional-info">
            ${additionalInfo}
          </div>
          
          <a href="${actionLink}" class="email-button" target="_blank">${actionText}</a>
          
          <div class="services-preview">
            <div class="services-title">🎓 What Awaits You at EuroVisa DZ</div>
            <ul class="services-list">
              <li class="service-item">📚 University Programs</li>
              <li class="service-item">🎯 Personalized Consultations</li>
              <li class="service-item">📋 Visa Assistance</li>
              <li class="service-item">💰 Scholarship Guidance</li>
              <li class="service-item">🏠 Accommodation Support</li>
              <li class="service-item">✈️ Travel Arrangements</li>
            </ul>
          </div>
          
          <div class="email-alternative">
            If the button above doesn't work, copy and paste this link into your browser:
            <div class="email-link">${actionLink}</div>
          </div>
        </div>
        <div class="email-footer">
          <div class="company-info">
            <div class="company-name">EuroVisa DZ</div>
            <div class="company-address">
              Leading Educational Consultancy<br>
              Specializing in European University Admissions<br>
              🇩🇿 Algeria → 🇪🇺 Europe
            </div>
          </div>
          
          <div class="social-links">
            <a href="https://facebook.com/eurovisadz" class="social-icon" target="_blank" style="color: ${primaryColor};">Facebook</a>
            <a href="https://instagram.com/eurovisadz" class="social-icon" target="_blank" style="color: ${primaryColor};">Instagram</a>
            <a href="https://linkedin.com/company/eurovisadz" class="social-icon" target="_blank" style="color: ${primaryColor};">LinkedIn</a>
            <a href="https://www.eurovisadz.com" class="social-icon" target="_blank" style="color: ${primaryColor};">Website</a>
          </div>
          
          <div class="contact-info">
            <div>📧 info@eurovisadz.com | 📞 +213 XXX XXX XXX</div>
            <div style="margin-top: 8px;">🌍 Serving students from Algeria to Universities across Europe</div>
            <div style="margin-top: 15px; font-size: 12px;">
              © ${new Date().getFullYear()} ${siteName}. All rights reserved.<br>
              This email was sent to you because you registered on our platform.
            </div>
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
