# Product Recommendation AI — Complete Architecture & Developer Guide

This document provides a comprehensive, component-by-component explanation of the **Product Recommendation AI** chatbot application. It details the system architecture, state machine patterns, UI/UX decisions, bug resolutions, and testing readiness so anyone can understand and build this project from scratch.

---

## 1. Project Overview & Architecture

The **Product Recommendation AI** is an intelligent multi-turn conversational interface that assists users in discovering products based on interactive choices and budget constraints. 

### Core Tech Stack:
- **UI Library**: React 19 (Functional Components with Hooks)
- **Routing**: React Router v7 (`/` for Chat, `/history` for Previous Suggestions)
- **Styling**: Vanilla CSS with CSS Custom Properties (Design Tokens for Light & Dark Themes)
- **Icons**: `lucide-react` (Vector icons for avatars, stars, thumbs, theme toggle, and actions)
- **Persistence**: Browser `localStorage` (saved conversation threads, user feedback, active theme)
- **Build Tool**: Vite 8 (Hot Module Replacement, fast bundling)

---

## 2. Directory Structure

```
d:/XProductRecommendationAI/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx             # User input bar with Ask and Save buttons
│   │   ├── ChatMessage.jsx           # Individual message cards with hover-based feedback
│   │   ├── EndOfConversationFeedback.jsx # Overall 5-star rating & subjective feedback
│   │   ├── FeedbackModal.jsx         # Thumbs-down subjective feedback modal dialog
│   │   ├── Header.jsx                # App title and Light/Dark mode toggle
│   │   ├── QuickSuggestions.jsx      # Initial welcoming screen with 4 product cards
│   │   └── Sidebar.jsx               # "Want new suggestion?" and navigation links
│   ├── context/
│   │   └── ChatContext.jsx           # Central state provider for chat flow, theme & storage
│   ├── data/
│   │   ├── mockData.json             # Predefined products, ranges, images, links & fallbacks
│   │   └── mockData.js               # Mock data export & parser helpers
│   ├── pages/
│   │   ├── ChatPage.jsx              # Main chatbot interface (Route: /)
│   │   └── HistoryPage.jsx           # Saved conversation history (Route: /history)
│   ├── utils/
│   │   └── time.js                   # Timestamp formatter (hh:mm A)
│   ├── App.jsx                       # Router setup & layout wrapper
│   ├── index.css                     # CSS Design system, CSS variables & animations
│   └── main.jsx                      # React DOM root entry point
├── index.html                        # HTML root with SEO tags and exact title
├── package.json                      # Dependencies and npm scripts
└── DOCUMENTATION.md                  # Comprehensive architectural guide
```

---

## 3. Component Deep Dive

