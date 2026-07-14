import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  // Ensure the API key exists before trying to initialize Resend
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured in .env' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  try {
    const data = await request.json();
    const { to, subject, html } = data;

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // IMPORTANT: In production, change the 'from' email to a verified domain on your Resend account.
    // 'onboarding@resend.dev' only works if 'to' is the exact email address you used to sign up for Resend.
    const resendData = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    return new Response(JSON.stringify(resendData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
