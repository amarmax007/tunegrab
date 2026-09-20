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

/**
 * Sends official VIP Premium License Key directly to user's inbox
 */
export async function sendLicenseKeyEmail({ email, key, plan, amount }) {
  const transporter = getTransporter();

  console.log(`\n========================================`);
  console.log(`⚡ [TuneGrab Premium License Key Dispatch]`);
  console.log(`To: ${email}`);
  console.log(`License Key: ${key}`);
  console.log(`Plan: ${plan} (₹${amount})`);
  console.log(`========================================\n`);

  if (!transporter) return { sent: false };

  const subject = `⚡ Your TuneGrab Premium License Key (${plan.toUpperCase()})`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #121316; color: #ffffff; border-radius: 24px; padding: 36px; border: 1px solid #23252e;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 6px 14px; color: #10b981; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
          ⚡ PAYMENT VERIFIED
        </div>
        <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; margin: 12px 0 4px 0; letter-spacing: -0.5px;">Welcome to TuneGrab Premium</h1>
        <p style="color: #8e8f9c; font-size: 13px; margin: 0;">100% Ad-Free • 3x Fast Downloads • Unlimited Batch ZIP</p>
      </div>

      <div style="background: #1a1b22; border-radius: 18px; padding: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #9ca3af; font-size: 13px; margin-top: 0;">Your Official Premium License Key is:</p>
        
        <div style="background: #0f1015; border: 2px solid #10b981; border-radius: 14px; padding: 18px; margin: 18px 0; display: inline-block; width: 85%;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; letter-spacing: 3px; color: #10b981;">${key}</span>
        </div>

        <div style="text-align: left; background: #121316; border-radius: 12px; padding: 14px; margin-top: 14px; font-size: 12px; color: #d1d5db; line-height: 1.6;">
          <div>• <strong>Plan:</strong> ${plan.toUpperCase()} (₹${amount})</div>
          <div>• <strong>Status:</strong> Active & Linked to ${email}</div>
          <div>• <strong>Device Sync:</strong> Click <em>"I already paid"</em> on any phone/PC and enter this key to restore Ad-Free!</div>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #6b7280;">
        <p style="margin: 0;">Need help? Contact support or reply to this email.</p>
        <p style="margin-top: 6px;">&copy; ${new Date().getFullYear()} TuneGrab Universal Music Studio.</p>
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
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('Failed to send license key email:', err);
    return { sent: false, error: err.message };
  }
}
