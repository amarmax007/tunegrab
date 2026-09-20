import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
function getTransporter() {
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || 'mramarmax@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || 'atrecubpdbubeftu').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a real 6-digit OTP email to the user's email inbox
 */
export async function sendOtpEmail({ email, code, purpose = 'registration' }) {
  const transporter = getTransporter();

  console.log(`\n========================================`);
  console.log(`📩 [TuneGrab Live OTP Dispatch]`);
  console.log(`To: ${email}`);
  console.log(`6-Digit Verification PIN: ${code}`);
  console.log(`Purpose: ${purpose}`);
  console.log(`========================================\n`);

  if (!transporter) {
    throw new Error('Email server is not configured. Please check SMTP credentials.');
  }

  const subject = purpose === 'reset'
    ? '🔐 TuneGrab Studio - Password Reset Verification Code'
    : '🎵 TuneGrab Studio - Verify Your Email & Activate Account';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #141416; color: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #2a2b36;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #f0fc54; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">TuneGrab Studio</h1>
        <p style="color: #8e8f9c; font-size: 13px; margin-top: 4px;">Universal 320kbps Music Downloader & Cloud Studio</p>
      </div>

      <div style="background: #1c1d24; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #d1d2dc; font-size: 14px; margin-top: 0;">Your official 6-digit security verification code is:</p>
        
        <div style="background: #272833; border: 2px dashed #f0fc54; border-radius: 12px; padding: 16px; margin: 20px 0; display: inline-block; min-width: 220px;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #f0fc54;">${code}</span>
        </div>

        <p style="color: #8e8f9c; font-size: 12px; margin-bottom: 0;">
          This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #6b6c7e;">
        <p style="margin: 0;">If you did not request this verification code, please ignore this email.</p>
        <p style="margin-top: 6px;">&copy; ${new Date().getFullYear()} TuneGrab Universal Studio. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const sender = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || 'mramarmax@gmail.com';
    const info = await transporter.sendMail({
      from: `"TuneGrab Studio" <${sender}>`,
      to: email,
      subject,
      html,
    });

    console.log(`✅ Real email successfully sent to ${email}. MessageId: ${info.messageId}`);

    return {
      sent: true,
      mode: 'smtp',
      messageId: info.messageId,
      message: `Verification code successfully sent to ${email}.`,
    };
  } catch (err) {
    console.error('❌ Failed to dispatch email via Gmail SMTP:', err);
    throw new Error(`Failed to deliver email to ${email}: ${err.message}`);
  }
}
