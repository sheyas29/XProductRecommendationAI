import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { Star } from "lucide-react";

/**
 * EndOfConversationFeedback Component
 * Provides end-of-conversation rating (1-5 stars) and subjective feedback textarea.
 * Separate from individual AI response feedback.
 */
export const EndOfConversationFeedback = () => {
  const { stage, overallRating, overallFeedback, submitEndFeedback } = useChat();
  const [rating, setRating] = useState(overallRating || 0);
  const [feedback, setFeedback] = useState(overallFeedback || "");
  const [submitted, setSubmitted] = useState(false);

  // Render when recommendation flow is completed or conversation has progressed
  if (stage !== "recommendation_completed") {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEndFeedback(rating, feedback);
    setSubmitted(true);
  };

  return (
    <div className="end-feedback-card" id="end-of-conversation-feedback">
      <div className="end-feedback-title">Rate your overall conversation experience</div>

      {submitted ? (
        <div style={{ color: "var(--accent-purple)", fontWeight: 600, fontSize: "14px" }}>
          Thank you for your rating ({rating}/5) and feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 5 Star Rating */}
          <div className="end-feedback-rating-row">
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Overall Rating:
            </span>
            <div className="stars-row" role="radiogroup" aria-label="Overall conversation rating">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= rating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    className={`star-btn ${isFilled ? "filled" : ""}`}
                    onClick={() => setRating(starValue)}
                    aria-label={`${starValue} star rating`}
                  >
                    <Star
                      size={20}
                      fill={isFilled ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={1.8}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-purple)" }}>
                {rating} / 5
              </span>
            )}
          </div>

          {/* Subjective Feedback Textarea */}
          <textarea
            className="end-feedback-textarea"
            placeholder="Please leave subjective feedback about your recommendation experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button type="submit" className="end-feedback-submit-btn">
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};
