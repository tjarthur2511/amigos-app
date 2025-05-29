# Backend Notification Logic Outline

This document outlines the conceptual backend logic for triggering notifications within the Amigos Hangouts application.

## General Principles

*   **Delivery:** Notifications will be stored in a `notifications` subcollection for each user (e.g., `/users/{userId}/notifications`).
*   **Real-time:** The frontend will listen to this subcollection for real-time updates.
*   **Read Status:** Each notification document will have a `read: false` field, updated to `true` when the user views it.
*   **Timestamp:** Each notification will have a `createdAt: serverTimestamp()` field.
*   **Targeting:** Notifications are targeted to specific user UIDs.
*   **User Preferences:** The generation of a notification should ideally check the recipient's notification preferences before creating the notification document. (This part is handled by Task 2).

## Notification Triggers and Content

Here are key events that should trigger notifications:

---

### 1. Social Interactions

**a. New Comment on User's Own Post**
    *   **Event Trigger:** A new document is created in the `comments` collection where the `postId` links to a post owned by `targetUserId`.
    *   **Recipient (`targetUserId`):** The user who owns the post.
    *   **Notification Content:**
        *   `message`: `"{commenterDisplayName}" commented on your post: "{commentExcerpt}"`
        *   `type`: `new_comment_on_post`
        *   `link`: `/post/{postId}` (or `/posts/{postId}`)
        *   `actorId`: UID of the user who made the comment.

**b. New Reply to User's Own Comment**
    *   **Event Trigger:** A new document is created in the `comments` collection with a `parentId` field pointing to a comment owned by `targetUserId`.
    *   **Recipient (`targetUserId`):** The user who owns the parent comment.
    *   **Notification Content:**
        *   `message`: `"{replierDisplayName}" replied to your comment: "{replyExcerpt}"`
        *   `type`: `new_reply_to_comment`
        *   `link`: `/post/{postId}#comment-{commentId}` (link to the specific comment thread)
        *   `actorId`: UID of the user who made the reply.

**c. Reaction to User's Post**
    *   **Event Trigger:** A user adds a reaction to a post owned by `targetUserId`. (Logic within post update function).
    *   **Recipient (`targetUserId`):** The user who owns the post. (Avoid notifying if the reactor is the post owner).
    *   **Notification Content:**
        *   `message`: `"{reactorDisplayName}" reacted {reactionEmoji} to your post.`
        *   `type`: `reaction_on_post`
        *   `link`: `/post/{postId}`
        *   `actorId`: UID of the user who reacted.

**d. Reaction to User's Comment**
    *   **Event Trigger:** A user adds a reaction to a comment owned by `targetUserId`. (Logic within comment update function).
    *   **Recipient (`targetUserId`):** The user who owns the comment. (Avoid notifying if the reactor is the comment owner).
    *   **Notification Content:**
        *   `message`: `"{reactorDisplayName}" reacted {reactionEmoji} to your comment.`
        *   `type`: `reaction_on_comment`
        *   `link`: `/post/{postId}#comment-{commentId}`
        *   `actorId`: UID of the user who reacted.

---

### 2. Grupo Activity

**a. New Post in a Joined Grupo**
    *   **Event Trigger:** A new post is created with a `grupoId` that `targetUserId` is a member of.
    *   **Recipients (`targetUserId`):** All members of the Grupo where the post was made (excluding the post author). Iterate through `grupoDoc.data().members`.
    *   **Notification Content:**
        *   `message`: `"{posterDisplayName}" posted in "{grupoName}": "{postExcerpt}"`
        *   `type`: `new_post_in_grupo`
        *   `link`: `/post/{postId}` (or `/grupos/{grupoId}/post/{postId}`)
        *   `actorId`: UID of the user who made the post.
        *   `contextId`: `grupoId`

**b. (Future) Mention in a Grupo Post/Comment**
    *   **Event Trigger:** A user is mentioned (`@{displayName}`) in a post or comment within a Grupo.
    *   **Recipient (`targetUserId`):** The user who was mentioned.
    *   **Notification Content:**
        *   `message`: `"{mentionerDisplayName}" mentioned you in a post/comment in "{grupoName}"."`
        *   `type`: `mention_in_grupo`
        *   `link`: `/post/{postId}#comment-{commentId}` (if applicable)
        *   `actorId`: UID of the user who made the mention.
        *   `contextId`: `grupoId`

---

### 3. Amigo Connections

**a. New Amigo Request Received**
    *   **Event Trigger:** User A sends an Amigo request to User B. This might involve creating a document in an `amigoRequests` collection or updating User B's document.
    *   **Recipient (`targetUserId`):** User B (the one receiving the request).
    *   **Notification Content:**
        *   `message`: `"{requesterDisplayName}" sent you an Amigo request.`
        *   `type`: `amigo_request_received`
        *   `link`: `/profile/{requesterId}` or `/amigos/requests`
        *   `actorId`: UID of User A (the requester).

**b. Amigo Request Accepted**
    *   **Event Trigger:** User B accepts User A's Amigo request.
    *   **Recipient (`targetUserId`):** User A (the one who initially sent the request).
    *   **Notification Content:**
        *   `message`: `"{accepterDisplayName}" accepted your Amigo request.`
        *   `type`: `amigo_request_accepted`
        *   `link`: `/profile/{accepterId}`
        *   `actorId`: UID of User B (the accepter).

---

### 4. Events (Future - if event functionality is mature)

**a. Event Reminder**
    *   **Event Trigger:** Scheduled task (e.g., daily) checks for upcoming events a user has RSVP'd "Going" or "Interested" to.
    *   **Recipient (`targetUserId`):** User who RSVP'd.
    *   **Notification Content:**
        *   `message`: `Reminder: "{eventName}" is starting soon (e.g., tomorrow / in 1 hour).`
        *   `type`: `event_reminder`
        *   `link`: `/events/{eventId}`
        *   `contextId`: `eventId`

**b. Event Update/Cancellation**
    *   **Event Trigger:** An event a user has RSVP'd to is significantly updated (time, location) or cancelled.
    *   **Recipient (`targetUserId`):** All users who RSVP'd to the event.
    *   **Notification Content:**
        *   `message`: `The event "{eventName}" has been updated/cancelled. Check details.`
        *   `type`: `event_update` or `event_cancelled`
        *   `link`: `/events/{eventId}`
        *   `contextId`: `eventId`

---

### Helper Data for Notifications:

To generate user-friendly messages, Cloud Functions would need to fetch:
*   `displayName` (and potentially `profilePictureUrl`) of the `actorId`.
*   Title/excerpt of the post/comment.
*   Name of the Grupo.

This outline provides a basis for implementing Cloud Functions or other backend mechanisms to generate notifications.
