import React from "react";
import { useChat } from "../context/ChatContext";
import { Sun, Moon } from "lucide-react";

/**
 * Header Component
 * Displays the required <h1> "Product Recommendation AI"
 * and the Theme Toggle button (Light / Dark mode).
 */
export const Header = () => {
  const { theme, toggleTheme } = useChat();

  return (
    <header className="app-header">
      <h1>Product Recommendation AI</h1>

      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle Light and Dark Mode"
      >
        <span>{theme === "light" ? "Light" : "Dark"}</span>
        {theme === "light" ? (
          <Sun size={18} strokeWidth={2.2} />
        ) : (
          <Moon size={18} strokeWidth={2.2} />
        )}
      </button>
    </header>
  );
};
