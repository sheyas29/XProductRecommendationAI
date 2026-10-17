import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { User, Bot, ThumbsUp, ThumbsDown, Star } from "lucide-react";

/**
 * ChatMessage Component
 * Renders individual user and AI messages.
 * Features:
 * - Specific styling for User vs Product Recommendation AI
 * - Hover-based floating Thumbs Up / Thumbs Down controls for AI responses
 * - Thumbs Up reveals 5-star rating control ("Rate this reponse:")
 * - Thumbs Down opens the "Provide Additional Feedback" modal
 * - Supports product links, recommendation images, and timestamps
 */
export const ChatMessage = ({ message, isHistoryView = false }) => {
  const { rateMessage, setActiveModalMessageId } = useChat();
  const [showRatingBar, setShowRatingBar] = useState(false);

  const isBot = message.sender === "Product Recommendation AI";
  const isUser = message.sender === "You";

  const handleThumbsUpClick = () => {
    setShowRatingBar(true);
    if (!message.rating) {
      rateMessage(message.id, 5); // Default to 5 or prompt selection
    }
  };

  const handleThumbsDownClick = () => {
    setActiveModalMessageId(message.id);
  };

  const handleStarClick = (stars) => {
    rateMessage(message.id, stars);
  };

  // Helper to render content with clickable links if present
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlPattern);

    return parts.map((part, index) => {
      if (part.match(urlPattern)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="product-link"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`message-card ${isHistoryView ? "history-variant" : ""}`}
      id={`message-${message.id}`}
    >
      {/* Message Avatar */}
      <div
        className={`message-avatar ${
          isUser ? "user-avatar" : "bot-avatar"
        }`}
      >
        {isUser ? (
          <User size={22} strokeWidth={2.2} />
        ) : (
          <Bot size={22} strokeWidth={2.2} />
        )}
      </div>

      {/* Message Body */}
      <div className="message-body">
        <div className="message-header">
          <span className="message-sender">{message.sender}</span>
          <span className="message-time">{message.timestamp}</span>
        </div>

        <div className="message-content">
          {renderFormattedContent(message.content)}
        </div>

        {/* Product image if recommendation */}
        {message.image && (
          <img
            src={message.image}
            alt={message.brand || "Product recommendation"}
            className="recommendation-preview-image"
            loading="lazy"
          />
        )}

        {/* In-message Rating row when thumbs-up is clicked or already rated */}
        {isBot && (showRatingBar || (message.rating && message.rating > 0)) ? (
          <div className="message-rating-box">
            <span className="rating-label">Rate this reponse:</span>
            <div className="stars-row" role="radiogroup" aria-label="Rate response">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= (message.rating || 0);
                return (
                  <button
                    key={starValue}
                    type="button"
                    className={`star-btn ${isFilled ? "filled" : ""}`}
                    onClick={() => handleStarClick(starValue)}
                    aria-label={`${starValue} star`}
                    disabled={isHistoryView}
                  >
                    <Star
                      size={16}
                      fill={isFilled ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={1.8}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Display feedback text if present in history view */}
        {Boolean(message.feedback) && (
          <div className="history-thread-feedback">
            Feedback: "{message.feedback}"
          </div>
        )}
      </div>

      {/* Floating Thumbs Up / Down controls (appear on hover for AI responses) */}
      {!isHistoryView && isBot && (
        <div className="ai-actions-float" aria-label="AI response actions">
          <button
            type="button"
            className={`thumb-btn ${message.thumbsUpActive ? "active" : ""}`}
            onClick={handleThumbsUpClick}
            title="Like response & rate"
            aria-label="Thumbs up"
          >
            <ThumbsUp size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`thumb-btn ${message.thumbsDownActive ? "active" : ""}`}
            onClick={handleThumbsDownClick}
            title="Dislike response & give feedback"
            aria-label="Thumbs down"
          >
            <ThumbsDown size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};