### 3.1 `Header.jsx`
- **Location**: [Header.jsx](file:///d:/XProductRecommendationAI/src/components/Header.jsx)
- **Requirements Satisfied**:
  - Contains exact `<h1>` text: `"Product Recommendation AI"`.
  - Provides a Dark/Light mode toggle button showing current mode ("Light" / "Dark") with `Sun` and `Moon` icons.
- **Design Pattern**:
  - Reads `theme` and `toggleTheme` directly from `ChatContext`.

### 3.2 `Sidebar.jsx`
- **Location**: [Sidebar.jsx](file:///d:/XProductRecommendationAI/src/components/Sidebar.jsx)
- **Requirements Satisfied**:
  - Top action button: `"Want new suggestion?"` with message icon and plus icon.
  - Navigation button: `"Previous Suggestions"` directing users to `/history`.
- **Key Logic**:
  - When `"Want new suggestion?"` is clicked, it first persists the current conversation to `localStorage` (if messages exist), resets the chat state, and navigates to `/`.

### 3.3 `QuickSuggestions.jsx`
- **Location**: [QuickSuggestions.jsx](file:///d:/XProductRecommendationAI/src/components/QuickSuggestions.jsx)
- **Requirements Satisfied**:
  - Displays centered greeting: `"Hi, Please tell me what you want?"`.
  - Centered bot avatar.
  - 4 predefined suggestion cards:
    1. **Jeans**: "Get immediate AI generated response"
    2. **Smartphone**: "Get immediate AI generated response"
    3. **Laptop**: "Get immediate AI generated response"
    4. **T-Shirt**: "Get immediate AI generated response"
- **Interaction**:
  - Clicking any card immediately starts the multi-turn flow: posts user selection and triggers the bot's budget prompt.

### 3.4 `ChatMessage.jsx`
- **Location**: [ChatMessage.jsx](file:///d:/XProductRecommendationAI/src/components/ChatMessage.jsx)
- **Requirements Satisfied**:
  - Distinct avatars: Blue avatar for `"You"`, Cyan/Robot avatar for `"Product Recommendation AI"`.
  - Timestamp in 12-hour format (e.g. `05:42 PM`).
  - Render recommendation images and clickable external links.
  - Floating Thumbs Up / Thumbs Down controls:
    - **Hidden by default**, shown on hover via CSS `.message-card:hover .ai-actions-float`.
    - **Thumbs Up**: Reveals inline 5-star rating controls titled `"Rate this reponse:"`.
    - **Thumbs Down**: Opens the `"Provide Additional Feedback"` modal dialog.
  - Supports history view mode (`isHistoryView`) with purple-tinted styling.

### 3.5 `ChatInput.jsx`
- **Location**: [ChatInput.jsx](file:///d:/XProductRecommendationAI/src/components/ChatInput.jsx)
- **Requirements Satisfied**:
  - Input field with exact placeholder: `"Please tell me about your query!"`.
  - `"Ask"` button with `type="submit"`.
  - `"Save"` button with `type="submit"`.
- **Form Handling**:
  - Uses standard form submission (`onSubmit`). Differentiates button actions via `e.nativeEvent.submitter` or direct `onClick`, preventing unwanted double-submits while complying with strict `type="submit"` requirements.

### 3.6 `FeedbackModal.jsx`
- **Location**: [FeedbackModal.jsx](file:///d:/XProductRecommendationAI/src/components/FeedbackModal.jsx)
- **Requirements Satisfied**:
  - Dialog modal titled `"Provide Additional Feedback"`.
  - Message bubble icon and close `'✕'` button.
  - `<textarea>` for entering subjective feedback.
  - `"Submit"` button that saves feedback to the specific message and closes modal.

### 3.7 `EndOfConversationFeedback.jsx`
- **Location**: [EndOfConversationFeedback.jsx](file:///d:/XProductRecommendationAI/src/components/EndOfConversationFeedback.jsx)
- **Requirements Satisfied**:
  - Distinct from individual AI response feedback.
  - Triggers once recommendation flow completes.
  - Allows user to submit an overall 1-5 star rating and subjective feedback for the entire session.

### 3.8 `HistoryPage.jsx` (`/history`)
- **Location**: [HistoryPage.jsx](file:///d:/XProductRecommendationAI/src/pages/HistoryPage.jsx)
- **Requirements Satisfied**:
  - Heading: `"Previous Suggestions"`.
  - Filter by rating dropdown:
    - Label: `"Filter by rating"`.
    - Options: `"All Ratings"`, `1`, `2`, `3`, `4`, `5`.
  - Subheading: `"Today's chats"`.
  - Renders all previously saved conversations with message history, ratings, and feedback.

---

## 4. Multi-Turn State Machine & Chat Flow

The chat follows a deterministic finite-state machine:

```
[initial]
   │
   ├─► User selects/types product (e.g. Jeans)
   │     └─► Bot: "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)"
   │         State becomes: [waiting_for_budget]
   │
   ├─► User types unknown query
   │     └─► Bot: "Sorry, I did not understand your query!"
   │         State remains: [initial]
   │
[waiting_for_budget]
   │
   ├─► User enters matching budget (e.g. "500 - 1000")
   │     └─► Bot Message 1: "Here are your product suggestions:-"
   │     └─► Bot Message 2: "Wrogn, Link: https://www.wrogn.in" (with product image)
   │         State becomes: [recommendation_completed]
   │
   └─► User enters invalid/unmatched budget
         └─► Bot: "Sorry, I did not understand your query!"
```

---

## 5. Critical Debugging Case Study: The "Zeroes Bug"

### The Issue
In the user's initial render testing, a standalone `0` appeared below every AI message:
```
Product Recommendation AI
Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)
0
```

### Root Cause
In JavaScript and React JSX conditional rendering:
```jsx
// Problematic code:
{(showRatingBar || (message.rating && message.rating > 0)) && isBot && (
  <div className="message-rating-box">...</div>
)}
```
When `message.rating` was initialized to `0`:
1. `(message.rating && message.rating > 0)` evaluated `0 && ...`, returning `0`.
2. `showRatingBar` was `false`, so `false || 0` returned `0`.
3. `0 && isBot` returned `0`.
4. In JSX, falsy values like `false`, `null`, `undefined` render nothing, but numbers like `0` are rendered as text: `0`!

### The Solution
Replaced numeric condition with explicit boolean evaluation:
```jsx
{isBot && (showRatingBar || (message.rating && message.rating > 0)) ? (
  <div className="message-rating-box">...</div>
) : null}
```
This guarantees that when the rating is not yet set, `null` is returned and zero is never printed to the DOM.

---

## 6. How to Run & Test Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```
4. **Run Cypress Tests**:
   Ready to receive and execute Cypress integration tests against `http://localhost:5173/`.
