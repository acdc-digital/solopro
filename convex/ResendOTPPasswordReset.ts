import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { generateRandomString, alphabet } from "oslo/crypto";

export const ResendOTPPasswordReset = Resend({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    console.log("🔴 Starting password reset email for:", email);
    console.log("🔴 API Key available:", !!provider.apiKey);
    console.log("🔴 Generated reset token:", token);
    
    const resend = new ResendAPI(provider.apiKey);
    
    try {
      const emailData = {
        from: "msimon@acdc.digital", // Using verified account email (Resend free tier restriction)
        to: [email],
        subject: `Reset your password for SoloPro`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Reset Your Password</h1>
              <p style="color: #666; font-size: 16px;">We received a request to reset your SoloPro password.</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 10px;">Your password reset code is:</h2>
              <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; font-family: monospace;">
                ${token}
              </div>
            </div>
            
            <div style="background-color: #fef3f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
              <p style="color: #dc2626; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This code will expire in 15 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
            
            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
              <p style="color: #0369a1; margin: 0; font-size: 14px;">
                <strong>Security tip:</strong> Choose a strong password with at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>If you're having trouble, please contact our support team.</p>
              <p style="margin-top: 20px;">
                Best regards,<br>
                The SoloPro Team
              </p>
            </div>
          </div>
        `,
        text: `
          Reset Your Password - SoloPro
          
          We received a request to reset your SoloPro password.
          
          Your password reset code is: ${token}
          
          Please enter this code along with your new password to reset your account.
          
          This code will expire in 15 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          
          Security tip: Choose a strong password with at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.
          
          Best regards,
          The SoloPro Team
        `,
      };
      
      console.log("🔴 Sending password reset email with data:", JSON.stringify(emailData, null, 2));
      
      const result = await resend.emails.send(emailData);
      
      console.log("🔴 Resend password reset result:", result);
      
      if (result.error) {
        console.error("🔴 Resend password reset API error:", JSON.stringify(result.error, null, 2));
        throw new Error(`Could not send password reset email: ${JSON.stringify(result.error)}`);
      }
      
      console.log("🔴 Password reset email sent successfully, ID:", result.data?.id);
      
    } catch (error) {
      console.error("🔴 Password reset email sending failed:", error);
      throw new Error(`Email verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}); 