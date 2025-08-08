import { generateEmail } from "../utils/gemini.js";
import { sendEmail } from "../utils/gmailService.js";
import Email from "../model/mail.model.js";

export const generateEmailContent = async (req, res) => {
  const { subjectPrompt, bodyPrompt, tone } = req.body;
  const user = req.user; // comes from auth middleware

  try {
    const { subject, body } = await generateEmail({
      subjectPrompt,
      bodyPrompt,
      tone,
      user,
    });

    res.json({ subject, body });
  } catch (err) {
    console.error("Error generating email:", err);
    res.status(500).json({ error: "Failed to generate email." });
  }
};

export const sendGeneratedEmail = async (req, res) => {
  const { recipients, subject, body, googleAccessToken, tone } = req.body;
  const user = req.user;

  try {
    const result = await sendEmail({
      googleAccessToken, // Google access token
      to: recipients.join(","),
      subject,
      body,
      user,
    });

    // Save email to DB
    const saved = await Email.create({
      senderId: user.userId,
      recipients,
      subject,
      body,
      tone,
    });

    res.json({ message: "Email sent successfully", result, saved });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
};

export const getSentEmails = async (req, res) => {
  try {
    const { user } = req;
    const emails = await Email.find({ senderId: user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ emails });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};
