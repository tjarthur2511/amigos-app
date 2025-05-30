import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import NotificationsModal from "./NotificationsModal";

const NotificationsBell = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // ✅ Subscribe to live notifications
    const q = query(
      collection(db, "notifications"),
      where("targetUserId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(
        items.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );
    });

    const checkQuizQuestions = async () => {
      try {
        if (!currentUser?.uid) return;

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const data = userSnap.data();
        const { quizAnswers = {}, monthlyQuiz = {} } = data;
        const answeredCount =
          Object.keys(quizAnswers).length + Object.keys(monthlyQuiz).length;

        let totalQuestionCount = 0;

        try {
          const qSnap = await getDocs(collection(db, "questionSets"));
          qSnap.forEach((doc) => {
            const qs = doc.data().questions || [];
            totalQuestionCount += qs.length;
          });
        } catch (e) {
          console.warn("❗ questionSets permission denied or not accessible:", e.message);
          return;
        }

        if (answeredCount < totalQuestionCount) {
          const quizNotifId = `quiz-${currentUser.uid}`;
          const notifRef = doc(db, "notifications", quizNotifId);
          const notifSnap = await getDoc(notifRef);

          if (!notifSnap.exists()) {
            await setDoc(notifRef, {
              targetUserId: currentUser.uid,
              senderId: currentUser.uid,
              category: "general",
              type: "quiz",
              content: "You have unanswered profile questions waiting",
              seen: false,
              createdAt: serverTimestamp(),
            });
          }
        }
      } catch (error) {
        console.error("🔥 checkQuizQuestions failed:", error.message);
      }
    };

    checkQuizQuestions();

    return () => unsubscribe();
  }, [currentUser]);

  const handleClick = async () => {
    setShowModal(true);

    const unseen = notifications.filter((n) => !n.seen);
    for (const n of unseen) {
      const ref = doc(db, "notifications", n.id);
      await updateDoc(ref, { seen: true });
    }
  };

  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Tailwind classes for the bell button
  const bellBaseClasses = "fixed top-[15vh] sm:top-28 right-4 sm:right-8 p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none z-[1000]"; // Adjusted positioning slightly for responsiveness
  const bellColorClasses = "bg-coral text-white hover:bg-coral-dark active:bg-coral-dark/90 focus:ring-2 focus:ring-coral-dark focus:ring-offset-2";
  const pulseAnimationClass = unseenCount > 0 ? "animate-[pulse-a_1.75s_infinite]" : ""; // Using existing pulse-a from theme

  return (
    <>
      <button
        onClick={handleClick}
        className={`${bellBaseClasses} ${bellColorClasses} ${pulseAnimationClass}`}
        aria-label={`Notifications (${unseenCount} unseen)`}
      >
        <img
          src="/assets/amigosaonly.png" // Assuming this is the bell icon
          alt="Notifications"
          className="h-6 w-6 block filter drop-shadow-[0_0_1px_rgba(255,255,255,0.7)]" // Standardized size and shadow
        />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {showModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default NotificationsBell;
