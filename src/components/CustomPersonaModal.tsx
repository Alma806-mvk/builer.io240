import React, { useState } from "react";
import { AiPersonaDefinition } from "../../types";
import { useSubscription } from "../context/SubscriptionContext";

interface CustomPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: AiPersonaDefinition) => void;
  existingPersona?: AiPersonaDefinition | null;
  userPlan?: "free" | "pro" | "enterprise";
}

const CustomPersonaModal: React.FC<CustomPersonaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingPersona,
  userPlan,
}) => {
  const { billingInfo } = useSubscription();
  const [formData, setFormData] = useState({
    name: existingPersona?.name || "",
    description: existingPersona?.description || "",
    systemInstruction: existingPersona?.systemInstruction || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isProOrHigher =
    billingInfo?.subscription?.planId === "pro" ||
    billingInfo?.subscription?.planId === "enterprise" ||
    userPlan === "pro" ||
    userPlan === "enterprise";

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    if (!formData.systemInstruction.trim()) {
      newErrors.systemInstruction = "System instruction is required";
    } else if (formData.systemInstruction.length < 20) {
      newErrors.systemInstruction =
        "System instruction must be at least 20 characters";
    } else if (formData.systemInstruction.length > 1000) {
      newErrors.systemInstruction =
        "System instruction must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const personaData: AiPersonaDefinition = {
      id:
        existingPersona?.id ||
        `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      systemInstruction: formData.systemInstruction.trim(),
      isCustom: true,
    };

    onSave(personaData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      systemInstruction: "",
    });
    setErrors({});
    onClose();
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #475569",
    borderRadius: "0.5rem",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    fontSize: "0.875rem",
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  };

  if (!isProOrHigher) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-slate-800/95 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-4">
              Pro Feature Required
            </h3>
            <p className="text-slate-300 mb-6">
              Custom AI Personas are available for Pro and Enterprise users.
              Create unlimited custom personas that match your brand voice
              perfectly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800/95 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🎭 {existingPersona ? "Edit" : "Create"} Custom AI Persona
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Design an AI personality that matches your unique voice and
                style
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors p-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Persona Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Persona Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Brand Expert, Creative Writer, Technical Guru"
              style={inputStyle}
              className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {errors.name && <div style={errorStyle}>{errors.name}</div>}
            <div className="text-xs text-slate-500 mt-1">
              {formData.name.length}/50 characters
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of this persona's style and purpose"
              style={inputStyle}
              className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {errors.description && (
              <div style={errorStyle}>{errors.description}</div>
            )}
            <div className="text-xs text-slate-500 mt-1">
              {formData.description.length}/200 characters
            </div>
          </div>

          {/* System Instruction */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              System Instruction *
            </label>
            <textarea
              value={formData.systemInstruction}
              onChange={(e) =>
                setFormData({ ...formData, systemInstruction: e.target.value })
              }
              placeholder="You are a [role/expertise]. Your tone is [tone/style]. You should [specific behaviors/guidelines]..."
              rows={6}
              style={inputStyle}
              className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
            />
            {errors.systemInstruction && (
              <div style={errorStyle}>{errors.systemInstruction}</div>
            )}
            <div className="text-xs text-slate-500 mt-1">
              {formData.systemInstruction.length}/1000 characters
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
              💡 Tips for Great Personas
            </h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>
                • Be specific about tone (formal, casual, friendly, expert,
                etc.)
              </li>
              <li>• Define the persona's expertise or role</li>
              <li>
                • Include style preferences (concise, detailed, creative, etc.)
              </li>
              <li>• Mention any specific behaviors or approaches</li>
            </ul>
          </div>

          {/* Example */}
          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
            <h4 className="font-semibold text-slate-300 mb-2">
              Example System Instruction:
            </h4>
            <p className="text-sm text-slate-400 italic">
              "You are a knowledgeable marketing expert with 10+ years of
              experience in social media strategy. Your tone is professional yet
              approachable, and you always provide actionable, data-driven
              advice. You focus on ROI and practical implementation while
              keeping explanations clear and concise."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !formData.name.trim() ||
              !formData.description.trim() ||
              !formData.systemInstruction.trim()
            }
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
          >
            {existingPersona ? "Update Persona" : "Create Persona"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPersonaModal;
