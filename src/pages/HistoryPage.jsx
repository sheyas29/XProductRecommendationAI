import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { Header } from "../components/Header";
import { ChatMessage } from "../components/ChatMessage";
import { Star } from "lucide-react";

/**
 * HistoryPage Component (Route: /history)
 * Displays saved conversation threads from localStorage.
 * Includes:
 * - Centered title "Previous Suggestions"
 * - "Filter by rating" dropdown with "All Ratings", 1, 2, 3, 4, 5
 * - "Today's chats" list of saved conversation threads
 * - Supports responsive display and dark/light mode
 */
export const HistoryPage = () => {
  const { savedConversations } = useChat();
  const [selectedRating, setSelectedRating] = useState("All Ratings");

  // Filter conversations based on selected rating
  const filteredConversations = savedConversations.filter((conv) => {
    if (selectedRating === "All Ratings") return true;
    const targetRating = parseInt(selectedRating, 10);
    // Matches overall rating or any rated message inside conversation
    const hasMatchingOverallRating = conv.rating === targetRating;
    const hasMatchingMessageRating = conv.messages?.some(
      (m) => m.rating === targetRating
    );
    return hasMatchingOverallRating || hasMatchingMessageRating;
  });

  return (
    <div className="main-wrapper">
      <Header />

      <main className="history-page-content">
        <h2 className="history-page-heading">Previous Suggestions</h2>

        {/* Filter by rating dropdown */}
        <div className="history-filter-wrapper">
          <label htmlFor="rating-filter" className="history-filter-label">
            Filter by rating
          </label>
          <select
            id="rating-filter"
            name="rating-filter"
            className="history-filter-select"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="All Ratings">All Ratings</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* Saved Conversations List */}
        <div className="history-section-title">Today's chats</div>

        <div className="history-threads-list">
          {filteredConversations.length === 0 ? (
            <div className="history-empty-state">
              No previous suggestions found.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="history-thread-group">
                {/* Thread Meta Header if rated */}
                {(conv.rating > 0 || conv.feedback) && (
                  <div className="history-thread-meta">
                    {conv.rating > 0 && (
                      <div className="history-thread-stars">
                        <span>Overall Rating:</span>
                        <div className="stars-row">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= conv.rating ? "var(--star-filled)" : "none"}
                              stroke={s <= conv.rating ? "var(--star-filled)" : "var(--star-empty)"}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {conv.feedback && (
                      <div className="history-thread-feedback">
                        Feedback: "{conv.feedback}"
                      </div>
                    )}
                  </div>
                )}

                {/* Messages in thread */}
                {conv.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isHistoryView={true}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
