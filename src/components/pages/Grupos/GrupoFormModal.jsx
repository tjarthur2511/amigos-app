// src/components/pages/Grupos/GrupoFormModal.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNotification } from '../../../context/NotificationContext.jsx';
import Spinner from '../../common/Spinner';
import { XMarkIcon } from '@heroicons/react/24/solid';

const GrupoFormModal = ({ isOpen, onClose, grupoToEdit }) => {
  const { showNotification } = useNotification();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (grupoToEdit) {
      setName(grupoToEdit.name || '');
      setDescription(grupoToEdit.description || '');
    } else {
      // Reset for create mode
      setName('');
      setDescription('');
    }
    setError(''); // Clear error when modal opens or grupoToEdit changes
  }, [isOpen, grupoToEdit]);

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
    if (!validateForm()) return;
    if (!currentUserId) {
      showNotification("You must be logged in to perform this action.", "error");
      return;
    }

    setIsSaving(true);
    const grupoData = {
      name: name.trim(),
      description: description.trim(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (grupoToEdit) {
        // Update existing grupo
        const grupoRef = doc(db, 'grupos', grupoToEdit.id);
        await updateDoc(grupoRef, grupoData);
        showNotification('Grupo updated successfully!', 'success');
      } else {
        // Create new grupo
        grupoData.createdAt = serverTimestamp();
        grupoData.createdBy = currentUserId;
        grupoData.members = [currentUserId]; // Creator is the first member
        // grupoData.isPublic = true; // Assuming public by default
        // grupoData.tags = []; // Optional: initialize tags
        await addDoc(collection(db, 'grupos'), grupoData);
        showNotification('Grupo created successfully!', 'success');
      }
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Error saving grupo:", err);
      showNotification(`Failed to save grupo: ${err.message}`, 'error');
      setError(`Failed to save grupo: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputBaseClasses = "p-2.5 border border-neutral-300 rounded-input font-comfortaa text-base w-full box-border focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent disabled:bg-neutral-100";
  const buttonBaseClasses = "py-2.5 px-6 rounded-button font-comfortaa font-bold text-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]";


  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center font-comfortaa p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-xl relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-neutral-500 hover:text-coral focus:outline-none focus:ring-2 focus:ring-coral rounded-md p-1 transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <h2 className="text-2xl font-bold text-center text-coral mb-6">
          {grupoToEdit ? 'Edit Grupo' : 'Create New Grupo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="grupoName" className="block text-sm font-medium text-neutral-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="grupoName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputBaseClasses}
              placeholder="Your awesome group's name"
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
              className={`${inputBaseClasses} min-h-[100px]`}
              placeholder="Tell everyone what your group is about..."
              rows="4"
              disabled={isSaving}
            />
            <p className="text-xs text-neutral-500 mt-1 text-right">{description.length}/500</p>
          </div>
          
          {error && (
            <p className="text-sm text-feedback-error bg-feedback-error-bg p-3 rounded-md">{error}</p>
          )}

          <div className="flex items-center justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`${buttonBaseClasses} bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-400`}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonBaseClasses} bg-coral text-white hover:bg-coral-dark focus:ring-coral-dark`}
              disabled={isSaving}
            >
              {isSaving ? <Spinner size="sm" color="white" /> : (grupoToEdit ? 'Save Changes' : 'Create Grupo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrupoFormModal;