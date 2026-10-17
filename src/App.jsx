import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { Sidebar } from "./components/Sidebar";
import { ChatPage } from "./pages/ChatPage";
import { HistoryPage } from "./pages/HistoryPage";

/**
 * App Root Component
 * Sets up BrowserRouter, ChatProvider, and application routes:
 * /        -> Chat Page
 * /history -> History Page (Previous Suggestions)
 */
function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="app-layout">
          <Sidebar />
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
