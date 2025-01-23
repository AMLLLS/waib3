"use client";

import { motion } from 'framer-motion';
import { 
  RiEditLine, RiDeleteBinLine, RiFileCopyLine,
  RiEyeLine, RiCheckboxCircleLine, RiDraftLine
} from 'react-icons/ri';
import { IFormation } from '@/models/Formation';

interface FormationListProps {
  formations: Array<IFormation>;
  selectedFormations: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function FormationList({
  formations,
  selectedFormations,
  onSelectionChange,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  onEdit,
}: FormationListProps) {
  const handleToggleSelection = (id: string) => {
    onSelectionChange(
      selectedFormations.includes(id)
        ? selectedFormations.filter(fId => fId !== id)
        : [...selectedFormations, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      onDelete(id);
    }
  };

  if (formations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucune formation trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {formations.map((formation) => (
        <motion.div
          key={formation._id?.toString()}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-dark/50 backdrop-blur rounded-xl p-4 border border-white/5"
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={selectedFormations.includes(formation._id?.toString() || '')}
              onChange={() => handleToggleSelection(formation._id?.toString() || '')}
              className="mt-1.5"
            />
            
            <div className="flex-grow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{formation.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{formation.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {formation.status === 'published' ? (
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-lg text-sm">
                      Publié
                    </span>
                  ) : (
                    <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-lg text-sm">
                      Brouillon
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                <span>{formation.modules?.length || 0} modules</span>
                <span>•</span>
                <span>{formation.resources?.length || 0} ressources</span>
                <span>•</span>
                <span>Niveau : {formation.level}</span>
                <span>•</span>
                <span>Durée : {formation.duration || 'Non définie'}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {formation.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-dark/50 px-2 py-1 rounded-lg text-sm text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(formation._id?.toString() || '')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Modifier"
            >
              <RiEditLine className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => onDuplicate(formation._id?.toString() || '')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Dupliquer"
            >
              <RiFileCopyLine className="w-5 h-5" />
            </button>

            {formation.status === 'draft' ? (
              <button
                onClick={() => onPublish(formation._id?.toString() || '')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-500"
                title="Publier"
              >
                <RiCheckboxCircleLine className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onUnpublish(formation._id?.toString() || '')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-yellow-500"
                title="Dépublier"
              >
                <RiDraftLine className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => handleDelete(formation._id?.toString() || '')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-500"
              title="Supprimer"
            >
              <RiDeleteBinLine className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 