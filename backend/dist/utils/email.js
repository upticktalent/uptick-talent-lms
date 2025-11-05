"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationEmail = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendApplicationEmail = async (to, name) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return false;
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
            console.error("Resend Error:", error);
            throw error;
        }
        console.log("Email sent:", data?.id);
        return true;
    };
    // Retry once on failure
    try {
        return await sendEmail();
    }
    catch (error) {
        console.log("First attempt failed, retrying...");
        try {
            return await sendEmail();
        }
        catch (retryError) {
            console.error("Retry failed:", retryError);
            return false;
        }
    }
};
exports.sendApplicationEmail = sendApplicationEmail;
