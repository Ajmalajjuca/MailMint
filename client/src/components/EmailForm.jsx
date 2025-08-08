import { useState, useEffect } from "react";
import { appservice } from "../servise/servise";
import toast from "react-hot-toast";

const EMAIL_TEMPLATES = {
  business: {
    name: "Business Inquiry",
    icon: "💼",
    subjectPrompt: "Professional inquiry about [topic]",
    bodyPrompt:
      "Write a formal business email inquiring about [specific request]",
  },
  followup: {
    name: "Follow-up",
    icon: "🔄",
    subjectPrompt: "Following up on [previous topic]",
    bodyPrompt:
      "Write a polite follow-up email regarding [previous conversation/meeting]",
  },
  thank: {
    name: "Thank You",
    icon: "🙏",
    subjectPrompt: "Thank you for [reason]",
    bodyPrompt: "Write a heartfelt thank you email for [specific reason]",
  },
  apology: {
    name: "Apology",
    icon: "😔",
    subjectPrompt: "Apologies for [issue]",
    bodyPrompt: "Write a sincere apology email for [specific situation]",
  },
};

// Email Form Component
function EmailForm() {
  const [formData, setFormData] = useState({
    recipients: [""], // Array of recipients
    subjectPrompt: "",
    bodyPrompt: "",
    subject: "",
    body: "",
    tone: "professional",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [emailHistory, setEmailHistory] = useState([]);
  

  const toneOptions = [
    { value: "professional", label: "Professional", icon: "💼" },
    { value: "friendly", label: "Friendly", icon: "😊" },
    { value: "formal", label: "Formal", icon: "🎩" },
    { value: "casual", label: "Casual", icon: "👋" },
  ];

  // Add new recipient input
  const addRecipient = () => {
    setFormData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, ""],
    }));
  };

  // Remove recipient input
  const removeRecipient = (index) => {
    if (formData.recipients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index),
      }));
    }
  };

  // Update specific recipient
  const updateRecipient = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) =>
        i === index ? value : recipient
      ),
    }));
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Get valid recipients
  const getValidRecipients = () => {
    return formData.recipients.filter(
      (email) => email.trim() && isValidEmail(email.trim())
    );
  };

  const generateEmail = async () => {

    if (!formData.subjectPrompt.trim() || !formData.bodyPrompt.trim()) {
      toast.error("Please fill in both subject and body prompts", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }

    const validRecipients = getValidRecipients();
    if (validRecipients.length === 0) {
      toast.error("Please enter at least one valid recipient email", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }

    setLoading(true);

    const response = await appservice.generateEmail({
      subjectPrompt: formData.subjectPrompt,
      bodyPrompt: formData.bodyPrompt,
      tone: formData.tone,
    });

    const generatedEmail = response.data;

    const generatedSubject = `Subject: ${generatedEmail.subject}`;
    const generatedBody = generatedEmail.body;
    toast.success("Email generated successfully", {
      style: {
        border: "1px solid #713200",
        padding: "16px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });

    setFormData((prev) => ({
      ...prev,
      subject: generatedSubject,
      body: generatedBody,
    }));

    setStep(2);
    setLoading(false);
  };

  const sendEmail = async () => {
    try {

      const validRecipients = getValidRecipients();
      if (validRecipients.length === 0) {
        toast.error("Please enter at least one valid recipient email", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        return;
      }

      const emailData = {
        recipients: validRecipients,
        subject: formData.subject,
        body: formData.body,
        tone: formData.tone,
      };
      setLoading(true);
      const response = await appservice.sendEmail(emailData);
      console.log("Email sent successfully:", response);

      // Reset form
      setFormData({
        recipients: [""],
        subjectPrompt: "",
        bodyPrompt: "",
        subject: "",
        body: "",
        tone: "professional",
      });
      setStep(1);

      toast.success(
        `Email sent successfully to ${
          validRecipients.length
        } recipient(s):\n${validRecipients.join("\n")}`,
        {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getEmail = async () => {
    try {
      const response = await appservice.getSentEmails();
      setEmailHistory(response.data.emails);
    } catch (error) {
      console.error("Error fetching email history:", error);
      toast.error("Failed to fetch email history. Please try again.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
  };
  
  // Fetch email history on component mount
  useEffect(() => {
    getEmail();
  }, []);

  const useTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      subjectPrompt: template.subjectPrompt,
      bodyPrompt: template.bodyPrompt,
    }));
  };

  const resetForm = () => {
    setFormData({
      recipients: [""],
      subjectPrompt: "",
      bodyPrompt: "",
      subject: "",
      body: "",
      tone: "professional",
    });
    setStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="steps w-full">
        <div className={`step ${step >= 1 ? "step-primary" : ""}`}>
          Generate
        </div>
        <div className={`step ${step >= 2 ? "step-primary" : ""}`}>
          Review & Send
        </div>
      </div>

      {step === 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-content"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Generate Email</h2>
            </div>

            {/* Email Templates */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quick Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => useTemplate(template)}
                    className="btn btn-outline btn-sm text-left justify-start gap-2"
                  >
                    <span>{template.icon}</span>
                    <span className="truncate">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="label">
                  <span className="label-text font-semibold">
                    Recipient Emails
                  </span>
                </label>
                <button
                  type="button"
                  onClick={addRecipient}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Recipient
                </button>
              </div>

              <div className="space-y-3">
                {formData.recipients.map((recipient, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="label-text text-sm font-medium">
                        Recipient {index + 1}
                      </label>
                      {formData.recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="btn btn-outline btn-error btn-xs gap-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      className={`input input-bordered w-full ${
                        recipient && !isValidEmail(recipient)
                          ? "input-error"
                          : ""
                      }`}
                      placeholder={`recipient${index + 1}@example.com`}
                    />
                  </div>
                ))}
              </div>

              {/* Recipient count and validation */}
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-base-content/70">
                  {getValidRecipients().length} valid recipient(s)
                </span>
                {formData.recipients.some(
                  (email) => email && !isValidEmail(email)
                ) && (
                  <span className="text-error">Some emails are invalid</span>
                )}
              </div>
            </div>

            {/* Email Tone */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Email Tone</span>
              </label>
              <select
                value={formData.tone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tone: e.target.value }))
                }
                className="select select-bordered w-full"
              >
                {toneOptions.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.icon} {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Subject Prompt</span>
              </label>
              <input
                type="text"
                value={formData.subjectPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subjectPrompt: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Describe what the email subject should be about..."
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">Body Prompt</span>
              </label>
              <textarea
                value={formData.bodyPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bodyPrompt: e.target.value,
                  }))
                }
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Describe what the email content should include..."
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={generateEmail}
              disabled={
                loading ||
                !formData.subjectPrompt.trim() ||
                !formData.bodyPrompt.trim() ||
                getValidRecipients().length === 0
              }
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Generate Email
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-success-content"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Review & Send</h2>
              </div>
              <button onClick={resetForm} className="btn btn-ghost btn-sm">
                ← Start Over
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Recipients Display */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    To: ({getValidRecipients().length} recipient
                    {getValidRecipients().length !== 1 ? "s" : ""})
                  </span>
                </label>
                <div className="bg-base-200 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {getValidRecipients().map((email, index) => (
                      <span key={index} className="badge badge-primary gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Subject:</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Body:</span>
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, body: e.target.value }))
                  }
                  className="textarea textarea-bordered h-40 w-full"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-success flex-1"
                onClick={sendEmail}
                disabled={getValidRecipients().length === 0}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    Send to {getValidRecipients().length} Recipient
                    {getValidRecipients().length !== 1 ? "s" : ""}
                  </>
                )}
              </button>
              <button onClick={resetForm} className="btn btn-outline">
                Generate New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email History */}
      {emailHistory.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">Recent Emails</h3>
            <div className="space-y-3">
              {emailHistory.slice(0, 5).map((email) => (
                <div
                  key={email.id}
                  className="border border-base-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{email.subject}</p>
                      <div className="text-sm text-base-content/70 mt-1">
                        <span>To: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {email?.recipients?.map((recipient, index) => (
                            <span
                              key={index}
                              className="badge badge-outline badge-sm"
                            >
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`badge badge-${
                          email.tone === "professional"
                            ? "primary"
                            : "secondary"
                        } badge-sm`}
                      >
                        {email.tone}
                      </span>
                      <p className="text-xs text-base-content/50 mt-1">
                        {email.sentAt}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2">{email.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailForm;
