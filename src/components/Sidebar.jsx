import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import { MessageSquare, PlusSquare } from "lucide-react";

/**
 * Sidebar Component
 * Provides:
 * - "Want new suggestion?" Link (to="/"): Saves current conversation and resets the chat
 * - "Previous Suggestions" Link (to="/history"): Navigates to the /history route
 */
export const Sidebar = () => {
  const location = useLocation();
  const { startNewConversation } = useChat();

  const handleNewSuggestionClick = () => {
    startNewConversation();
  };

  return (
    <aside className="app-sidebar">
      {/* Want new suggestion? Link to / */}
      <Link
        to="/"
        className="new-chat-btn"
        onClick={handleNewSuggestionClick}
        title="Start a new suggestion session"
        style={{ textDecoration: "none" }}
      >
        <div className="new-chat-btn-left">
          <div className="chat-bubble-icon-box green">
            <MessageSquare size={18} fill="#ffffff" color="#ffffff" />
          </div>
          <span>Want new suggestion?</span>
        </div>
        <PlusSquare size={18} strokeWidth={2} />
      </Link>

      {/* Previous Suggestions Navigation Link to /history */}
      <Link
        to="/history"
        className={`sidebar-nav-btn ${
          location.pathname === "/history" ? "active" : ""
        }`}
      >
        Previous Suggestions
      </Link>
    </aside>
  );
};
