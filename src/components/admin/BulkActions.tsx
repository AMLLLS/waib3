"use client";

import { motion } from 'framer-motion';
import { 
  RiDeleteBinLine, RiCheckboxCircleLine,
  RiDraftLine
} from 'react-icons/ri';

interface BulkActionsProps {
  selectedCount: number;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}

export default function BulkActions({
  selectedCount,
  onPublish,
  onUnpublish,
  onDelete,
}: BulkActionsProps) {
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCount} formations ?`)) {
      onDelete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark/50 backdrop-blur rounded-xl p-4 border border-white/5"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-400">
          {selectedCount} formation{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onPublish}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <RiCheckboxCircleLine className="w-5 h-5" />
            <span>Publier</span>
          </button>
          
          <button
            onClick={onUnpublish}
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors"
          >
            <RiDraftLine className="w-5 h-5" />
            <span>Dépublier</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <RiDeleteBinLine className="w-5 h-5" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 