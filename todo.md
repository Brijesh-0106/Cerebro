# Second Brain - Remaining Features Todo List

Based on a full analysis of the current frontend and backend codebase, here is a list of features that are currently missing or incomplete. 

## 🔴 High Priority (Core Features)

- [ ] **Delete Content Functionality**
  - **Backend:** Create a `DELETE /v0/api/content/:id` route to remove content from MongoDB (and ideally remove its vector from Pinecone).
  - **Frontend:** Add a "Delete" (trash can) button on `Card.tsx` with a confirmation modal to delete the content.

- [ ] **Share Brain Feature**
  - **Backend:** Create endpoints to generate a unique share link and a public `GET /v0/api/brain/:shareLink` route to fetch a user's shared content.
  - **Frontend:** Add a "Share Brain" toggle in the `Leftbar` or `Topbar` that generates and copies a public link to the clipboard. Create a public view page.

- [ ] **Search / Filter Bar**
  - **Frontend:** Add a search input in the `Topbar` or above the `Cards` grid to filter displayed content by `title`, `description`, or `tags` in real-time.
  - **Frontend:** Make tags clickable so that clicking a tag (e.g., `#react`) filters the view to show only content with that tag.

## 🟡 Medium Priority (Enhancements)

- [ ] **Edit Content Functionality**
  - **Backend:** Create a `PUT/PATCH /v0/api/content/:id` route to update title, description, or tags.
  - **Frontend:** Add an "Edit" button on `Card.tsx` that opens a pre-filled modal allowing the user to update their saved items.

- [ ] **Clear AI Chat History**
  - **Backend:** Create a `DELETE /v0/api/chat` route to clear the user's conversation history.
  - **Frontend:** Add a "Clear Chat" or "New Chat" button in the `ChatWithAI` component to reset the conversation context.

## 🟢 Low Priority (Polish & Quality of Life)

- [ ] **User Profile / Settings Page**
  - **Frontend & Backend:** Create a dedicated settings page where users can update their display name, change their password, or delete their account.

- [ ] **Loading States & Feedback**
  - **Frontend:** Enhance loading states during Google Sign-in and standard Sign-up to prevent duplicate clicks (already partially implemented with `disableBtn`, but can use spinners).

- [ ] **Theme Toggle (Light/Dark Mode)**
  - **Frontend:** The app is currently hardcoded for Dark Mode. Refactoring Tailwind classes to support `dark:` variants and adding a theme toggle switch.

- [ ] **Pagination / Infinite Scroll**
  - **Backend & Frontend:** If the user adds hundreds of items, fetching them all at once will become slow. Implement pagination or infinite scrolling for the `/get-all-content` routes.
