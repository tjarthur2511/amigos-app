// src/components/common/PostCard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import PostDetailModal from "./PostDetailModal";

const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "1.5rem",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      {/* 🧑 Author */}
      <div style={{
        marginBottom: "0.5rem",
        fontWeight: "bold",
        color: "var(--theme-color)"
      }}>
        @{author?.displayName || "anon"}
      </div>

      {/* 📝 Content */}
      {post.content && (
        <p style={{
          fontSize: "1rem",
          color: "var(--theme-color)",
          marginBottom: "1rem",
          wordWrap: "break-word",
          whiteSpace: "pre-line",
        }}>
          {post.content}
        </p>
      )}

      {/* 🖼️ Media */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post media"
          style={{
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem",
            objectFit: "cover",
          }}
        />
      )}
      {post.videoUrl && (
        <video
          src={post.videoUrl}
          controls
          style={{
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem",
          }}
        />
      )}

      {/* 🔖 Hashtags */}
      <div style={{ fontSize: "0.9rem", color: "var(--theme-color)", marginBottom: "0.5rem" }}>
        {post.hashtags?.map((tag) => (
          <span key={tag} style={{ marginRight: "0.5rem" }}>{tag}</span>
        ))}
      </div>

      {/* 👤 Tag info */}
      <div style={{ fontSize: "0.9rem", color: "#999", marginBottom: "1rem" }}>
        Tagged:
        {(post.taggedAmigos || []).map(uid => (
          <span key={uid} style={{ marginLeft: "0.3rem" }}>👤</span>
        ))}
        {(post.taggedGrupos || []).map(gid => (
          <span key={gid} style={{ marginLeft: "0.3rem" }}>👥</span>
        ))}
      </div>

      {/* 💬 Top 3 Comments */}
      <div style={{ marginTop: "1rem" }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              backgroundColor: "#FFF0F0",
              padding: "0.5rem",
              borderRadius: "0.75rem",
              marginBottom: "0.5rem",
              fontSize: "0.95rem",
              color: "var(--theme-color)",
              fontWeight: "500",
            }}
          >
            <strong>{comment.userId}</strong>: {comment.content}
          </div>
        ))}
      </div>

      {/* 🔎 View All Comments */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "var(--theme-color)",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "1rem",
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          View All Comments
        </button>
      </div>

      {showModal && <PostDetailModal post={post} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PostCard;
