# Recent Activity Display - Conceptual Outline

This document outlines a conceptual plan for displaying recent user activity on their profile page (`ProfilePage.jsx` for own activity, `PublicProfilePage.jsx` for others').

## 1. Types of Relevant Activity

The following activities could be displayed:

*   **Post Creation:** "User created a new post: '{postExcerpt}'"
    *   Links to the post.
*   **Comment Creation:** "User commented on {targetUser/targetPostTitle}'s post: '{commentExcerpt}'"
    *   Links to the post/comment.
*   **Grupo Interactions:**
    *   "User joined Grupo: '{grupoName}'"
        *   Links to the Grupo page.
    *   "User created Grupo: '{grupoName}'" (If applicable and creator is stored)
        *   Links to the Grupo page.
*   **(Future) Event RSVP:** "User RSVP'd {status} to Event: '{eventName}'"
    *   Links to the Event page.
*   **(Future) Amigo Connection:** "User became Amigos with {otherUserName}"
    *   Links to the other user's profile.

## 2. Data Fetching Considerations

Fetching and aggregating diverse activity types can be complex.

*   **Option A: Querying Individual Collections (Simpler for limited types):**
    *   Fetch user's recent posts (from `posts` collection, `where('userId', '==', profileUserId)`).
    *   Fetch user's recent comments (from `comments` collection, `where('userId', '==', profileUserId)`).
    *   Fetch user's joined Grupos (from `users` doc, then potentially query `grupos` for names, or from `grupos` collection `where('members', 'array-contains', profileUserId)`).
    *   **Challenge:** Combining and sorting these different activity types by date would require client-side logic or multiple queries and then merging. Timestamps across different activities would need to be consistent.

*   **Option B: Dedicated "Activity" Collection (More Scalable & Robust):**
    *   **Structure:** Create a top-level `activity` collection or a subcollection under each user (e.g., `/users/{userId}/activityFeed`).
    *   **Trigger:** When a relevant action occurs (e.g., new post, new comment, join group), a Cloud Function (or backend logic) creates a new document in this `activity` collection.
    *   **Activity Document Fields:**
        *   `userId`: UID of the user who performed the activity.
        *   `type`: Enum (e.g., `created_post`, `commented_on_post`, `joined_grupo`).
        *   `timestamp`: `serverTimestamp()`.
        *   `targetId`: ID of the related entity (e.g., postId, commentId, grupoId).
        *   `targetType`: (e.g., `post`, `comment`, `grupo`).
        *   `targetOwnerId`: (Optional, e.g., UID of the post owner if it was a comment).
        *   `snippet`: (Optional, e.g., excerpt of post/comment).
        *   `relatedContextName`: (Optional, e.g., Grupo name, Post title).
    *   **Fetching:** The profile page would query this `activity` collection for the specific `userId`, ordered by `timestamp`.
    *   **Benefits:** Centralized, easier to query for a unified feed, can be pre-formatted for display. Can easily implement "activity of my Amigos".
    *   **Considerations:** Requires backend logic (Cloud Functions) to populate.

## 3. UI Mockup/Description

*   **Location on Profile:**
    *   A new tab/card on `ProfilePage.jsx` (and `PublicProfilePage.jsx`) titled "Recent Activity".
    *   Alternatively, a section below the main profile information block.
*   **Appearance:**
    *   A chronological list of activity items.
    *   Each item could display:
        *   An icon representing the activity type (e.g., new post icon, comment icon).
        *   A concise text description (e.g., "You created a post: 'My Trip to the Beach'").
        *   A relative timestamp (e.g., "2 hours ago", "Yesterday").
        *   A link to the relevant content (post, group, etc.).
    *   Example item:
        ```
        [Icon] John Doe created a post: "Enjoying the sunny weather! ☀️" - 3h ago [View Post]
        [Icon] John Doe joined the Grupo: "Hiking Enthusiasts" - 1d ago [View Grupo]
        ```
*   **Privacy:** For `PublicProfilePage.jsx`, displayed activity should respect privacy settings (e.g., only show public posts, public group joins). This would require privacy flags on the activity documents or the source documents.

This conceptual outline provides a starting point for designing and implementing a recent activity feed. The dedicated "Activity" collection approach (Option B) is generally more robust for a growing set of activity types.
