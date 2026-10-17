import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PRODUCT_CATALOG,
  FALLBACK_RESPONSE,
  identifyProduct,
  matchBudget,
} from "../data/mockData";
import { getCurrentTimeString } from "../utils/time";

const ChatContext = createContext(null);

const STORAGE_KEY_CONVERSATIONS = "product_ai_conversations";
const STORAGE_KEY_THEME = "product_ai_theme";

export const ChatProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || "light";
  });

  // Saved conversations
  const [savedConversations, setSavedConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current active conversation
  const [currentConvId, setCurrentConvId] = useState(() => `conv_${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const messagesRef = React.useRef([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stage, setStage] = useState("initial"); // 'initial' | 'waiting_for_budget' | 'recommendation_completed'

  // Sync messagesRef with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // End-of-conversation feedback
  const [overallRating, setOverallRating] = useState(0);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Thumbs down modal state
  const [activeModalMessageId, setActiveModalMessageId] = useState(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState("");

  // Sync theme to root class and localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Persist saved conversations
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CONVERSATIONS,
        JSON.stringify(savedConversations)
      );
      localStorage.setItem("conversations", JSON.stringify(savedConversations));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [savedConversations]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Helper to persist current conversation into saved list
  const persistCurrentConversation = (
    customMessages = messagesRef.current.length > 0 ? messagesRef.current : messages,
    customRating = overallRating,
    customFeedback = overallFeedback
  ) => {
    const msgsToSave =
      customMessages && customMessages.length > 0
        ? customMessages
        : messagesRef.current;
    if (!msgsToSave || msgsToSave.length === 0) return;

    setSavedConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === currentConvId);
      const conversationData = {
        id: currentConvId,
        date: "Today's chats",
        timestamp:
          msgsToSave[msgsToSave.length - 1]?.timestamp || getCurrentTimeString(),
        messages: msgsToSave,
        rating: customRating,
        feedback: customFeedback,
        updatedAt: Date.now(),
      };

      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = conversationData;
      } else {
        updated = [conversationData, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
        localStorage.setItem("conversations", JSON.stringify(updated));
      } catch (err) {
        console.error("Synchronous localStorage save error:", err);
      }
      return updated;
    });
    setIsSaved(true);
  };

  // Save button action (explicit user action)
  const saveConversation = () => {
    const msgsToSave = messagesRef.current.length > 0 ? messagesRef.current : messages;
    if (msgsToSave.length === 0) {
      showToast("Cannot save an empty conversation.");
      return;
    }
    persistCurrentConversation(msgsToSave, overallRating, overallFeedback);
    showToast("Conversation saved successfully!");
  };

  // Start new conversation / "Want new suggestion?"
  const startNewConversation = () => {
    const msgsToSave = messagesRef.current.length > 0 ? messagesRef.current : messages;
    if (msgsToSave.length > 0) {
      // Save before resetting as required by Step 7
      persistCurrentConversation(msgsToSave, overallRating, overallFeedback);
    }
    // Reset state
    messagesRef.current = [];
    setMessages([]);
    setSelectedProduct(null);
    setStage("initial");
    setOverallRating(0);
    setOverallFeedback("");
    setIsSaved(false);
    setCurrentConvId(`conv_${Date.now()}`);
    setActiveModalMessageId(null);
  };

  // Select quick suggestion card (e.g. Jeans, Smartphone, Laptop, T-Shirt)
  const handleSelectQuickSuggestion = (productName) => {
    const productKey = identifyProduct(productName) || productName;
    const userMsg = {
      id: `msg_${Date.now()}_u`,
      sender: "You",
      content: productName,
      timestamp: getCurrentTimeString(),
    };

    const productConfig = PRODUCT_CATALOG[productKey];
    let botMsg;
    if (productConfig) {
      botMsg = {
        id: `msg_${Date.now()}_b`,
        sender: "Product Recommendation AI",
        content: productConfig.budgetPrompt,
        timestamp: getCurrentTimeString(),
        allowFeedback: true,
        rating: 0,
        feedback: "",
      };
      setSelectedProduct(productKey);
      setStage("waiting_for_budget");
    } else {
      botMsg = {
        id: `msg_${Date.now()}_b`,
        sender: "Product Recommendation AI",
        content: FALLBACK_RESPONSE,
        timestamp: getCurrentTimeString(),
        allowFeedback: true,
        rating: 0,
        feedback: "",
      };
    }

    const newMsgs = [...messagesRef.current, userMsg, botMsg];
    messagesRef.current = newMsgs;
    setMessages(newMsgs);
  };

  // Handle user typing into input
  const handleSendMessage = (inputText) => {
    const text = inputText?.trim();
    if (!text) return;

    const userMsg = {
      id: `msg_${Date.now()}_u`,
      sender: "You",
      content: text,
      timestamp: getCurrentTimeString(),
    };

    const timeNow = getCurrentTimeString();

    if (stage === "initial" || stage === "recommendation_completed") {
      const matchedKey = identifyProduct(text);
      if (matchedKey) {
        const productConfig = PRODUCT_CATALOG[matchedKey];
        const botMsg = {
          id: `msg_${Date.now()}_b`,
          sender: "Product Recommendation AI",
          content: productConfig.budgetPrompt,
          timestamp: timeNow,
          allowFeedback: true,
          rating: 0,
          feedback: "",
        };
        setSelectedProduct(matchedKey);
        setStage("waiting_for_budget");
        const newMsgs = [...messagesRef.current, userMsg, botMsg];
        messagesRef.current = newMsgs;
        setMessages(newMsgs);
      } else {
        const botFallback = {
          id: `msg_${Date.now()}_b`,
          sender: "Product Recommendation AI",
          content: FALLBACK_RESPONSE,
          timestamp: timeNow,
          allowFeedback: true,
          rating: 0,
          feedback: "",
        };
        const newMsgs = [...messagesRef.current, userMsg, botFallback];
        messagesRef.current = newMsgs;
        setMessages(newMsgs);
      }
    } else if (stage === "waiting_for_budget") {
      const matchedBudget = matchBudget(selectedProduct, text);
      if (matchedBudget) {
        // Multi-message bot reply matching screenshot:
        // Message 1: "Here are your product suggestions:-"
        // Message 2: "Wrogn, Link: https://www.wrogn.in" (with brand, link, and image)
        const botMsg1 = {
          id: `msg_${Date.now()}_b1`,
          sender: "Product Recommendation AI",
          content: "Here are your product suggestions:-",
          timestamp: timeNow,
          allowFeedback: true,
          rating: 0,
          feedback: "",
        };

        const botMsg2 = {
          id: `msg_${Date.now()}_b2`,
          sender: "Product Recommendation AI",
          content: `${matchedBudget.brand}, Link: ${matchedBudget.link}`,
          timestamp: timeNow,
          allowFeedback: true,
          rating: 0,
          feedback: "",
          image: matchedBudget.image,
          link: matchedBudget.link,
          brand: matchedBudget.brand,
          priceRange: matchedBudget.priceRange,
        };

        setStage("recommendation_completed");
        const newMsgs = [...messagesRef.current, userMsg, botMsg1, botMsg2];
        messagesRef.current = newMsgs;
        setMessages(newMsgs);
      } else {
        const botFallback = {
          id: `msg_${Date.now()}_b`,
          sender: "Product Recommendation AI",
          content: FALLBACK_RESPONSE,
          timestamp: timeNow,
          allowFeedback: true,
          rating: 0,
          feedback: "",
        };
        const newMsgs = [...messagesRef.current, userMsg, botFallback];
        messagesRef.current = newMsgs;
        setMessages(newMsgs);
      }
    }
  };

  // Rate individual AI message (Thumbs Up rating out of 5)
  const rateMessage = (messageId, stars) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return { ...m, rating: stars, thumbsUpActive: true };
        }
        return m;
      })
    );
  };

  // Provide subjective feedback for individual message (Thumbs Down modal)
  const submitMessageFeedback = (messageId, feedbackText) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return { ...m, feedback: feedbackText, thumbsDownActive: true };
        }
        return m;
      })
    );
    setActiveModalMessageId(null);
    showToast("Feedback submitted successfully!");
  };

  // Submit End of Conversation Rating & Feedback
  const submitEndFeedback = (rating, feedback) => {
    setOverallRating(rating);
    setOverallFeedback(feedback);
    persistCurrentConversation(messages, rating, feedback);
    showToast("Thank you for your rating and feedback!");
  };

  return (
    <ChatContext.Provider
      value={{
        theme,
        toggleTheme,
        messages,
        stage,
        selectedProduct,
        overallRating,
        overallFeedback,
        isSaved,
        savedConversations,
        activeModalMessageId,
        setActiveModalMessageId,
        toastMessage,
        handleSendMessage,
        handleSelectQuickSuggestion,
        saveConversation,
        startNewConversation,
        rateMessage,
        submitMessageFeedback,
        submitEndFeedback,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
