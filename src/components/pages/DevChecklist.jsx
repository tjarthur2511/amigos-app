// src/pages/DevChecklist.jsx
import React, { useState } from 'react';

const initialChecklist = [
  {
    id: 'profile-page',
    label: 'ProfilePage.jsx — UI Reviewed',
    status: false,
    path: 'src/components/pages/ProfilePage/ProfilePage.jsx'
  },
  {
    id: 'profile-questions',
    label: 'ProfileQuestionsCenter.jsx — Firestore Hooked',
    status: true,
    path: 'src/components/pages/ProfilePage/ProfileQuestionsCenter.jsx'
  },
  {
    id: 'notifications-bell',
    label: 'NotificationsBell.jsx — Quiz Notification Ready',
    status: true,
    path: 'src/components/common/NotificationsBell.jsx'
  },
  {
    id: 'notifications-modal',
    label: 'NotificationsModal.jsx — General Quiz Link Handled',
    status: true,
    path: 'src/components/common/NotificationsModal.jsx'
  }
];

const DevChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);

  const toggleStatus = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-[Comfortaa]">
      <h1 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">
        🔧 Amigos Dev Checklist
      </h1>

      <ul className="space-y-4">
        {checklist.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-white border border-[#ffe5e5] shadow p-4 rounded-xl"
          >
            <div>
              <input
                type="checkbox"
                checked={item.status}
                onChange={() => toggleStatus(item.id)}
                className="mr-3 scale-125 accent-[#FF6B6B]"
              />
              <span className={item.status ? 'line-through text-gray-500' : ''}>
                {item.label}
              </span>
            </div>
            <a
              href={`vscode://file/${item.path}`}
              className="text-sm text-[#FF6B6B] hover:underline"
            >
              ↗ Open File
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevChecklist;
