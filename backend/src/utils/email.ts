import { Resend } from "resend";
import { Logger } from "../config/logger";
import { env } from "../config/dynamicEnv";


const resend = new Resend(env.RESEND_API_KEY);
export const sendApplicationEmail = async (to: string, name: string) => {
  if (!env.RESEND_API_KEY) {
    Logger.error("Missing RESEND_API_KEY");
     throw new Error("RESEND_API_KEY is required");
  }

 const sendEmail = async () => {
    const { data, error } = await resend.emails.send({
      from: "Uptick Talent <no-reply@upticktalent.africa>",
      to: [to],
      subject: "We Received Your Application!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #1a73e8;">Hello ${name},</h2>
          <p>Thank you for applying to <strong>Uptick Talent</strong>!</p>
          <p>We've received your application and our team is reviewing it.</p>
          <p>You'll hear back from us within <strong>3–5 business days</strong>.</p>
          <hr>
          <p><em>— The Uptick Team</em></p>
        </div>
      `,
    });

    if (error) {
      Logger.error("Resend Error:", error);
      throw error;
    }

    Logger.log("Email sent:", data?.id);
    return true;
  };

  // Retry once on failure
  try {
    return await sendEmail();
  } catch (error) {
    Logger.log("First attempt failed, retrying...");
    try {
      return await sendEmail();
    } catch (retryError) {
      Logger.error("Retry failed:", retryError);
      return false;
    }
  }
};
