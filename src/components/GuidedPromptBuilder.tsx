import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wand2, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { guidedTemplates, type GuidedTemplate } from '../data/promptExamples';
import * as LucideIcons from 'lucide-react';

interface GuidedPromptBuilderProps {
  onGeneratePrompt: (prompt: string) => void;
  onBackToExamples: () => void;
  className?: string;
}

export const GuidedPromptBuilder: React.FC<GuidedPromptBuilderProps> = ({
  onGeneratePrompt,
  onBackToExamples,
  className = ''
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<GuidedTemplate>(guidedTemplates[0]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Initialize field values when template changes
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    selectedTemplate.fields.forEach(field => {
      initialValues[field.key] = '';
    });
    setFieldValues(initialValues);
    setCurrentStep(0);
    setGeneratedPrompt('');
  }, [selectedTemplate]);

  // Generate prompt whenever field values change
  useEffect(() => {
    let prompt = selectedTemplate.template;
    selectedTemplate.fields.forEach(field => {
      const value = fieldValues[field.key] || `{${field.key}}`;
      prompt = prompt.replace(`{${field.key}}`, value);
    });
    setGeneratedPrompt(prompt);
  }, [fieldValues, selectedTemplate]);

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < selectedTemplate.fields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUsePrompt = () => {
    onGeneratePrompt(generatedPrompt);
  };

  const handleReset = () => {
    setFieldValues({});
    setCurrentStep(0);
  };

  const isPromptComplete = selectedTemplate.fields.every(field => fieldValues[field.key]);
  const currentField = selectedTemplate.fields[currentStep];
  
  // Helper function to get Lucide icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToExamples}
            className="flex items-center justify-center w-10 h-10 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] rounded-xl transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-purple-500/30 rounded-xl">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              Guided Prompt Builder
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Fill in the blanks to create your perfect prompt
            </p>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Template Selection */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-4">Choose Template</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guidedTemplates.map((template) => {
            const IconComponent = getIconComponent(template.icon);
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 border border-[var(--border-primary)] rounded-xl text-left transition-all duration-200 ${
                  selectedTemplate.id === template.id
                    ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] hover:border-[var(--border-accent)]'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-purple-500/30 rounded-lg">
                    <IconComponent className="w-4 h-4 text-purple-400" />
                  </div>
                  <h5 className="font-medium text-[var(--text-primary)]">{template.name}</h5>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  {template.fields.length} fields to complete
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Step {currentStep + 1} of {selectedTemplate.fields.length}
          </span>
          <span className="text-sm text-[var(--text-tertiary)]">
            {Math.round(((currentStep + 1) / selectedTemplate.fields.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-[var(--surface-tertiary)] rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / selectedTemplate.fields.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Field Input */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)]/50 border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              {currentField.label}
            </label>
            {currentField.options ? (
              <select
                value={fieldValues[currentField.key] || ''}
                onChange={(e) => handleFieldChange(currentField.key, e.target.value)}
                className="w-full p-4 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none"
              >
                <option value="">{currentField.placeholder}</option>
                {currentField.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={fieldValues[currentField.key] || ''}
                onChange={(e) => handleFieldChange(currentField.key, e.target.value)}
                placeholder={currentField.placeholder}
                className="w-full p-4 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-[var(--surface-tertiary)] text-[var(--text-quaternary)] cursor-not-allowed'
                  : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {selectedTemplate.fields.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-purple-500'
                      : fieldValues[selectedTemplate.fields[index].key]
                      ? 'bg-emerald-500'
                      : 'bg-[var(--surface-tertiary)]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStep === selectedTemplate.fields.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentStep === selectedTemplate.fields.length - 1
                  ? 'bg-[var(--surface-tertiary)] text-[var(--text-quaternary)] cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500/20 to-blue-600/20 hover:from-purple-500/30 hover:to-blue-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-200'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Live Preview</span>
        </h4>
        <div className="bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
          <p className="text-[var(--text-primary)] leading-relaxed">
            {generatedPrompt.split(/(\{[^}]+\})/).map((part, index) => {
              if (part.startsWith('{') && part.endsWith('}')) {
                return (
                  <span key={index} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md font-medium">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleUsePrompt}
          disabled={!isPromptComplete}
          className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isPromptComplete
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105'
              : 'bg-[var(--surface-tertiary)] text-[var(--text-quaternary)] cursor-not-allowed'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          <span>Use This Prompt</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Completion Stats */}
      <div className="mt-8 p-4 bg-[var(--surface-secondary)]/50 border border-[var(--border-primary)] rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPromptComplete ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {Object.values(fieldValues).filter(v => v).length} of {selectedTemplate.fields.length} completed
              </span>
            </div>
            <div className="w-px h-4 bg-[var(--border-primary)]"></div>
            <span className="text-sm text-[var(--text-tertiary)]">
              {isPromptComplete ? 'Ready to generate!' : 'Fill remaining fields'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedPromptBuilder;
