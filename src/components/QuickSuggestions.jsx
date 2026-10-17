import React from "react";
import { useChat } from "../context/ChatContext";
import { Bot } from "lucide-react";

/**
 * QuickSuggestions Component
 * Displays the initial welcoming screen:
 * - "Hi, Please tell me what you want?"
 * - Centered bot avatar
 * - 4 Quick suggestion cards: Jeans, Smartphone, Laptop, T-Shirt
 */
export const QuickSuggestions = () => {
  const { handleSelectQuickSuggestion } = useChat();

  const suggestions = [
    {
      title: "Jeans",
      subtitle: "Get immediate AI generated response",
    },
    {
      title: "Smartphone",
      subtitle: "Get immediate AI generated response",
    },
    {
      title: "Laptop",
      subtitle: "Get immediate AI generated response",
    },
    {
      title: "T-Shirt",
      subtitle: "Get immediate AI generated response",
    },
  ];

  return (
    <div className="empty-chat-container">
      <h2 className="empty-chat-greeting">Hi, Please tell me what you want?</h2>

      <div className="bot-avatar-hero">
        <Bot size={36} color="#0288d1" strokeWidth={2.2} />
      </div>

      <div className="suggestions-grid">
        {suggestions.map((item) => (
          <div
            key={item.title}
            className="suggestion-card"
            onClick={() => handleSelectQuickSuggestion(item.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSelectQuickSuggestion(item.title);
              }
            }}
          >
            <div className="suggestion-card-title">{item.title}</div>
            <div className="suggestion-card-desc">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
