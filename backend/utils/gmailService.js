import { google } from 'googleapis';

export async function sendEmail({ googleAccessToken, to, subject, body, user }) {

  
  try {
    if (!googleAccessToken) {
      throw new Error('Access token is missing');
    }
    if (!to || !subject || !body || !user?.email || !user?.name) {
      throw new Error('Missing required fields: to, subject, body, user.email, or user.name');
    }
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ access_token:googleAccessToken });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const messageParts = [
      `To: ${to}`,
      `From: ${user.name} <${user.email}>`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ];

    const message = messageParts.join('\n');
  
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  
    return res.data;
  } catch (error) {
    console.error('Error sending email:', error.message, error.response?.data || error);
    throw new Error(`Failed to send email: ${error.message}`);
  }



}
