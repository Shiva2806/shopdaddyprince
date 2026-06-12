import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL = process.env.EMAIL_FROM || process.env.FROM_EMAIL || "onboarding@resend.dev";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  emailType: string;
  recipientName?: string;
  metadata?: Record<string, any>;
}

/**
 * Sends an email using Resend, automatically logging the attempt and status updates to the database.
 */
export async function sendEmail({
  to,
  subject,
  html,
  emailType,
  recipientName,
  metadata = {},
}: SendEmailParams) {
  const supabase = createAdminClient() as any;

  console.log(`[EMAIL_TRIGGERED] Type: ${emailType}, Recipient: ${to}`);

  // Insert initial sending record
  const { data: log, error: logError } = await supabase
    .from("email_logs")
    .insert({
      recipient_email: to,
      recipient_name: recipientName || null,
      email_type: emailType,
      subject,
      status: "sending",
      metadata,
    })
    .select()
    .single();

  if (logError) {
    console.error("Failed to insert email log:", logError);
  }

  const logId = log?.id;

  if (!resend) {
    const errorMsg = "Resend API key is missing. Ensure RESEND_API_KEY is defined in environment variables.";
    console.error(errorMsg);
    console.log(`[EMAIL_FAILED] Type: ${emailType}, Recipient: ${to}, Error: ${errorMsg}`);
    if (logId) {
      await supabase
        .from("email_logs")
        .update({
          status: "failed",
          error: errorMsg,
          updated_at: new Date().toISOString(),
        })
        .eq("id", logId);
    }
    return { success: false, error: errorMsg };
  }

  try {
    // Send email using Resend
    const response = await resend.emails.send({
      from: `Daddy Prince <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to send email via Resend API.");
    }

    const resendId = response.data?.id || null;
    console.log(`[EMAIL_SENT] Type: ${emailType}, Recipient: ${to}, ResendID: ${resendId}`);

    // Update log as sent with the Resend message ID
    if (logId) {
      await supabase
        .from("email_logs")
        .update({
          status: "sent",
          resend_id: resendId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", logId);
    }

    return { success: true, resendId };
  } catch (err: any) {
    const errorMsg = err.message || "Unknown error occurred during email transmission.";
    console.error("Error sending email:", errorMsg);
    console.log(`[EMAIL_FAILED] Type: ${emailType}, Recipient: ${to}, Error: ${errorMsg}`);

    if (logId) {
      await supabase
        .from("email_logs")
        .update({
          status: "failed",
          error: errorMsg,
          updated_at: new Date().toISOString(),
        })
        .eq("id", logId);
    }

    return { success: false, error: errorMsg };
  }
}
