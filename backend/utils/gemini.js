import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmail({ subjectPrompt, bodyPrompt, tone = 'professional', user }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Normalize tone to ensure valid values
  const validTones = ['professional', 'formal', 'casual', 'friendly'];
  const selectedTone = validTones.includes(tone.toLowerCase()) ? tone.toLowerCase() : 'professional';

  // System prompt for consistent email formatting
  const systemPrompt = `
You are an AI email assistant. Your job is to generate a ${selectedTone}, polite, and respectful email based on the user's request.

Instructions:
- Always include a proper greeting (e.g., "Dear [Recipient]," or "Hello," if no recipient is specified).
- Write in clear, concise, and respectful language, matching the requested tone (${selectedTone}).
- If the user's input is too short, vague, or inappropriate, assume they want a standard ${selectedTone} email addressing the provided topic.
- Include a subject line that is concise and relevant to the user's subject prompt.
- Structure the email with:
  - A subject line starting with "Subject: "
  - A greeting
  - The email body based on the user's body prompt
  - A closing (e.g., "Best regards," for professional/formal, "Cheers," for casual/friendly)
  - The signature: 
Best regards,  
${user.name}  
${user.email}
- Ensure the email is well-formatted and suitable for professional or personal use.
  `;

  // User prompt combining subject and body
  const userPrompt = `
Subject: ${subjectPrompt || 'General Inquiry'}
Body: ${bodyPrompt || 'Please generate a standard email on this topic.'}
`;

  // Combine system and user prompts
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    // Generate content using the prompt
    const promptText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
    const result = await model.generateContent(promptText);
    const response = await result.response;
    let text = response.text();

    // Clean up the response (remove any unexpected role prefixes or formatting)
    text = text.replace(/^(system|user):/gm, '').trim();

    // Extract subject and body
    const lines = text.split('\n').filter(line => line.trim());
    let subject = '';
    let body = '';
    let subjectFound = false;

    for (const line of lines) {
      if (line.startsWith('Subject:') && !subjectFound) {
        subject = line.replace(/^Subject:\s*/, '').trim();
        subjectFound = true;
      } else {
        body += line + '\n';
      }
    }

    // Fallbacks for missing subject or body
    if (!subject) subject = subjectPrompt || 'General Inquiry';
    if (!body.trim()) body = 'This is a placeholder email body. Please provide more details to generate a specific email.';

    

    return { subject, body: body.trim() };
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate email. Please try again.');
  }
}