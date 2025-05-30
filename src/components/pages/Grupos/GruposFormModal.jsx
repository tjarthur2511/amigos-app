// src/components/pages/Grupos/GrupoFormModal.jsx
import React, { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebase';
import { useNotification } from '../../../context/NotificationContext';
import Spinner from '../../common/Spinner';
import { XMarkIcon } from '@heroicons/react/24/solid';

const GrupoFormModal = ({ isOpen, onClose, grupoToEdit, onGroupSaved }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  const mode = grupoToEdit ? 'edit' : 'create';

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && grupoToEdit) {
        setName(grupoToEdit.name || '');
        setDescription(grupoToEdit.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setError(''); // Clear errors when modal opens
    } else {
      // Clear form when modal is not open (e.g. on close animation end)
      setName('');
      setDescription('');
      setError('');
    }
  }, [isOpen, mode, grupoToEdit]);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Group name is required.');
      return false;
    }
    if (name.trim().length < 3) {
      setError('Group name must be at least 3 characters long.');
      return false;
    }
    if (description.trim().length > 500) {
      setError('Description cannot exceed 500 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      setError('You must be logged in to perform this action.');
      return;
    }
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      if (mode === 'edit' && grupoToEdit?.id) {
        const grupoRef = doc(db, 'grupos', grupoToEdit.id);
        await updateDoc(grupoRef, {
          name: name.trim(),
          description: description.trim(),
          updatedAt: serverTimestamp(),
        });
        showNotification('Group updated successfully!', 'success');
      } else {
        const newGrupoData = {
          name: name.trim(),
          description: description.trim(),
          createdAt: serverTimestamp(),
          createdBy: currentUserId,
          members: [currentUserId], // Creator is the first member
          // Add other default fields if necessary, e.g., isPublic: true
        };
        const docRef = await addDoc(collection(db, 'grupos'), newGrupoData);
        showNotification('Group created successfully!', 'success');
      }
      if (onGroupSaved) {
        onGroupSaved(); // Callback to refresh parent component or list
      }
      onClose(); // Close modal on success
    } catch (err) {
      console.error('Error saving group:', err);
      setError('Failed to save group. Please try again.');
      showNotification('Failed to save group. Please try again.', 'error');
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9000] font-comfortaa p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-neutral-50 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-coral mb-6 text-center">
          {mode === 'edit' ? 'Edit Group' : 'Create New Group'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="grupoName" className="block text-sm font-medium text-neutral-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              id="grupoName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-neutral-300 rounded-input shadow-sm focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition-shadow"
              placeholder="Enter group name (e.g., Local Hikers)"
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="grupoDescription" className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              id="grupoDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2.5 border border-neutral-300 rounded-input shadow-sm focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition-shadow"
              placeholder="What is this group about? (Optional, max 500 characters)"
              disabled={isSaving}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>
          )}

          <div className="flex justify-end items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-button text-sm font-semibold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-button text-sm font-semibold text-white bg-coral hover:bg-coral-dark transition-colors focus:outline-none focus:ring-2 focus:ring-coral-dark focus:ring-offset-1 disabled:opacity-60 flex items-center justify-center min-w-[100px]"
            >
              {isSaving ? <Spinner size="sm" color="white" /> : (mode === 'edit' ? 'Save Changes' : 'Create Group')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrupoFormModal;