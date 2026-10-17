import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { Header } from "../components/Header";
import { QuickSuggestions } from "../components/QuickSuggestions";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { FeedbackModal } from "../components/FeedbackModal";
import { EndOfConversationFeedback } from "../components/EndOfConversationFeedback";

/**
 * ChatPage Component (Route: /)
 * Main interactive chatbot view.
 * Displays greeting/quick suggestions when empty,
 * message cards when conversation is active,
 * floating feedback buttons, and the fixed input bar.
 */
export const ChatPage = () => {
  const { messages, toastMessage } = useChat();
  const scrollEndRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (messages.length > 0) {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="main-wrapper">
      <Header />

      <main className="chat-page-content">
        <div className="chat-scroll-area">
          {messages.length === 0 ? (
            <QuickSuggestions />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <EndOfConversationFeedback />
              <div ref={scrollEndRef} style={{ height: "8px" }} />
            </>
          )}
        </div>

        {/* Fixed Input Form at Bottom */}
        <ChatInput />
      </main>

      {/* Thumbs Down Feedback Modal */}
      <FeedbackModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
