// ✅ Clean Card-Only PostCard Component
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import PostDetailModal from "./PostDetailModal";
import PostModal from "./PostModal";
import ReactionPicker from "./ReactionPicker";

const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDoc(doc(db, "users", post.userId));
      if (userSnap.exists()) setAuthor(userSnap.data());

      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", post.id)
      );
      const commentDocs = await getDocs(commentsQuery);
      const sortedComments = commentDocs.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 3);
      setComments(sortedComments);
    };

    fetchData();
  }, [post]);

  const handleEmojiReact = async (commentId, emoji, currentMap = {}) => {
    const ref = doc(db, "comments", commentId);
    const userId = currentUser?.uid || "anon";
    const updated = {};

    Object.keys(currentMap).forEach((key) => {
      updated[key] = currentMap[key].filter((id) => id !== userId);
    });

    const alreadyReacted = (currentMap[emoji] || []).includes(userId);
    if (!alreadyReacted) {
      updated[emoji] = [...(updated[emoji] || []), userId];
    }

    await updateDoc(ref, { emojis: updated });
    setEmojiPickerVisible(null);
  };

  const viewAllCommentsButtonClasses = "bg-coral text-white py-2 px-4 rounded-full font-comfortaa font-bold text-sm mt-4 cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark";
  const editButtonClasses = "absolute top-4 right-4 bg-coral text-white p-2 rounded-full font-comfortaa font-bold text-xl cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark";

  return (
    <div className="bg-white rounded-[1.5rem] p-6 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-comfortaa relative z-0">
      {currentUser?.uid === post.userId && (
        <button
          onClick={() => setShowEditModal(true)}
          className={editButtonClasses}
        >
          ✏️
        </button>
      )}

      <div className="mb-2 font-bold text-coral">
        @{author?.displayName || "anon"}
      </div>

      {post.content && (
        <p className="text-base text-charcoal mb-4 break-words whitespace-pre-line"> {/* Changed text-coral to text-charcoal */}
          {post.content}
        </p>
      )}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post media"
          className="w-full rounded-xl mb-4 object-cover"
        />
      )}

      {post.videoUrl && (
        <video
          src={post.videoUrl}
          controls
          className="w-full rounded-xl mb-4"
        />
      )}

      <div className="text-sm text-coral mb-2">
        {post.hashtags?.map((tag) => (
          <span key={tag} className="mr-2">{tag}</span>
        ))}
      </div>

      <div className="text-sm text-gray-600 mb-4"> {/* Changed text-gray-500 to text-gray-600 for better contrast */}
        Tagged:
        {(post.taggedAmigos || []).map(uid => (
          <span key={uid} className="ml-1">👤</span>
        ))}
        {(post.taggedGrupos || []).map(gid => (
          <span key={gid} className="ml-1">👥</span>
        ))}
      </div>

      {/* Comments section: comments are already text-coral on white with coral border, which is fine. */}
      <div className="mt-4">
        {comments.map((comment) => {
          const reactions = comment.emojis || {};
          return (
            <div
              key={comment.id}
              className="bg-white py-2 px-4 rounded-lg mb-2 text-base text-coral font-medium relative border border-coral" 
            >
              <strong className="mr-1 text-charcoal">💬</strong> {/* Changed icon color for distinctness */}
              {comment.content} {/* Comment content remains text-coral */}
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Object.entries(reactions).map(([emoji, users]) => (
                  <span
                    key={emoji}
                    className="text-lg text-coral mr-2" 
                  >
                    {emoji} {users.length}
                  </span>
                ))}
                <button
                  onClick={() =>
                    setEmojiPickerVisible(emojiPickerVisible === comment.id ? null : comment.id)
                  }
                  className="bg-transparent border-none text-lg cursor-pointer text-coral hover:text-coral-dark"
                >
                  😀
                </button>
              </div>
              {emojiPickerVisible === comment.id && (
                <ReactionPicker onSelect={(emoji) => handleEmojiReact(comment.id, emoji, reactions)} />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-right">
        <button
          onClick={() => setShowModal(true)}
          className={viewAllCommentsButtonClasses} // This button is white with coral text, hover coral bg with white text - good contrast.
        >
          View All Comments
        </button>
      </div>

      {showModal && <PostDetailModal post={post} onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <PostModal post={post} isEdit={true} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default PostCard;