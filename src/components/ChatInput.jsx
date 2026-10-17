import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

/**
 * ChatInput Component
 * Renders:
 * - Query input with exact placeholder: "Please tell me about your query!"
 * - "Ask" button with type="submit"
 * - "Save" button with type="button"
 */
export const ChatInput = () => {
  const [inputText, setInputText] = useState("");
  const { handleSendMessage, saveConversation } = useChat();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="query"
          id="query-input"
          className="query-input"
          placeholder="Please tell me about your query!"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoComplete="off"
        />

        <button
          type="submit"
          name="ask"
          id="ask-button"
          className="btn-ask"
        >
          Ask
        </button>

        <button
          type="button"
          name="save"
          id="save-button"
          className="btn-save"
          onClick={saveConversation}
        >
          Save
        </button>
      </form>
    </div>
  );
};
