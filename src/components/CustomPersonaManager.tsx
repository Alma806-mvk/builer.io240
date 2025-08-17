import React, { useState } from "react";
import { AiPersonaDefinition } from "../../types";
import { useSubscription } from "../context/SubscriptionContext";
import CustomPersonaModal from "./CustomPersonaModal";

interface CustomPersonaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  customPersonas: AiPersonaDefinition[];
  onSavePersona: (persona: AiPersonaDefinition) => void;
  onDeletePersona: (personaId: string) => void;
  onSelectPersona: (persona: AiPersonaDefinition) => void;
  selectedPersonaId?: string;
  userPlan?: "free" | "pro" | "enterprise";
}

const CustomPersonaManager: React.FC<CustomPersonaManagerProps> = ({
  isOpen,
  onClose,
  customPersonas,
  onSavePersona,
  onDeletePersona,
  onSelectPersona,
  selectedPersonaId,
  userPlan,
}) => {
  const { billingInfo } = useSubscription();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPersona, setEditingPersona] =
    useState<AiPersonaDefinition | null>(null);
  const [deletingPersonaId, setDeletingPersonaId] = useState<string | null>(
    null,
  );

  const isProOrHigher =
    billingInfo?.subscription?.planId === "pro" ||
    billingInfo?.subscription?.planId === "enterprise" ||
    userPlan === "pro" ||
    userPlan === "enterprise";

  if (!isOpen) return null;

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  const handleEdit = (persona: AiPersonaDefinition) => {
    setEditingPersona(persona);
  };

  const handleSave = (persona: AiPersonaDefinition) => {
    onSavePersona(persona);
    setIsCreating(false);
    setEditingPersona(null);
  };

  const handleDelete = (personaId: string) => {
    setDeletingPersonaId(personaId);
  };

  const confirmDelete = () => {
    if (deletingPersonaId) {
      onDeletePersona(deletingPersonaId);
      setDeletingPersonaId(null);
    }
  };

  const maxPersonas = isProOrHigher ? 10 : 0;
  const canCreateMore = customPersonas.length < maxPersonas;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-slate-800/95 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  🎭 My Custom AI Personas
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your custom AI personalities ({customPersonas.length}/
                  {maxPersonas} personas)
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isProOrHigher ? (
              // Upgrade prompt for non-Pro users
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Pro Feature Required
                </h4>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Custom AI Personas are available for Pro and Enterprise users.
                  Create up to 10 custom personas that perfectly match your
                  brand voice and style.
                </p>
                <button
                  onClick={() => (window.location.href = "/pricing")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all"
                >
                  Upgrade to Pro
                </button>
              </div>
            ) : (
              <>
                {/* Create New Button */}
                <div className="mb-6">
                  <button
                    onClick={handleCreateNew}
                    disabled={!canCreateMore}
                    className="w-full p-4 border-2 border-dashed border-indigo-400/30 hover:border-indigo-400/50 disabled:border-slate-600 disabled:cursor-not-allowed rounded-xl transition-all flex items-center justify-center gap-3 text-indigo-400 hover:text-indigo-300 disabled:text-slate-500"
                  >
                    <span className="text-2xl">+</span>
                    <div>
                      <div className="font-semibold">
                        {canCreateMore
                          ? "Create New Persona"
                          : "Maximum Personas Reached"}
                      </div>
                      <div className="text-sm opacity-80">
                        {canCreateMore
                          ? "Design a custom AI personality"
                          : `You've reached the limit of ${maxPersonas} personas`}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Personas Grid */}
                {customPersonas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎭</div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      No Custom Personas Yet
                    </h4>
                    <p className="text-slate-400 mb-6">
                      Create your first custom AI persona to get started
                    </p>
                    <button
                      onClick={handleCreateNew}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all"
                    >
                      Create Your First Persona
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {customPersonas.map((persona) => (
                      <div
                        key={persona.id}
                        className={`group p-5 border rounded-xl transition-all cursor-pointer ${
                          selectedPersonaId === persona.id
                            ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                            : "border-slate-600 hover:border-slate-500 bg-slate-700/30"
                        }`}
                        onClick={() => onSelectPersona(persona)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">
                                {persona.name}
                              </h5>
                              {selectedPersonaId === persona.id && (
                                <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              {persona.description}
                            </p>
                            <div className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg">
                              <div className="font-medium text-slate-400 mb-1">
                                System Instruction:
                              </div>
                              {persona.systemInstruction.length > 150
                                ? `${persona.systemInstruction.substring(0, 150)}...`
                                : persona.systemInstruction}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(persona);
                              }}
                              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                              title="Edit persona"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(persona.id);
                              }}
                              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                              title="Delete persona"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CustomPersonaModal
        isOpen={isCreating || editingPersona !== null}
        onClose={() => {
          setIsCreating(false);
          setEditingPersona(null);
        }}
        onSave={handleSave}
        existingPersona={editingPersona}
        userPlan={userPlan}
      />

      {/* Delete Confirmation */}
      {deletingPersonaId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeletingPersonaId(null)}
        >
          <div
            className="bg-slate-800/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-white mb-4">
                Delete Persona
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this custom persona? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingPersonaId(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomPersonaManager;
