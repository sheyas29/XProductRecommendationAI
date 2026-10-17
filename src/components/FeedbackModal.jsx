import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { MessageSquare, X } from "lucide-react";

/**
 * FeedbackModal Component
 * Modal titled "Provide Additional Feedback" opened via Thumbs Down.
 * Contains:
 * - Title "Provide Additional Feedback"
 * - Close button '✕'
 * - Textarea for subjective feedback
 * - Submit button
 */
export const FeedbackModal = () => {
  const { activeModalMessageId, setActiveModalMessageId, submitMessageFeedback } =
    useChat();
  const [feedbackText, setFeedbackText] = useState("");

  if (!activeModalMessageId) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeModalMessageId) {
      submitMessageFeedback(activeModalMessageId, feedbackText);
      setFeedbackText("");
    }
  };

  const handleClose = () => {
    setActiveModalMessageId(null);
    setFeedbackText("");
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={handleClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <MessageSquare size={20} color="#936ac7" strokeWidth={2.2} />
            <h3 id="feedback-modal-title" className="modal-title">
              Provide Additional Feedback
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <textarea
            className="modal-textarea"
            placeholder="Please share what didn't work or how we can improve..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={5}
            required
            autoFocus
          />

          <div className="modal-actions">
            <button type="submit" className="modal-submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
