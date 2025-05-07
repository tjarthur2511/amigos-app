// src/components/common/PostWithModal.jsx
import React, { useState } from "react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";

const PostWithModal = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PostCard post={post} onViewAll={() => setIsOpen(true)} />
      {isOpen && (
        <PostDetailModal post={post} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default PostWithModal;
