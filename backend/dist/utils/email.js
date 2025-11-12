"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationEmail = void 0;
const resend_1 = require("resend");
const logger_1 = require("../config/logger");
const dynamicEnv_1 = require("../config/dynamicEnv");
const resend = new resend_1.Resend(dynamicEnv_1.env.RESEND_API_KEY);
const sendApplicationEmail = async (to, name) => {
    if (!dynamicEnv_1.env.RESEND_API_KEY) {
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
            logger_1.Logger.error("Resend Error:", error);
            throw error;
        }
        return true;
    };
    // Retry once on failure
    try {
        return await sendEmail();
    }
    catch (error) {
        logger_1.Logger.log("First attempt failed, retrying...");
        try {
            return await sendEmail();
        }
        catch (retryError) {
            logger_1.Logger.error("Retry failed:", retryError);
            return false;
        }
    }
};
exports.sendApplicationEmail = sendApplicationEmail;
