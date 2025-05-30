// src/components/common/FollowButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useNotification } from '../../context/NotificationContext.jsx';
import Spinner from './Spinner';

const FollowButton = ({ targetId, targetType, targetName = "item", onFollowStateChange }) => {
  // targetName is for notification messages e.g. "Successfully followed {targetName}"
  const { showNotification } = useNotification();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const currentUserId = auth.currentUser?.uid;

  // Check initial follow state
  useEffect(() => {
    if (!currentUserId || !targetId) {
      setInitialCheckDone(true);
      return;
    }
    setIsLoading(true);
    const checkStatus = async () => {
      let userFollowingRef;
      if (targetType === 'grupo') {
        userFollowingRef = doc(db, 'users', currentUserId, 'followingGrupos', targetId);
      } else if (targetType === 'user') {
        userFollowingRef = doc(db, 'users', currentUserId, 'followingUsers', targetId);
      } else {
        setInitialCheckDone(true);
        setIsLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(userFollowingRef);
        setIsFollowing(docSnap.exists());
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
        setInitialCheckDone(true);
      }
    };
    checkStatus();
  }, [currentUserId, targetId, targetType]);

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      showNotification("Please log in to follow.", "error");
      return;
    }
    if (!targetId || !targetType) {
      showNotification("Cannot follow this item.", "error");
      return;
    }
    if (targetType === 'user' && currentUserId === targetId) {
      showNotification("You cannot follow yourself.", "error"); // Prevent self-follow
      return;
    }

    setIsLoading(true);
    const batch = writeBatch(db);
    let userFollowingRef;
    let targetFollowerRef;
    let userFollowingData = {};
    let targetFollowerData = { userId: currentUserId, followedAt: new Date() }; // Common data for target's follower list

    if (targetType === 'grupo') {
      userFollowingRef = doc(db, 'users', currentUserId, 'followingGrupos', targetId);
      targetFollowerRef = doc(db, 'grupos', targetId, 'followers', currentUserId);
      userFollowingData = { grupoId: targetId, followedAt: new Date() };
    } else if (targetType === 'user') {
      userFollowingRef = doc(db, 'users', currentUserId, 'followingUsers', targetId);
      targetFollowerRef = doc(db, 'users', targetId, 'followers', currentUserId);
      userFollowingData = { userId: targetId, followedAt: new Date() };
    } else {
      showNotification("Invalid target type.", "error");
      setIsLoading(false);
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow action
        batch.delete(userFollowingRef);
        batch.delete(targetFollowerRef);
        await batch.commit();
        setIsFollowing(false);
        showNotification(`Successfully unfollowed ${targetName || targetType}.`, "success");
        if (onFollowStateChange) onFollowStateChange(false, -1);
      } else {
        // Follow action
        batch.set(userFollowingRef, userFollowingData);
        batch.set(targetFollowerRef, targetFollowerData);
        await batch.commit();
        setIsFollowing(true);
        showNotification(`Successfully followed ${targetName || targetType}!`, "success");
        if (onFollowStateChange) onFollowStateChange(true, 1);
      }
    } catch (error) {
      console.error(`Error updating ${targetType} follow status:`, error);
      showNotification(`Failed to update follow status for ${targetType}. Please try again.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialCheckDone) {
    // Show a placeholder or small spinner while checking initial status
    return (
      <button
        className="py-2 px-4 rounded-button font-comfortaa font-bold text-sm shadow-md bg-neutral-200 text-neutral-500 cursor-default"
        disabled
      >
        <Spinner size="sm" color="neutral" />
      </button>
    );
  }
  
  // Do not render the button if the target is the current user (for user following)
  // Or if targetId is missing
  if (!targetId || (targetType === 'user' && currentUserId === targetId)) {
    return null;
  }

  // Button classes (similar to PublicGrupoPage join/leave button for consistency)
  const baseButtonClasses = "py-2 px-4 rounded-button font-comfortaa font-bold text-sm shadow-md transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]";
  let buttonSpecificClasses = '';

  if (isFollowing) {
    buttonSpecificClasses = 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400 focus:ring-neutral-400';
  } else {
    buttonSpecificClasses = 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80 focus:ring-accent';
  }


  return (
    <button
      onClick={handleFollowToggle}
      className={`${baseButtonClasses} ${buttonSpecificClasses}`}
      disabled={isLoading || !currentUserId}
    >
      {isLoading ? (
        <Spinner size="sm" color={isFollowing ? "neutral" : "white"} />
      ) : isFollowing ? (
        'Following' // Could also show "Unfollow" on hover if desired with more state/logic
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;
