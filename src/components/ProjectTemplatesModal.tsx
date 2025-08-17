import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Palette,
  Calendar,
  BarChart3,
  Zap,
  Play,
  Download,
  Eye,
  Bookmark,
  Settings,
  Edit3,
  Rocket,
  Sliders,
  Plus
} from "lucide-react";

import { Button, Card, Badge, GradientText } from "./ui/WorldClassComponents";
import { nicheTemplates, NicheTemplate, getAllCategories } from "../data/nicheProjectTemplates";
import { projectTemplates, ProjectTemplate } from "../data/projectTemplates";
import { comprehensiveNicheTemplates, ComprehensiveNicheTemplate } from "../data/comprehensiveNicheTemplates";
import InteractiveTemplateConfigurator, { TemplateConfiguration } from "./InteractiveTemplateConfigurator";

interface ProjectTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NicheTemplate | ProjectTemplate | ComprehensiveNicheTemplate) => void;
  onCreateFromScratch: () => void;
}

const ProjectTemplatesModal: React.FC<ProjectTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onCreateFromScratch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"templates" | "niche">("niche");
  const [selectedTemplate, setSelectedTemplate] = useState<ComprehensiveNicheTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [templateConfiguration, setTemplateConfiguration] = useState<TemplateConfiguration | null>(null);
  const [appliedConfiguration, setAppliedConfiguration] = useState<TemplateConfiguration | null>(null);

  // Filter templates based on search and category
  const filteredNicheTemplates = comprehensiveNicheTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProjectTemplates = projectTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Templates", icon: "🚀" },
    { id: "business", label: "Business & Automation", icon: "🤖" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
    { id: "tech", label: "Tech", icon: "💻" },
    { id: "lifestyle", label: "Lifestyle", icon: "🍳" },
    { id: "education", label: "Education", icon: "��" },
    { id: "fitness", label: "Fitness", icon: "💪" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "food", label: "Food", icon: "🍽️" }
  ];

  const handleTemplateSelect = (template: ComprehensiveNicheTemplate | ProjectTemplate) => {
    if ('blueprint' in template) {
      setSelectedTemplate(template as ComprehensiveNicheTemplate);
      setShowPreview(true);
    } else {
      onSelectTemplate(template);
    }
  };

  const handlePersonalizeTemplate = (template: ComprehensiveNicheTemplate) => {
    setSelectedTemplate(template);
    setShowConfigurator(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const handleConfigurationChange = (config: TemplateConfiguration) => {
    setTemplateConfiguration(config);
  };

  const handleApplyTemplate = (config: TemplateConfiguration) => {
    if (selectedTemplate) {
      // Save the applied configuration
      setAppliedConfiguration(config);

      // Enhanced template selection with configuration
      onSelectTemplate({
        ...selectedTemplate,
        customConfiguration: config
      } as any);

      // Show success view instead of closing modal
      setShowConfigurator(false);
      setShowSuccess(true);
    }
  };

  const handleBackToPreview = () => {
    setShowConfigurator(false);
    setShowPreview(true);
  };

  const handleBackToTemplates = () => {
    setShowConfigurator(false);
    setShowPreview(false);
    setShowSuccess(false);
    setSelectedTemplate(null);
    setTemplateConfiguration(null);
    setAppliedConfiguration(null);
  };

  const handleViewProjects = () => {
    // Close modal and let user see their new projects
    onClose();
  };

  const handleCreateAnother = () => {
    // Reset to template selection
    setShowSuccess(false);
    setShowConfigurator(false);
    setShowPreview(false);
    setSelectedTemplate(null);
    setTemplateConfiguration(null);
    setAppliedConfiguration(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'var(--color-success)';
      case 'intermediate': return 'var(--color-warning)';
      case 'advanced': return 'var(--color-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[var(--surface-primary)] rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🚀 Project Templates Library
              </h2>
              <p className="text-white/90">
                Choose a template to get started with pre-configured workflows and best practices
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-[var(--surface-secondary)] border-r border-[var(--border-primary)] p-6 overflow-y-auto">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-[var(--surface-primary)] rounded-lg p-1 mb-6">
              <Button
                variant={viewMode === "niche" ? "primary" : "ghost"}
                size="xs"
                onClick={() => setViewMode("niche")}
                className="flex-1"
              >
                🎯 Niche Blueprints
              </Button>
              <Button
                variant={viewMode === "templates" ? "primary" : "ghost"}
                size="xs"
                onClick={() => setViewMode("templates")}
                className="flex-1"
              >
                📋 Quick Templates
              </Button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Categories</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)]'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                  {category.id !== "all" && (
                    <span className="ml-auto text-xs bg-[var(--surface-tertiary)] px-2 py-1 rounded-full">
                      {viewMode === "niche"
                        ? comprehensiveNicheTemplates.filter(t => t.category === category.id).length
                        : projectTemplates.filter(t => t.category === category.id).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCreateFromScratch}
                className="w-full mb-3"
              >
                <Play className="w-4 h-4" />
                Create from Scratch
              </Button>
              <p className="text-xs text-[var(--text-tertiary)] text-center">
                Or start with a blank project
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {!showPreview && !showConfigurator && !showSuccess ? (
                <motion.div
                  key="templates-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {viewMode === "niche" ? (
                    <>
                      {/* Popular Templates */}
                      {selectedCategory === "all" && (
                        <div className="mb-8">
                          <div className="flex items-center space-x-2 mb-4">
                            <Star className="w-5 h-5 text-[var(--color-warning)]" />
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                              Popular Niche Blueprints
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {comprehensiveNicheTemplates.filter(t => t.popular).map((template) => (
                            <NicheTemplateCard
                              key={template.id}
                              template={template}
                              onSelect={() => handleTemplateSelect(template)}
                              onPersonalize={handlePersonalizeTemplate}
                            />
                          ))}
                          </div>
                        </div>
                      )}

                      {/* All Templates */}
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                          {selectedCategory === "all" ? "All Niche Blueprints" : 
                           `${categories.find(c => c.id === selectedCategory)?.label} Blueprints`}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredNicheTemplates.map((template) => (
                            <NicheTemplateCard
                              key={template.id}
                              template={template}
                              onSelect={() => handleTemplateSelect(template)}
                              onPersonalize={handlePersonalizeTemplate}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Quick Templates */}
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                          Quick Project Templates
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredProjectTemplates.map((template) => (
                            <QuickTemplateCard
                              key={template.id}
                              template={template}
                              onSelect={() => handleTemplateSelect(template)}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Empty State */}
                  {((viewMode === "niche" && filteredNicheTemplates.length === 0) ||
                    (viewMode === "templates" && filteredProjectTemplates.length === 0)) && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        No templates found
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-4">
                        Try adjusting your search or browse different categories
                      </p>
                      <Button variant="ghost" onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}>
                        Clear filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : showConfigurator && selectedTemplate ? (
                <motion.div
                  key="configurator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Configurator Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        🎯 Smart Template Configurator
                      </h3>
                      <p className="text-[var(--text-secondary)]">
                        Customizing: {selectedTemplate.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={handleBackToPreview}>
                        Preview Template
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleBackToTemplates}>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back to Templates
                      </Button>
                    </div>
                  </div>

                  <InteractiveTemplateConfigurator
                    template={selectedTemplate}
                    onConfigurationChange={handleConfigurationChange}
                    onApplyTemplate={handleApplyTemplate}
                  />
                </motion.div>
              ) : showSuccess && selectedTemplate && appliedConfiguration ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Success Header */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-[var(--color-success)]20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        🎉 Template Applied Successfully!
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        Your personalized {selectedTemplate.name} has been created with {appliedConfiguration.customizedRoadmap.length} phases and {appliedConfiguration.recommendedTools.length} tools
                      </p>
                    </div>
                  </div>

                  {/* Success Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-[var(--color-success)]">
                          {appliedConfiguration.successProbability}%
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">Success Probability</div>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-[var(--brand-primary)]">
                          {appliedConfiguration.estimatedTimeline} days
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">Implementation Timeline</div>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-[var(--color-warning)]">
                          ${appliedConfiguration.estimatedCost}/mo
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">Monthly Investment</div>
                      </div>
                    </Card>
                  </div>

                  {/* What Was Created */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">What We Created For You:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                            <span className="font-medium text-[var(--text-primary)]">
                              {appliedConfiguration.customizedRoadmap.length} Implementation Phases
                            </span>
                          </div>
                          <div className="ml-7 space-y-1">
                            {appliedConfiguration.customizedRoadmap.map((phase: any, index: number) => (
                              <div key={index} className="text-sm text-[var(--text-secondary)]">
                                • {phase.name} ({phase.duration} days)
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                            <span className="font-medium text-[var(--text-primary)]">
                              {appliedConfiguration.recommendedTools.length} Tool Setup Projects
                            </span>
                          </div>
                          <div className="ml-7 space-y-1">
                            {appliedConfiguration.recommendedTools.slice(0, 4).map((tool: any, index: number) => (
                              <div key={index} className="text-sm text-[var(--text-secondary)]">
                                • {tool.name} ({tool.category})
                              </div>
                            ))}
                            {appliedConfiguration.recommendedTools.length > 4 && (
                              <div className="text-sm text-[var(--text-tertiary)]">
                                +{appliedConfiguration.recommendedTools.length - 4} more tools...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[var(--border-primary)]">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                          <span className="font-medium text-[var(--text-primary)]">
                            {selectedTemplate.blueprint.preBuiltProjects.length} Content Projects
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">
                            (Customized for {appliedConfiguration.userProfile.experienceLevel} level)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Projected Outcomes */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">Your Projected Results:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appliedConfiguration.projectedOutcomes.map((outcome: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-lg">
                            <div>
                              <div className="font-medium text-[var(--text-primary)]">{outcome.metric}</div>
                              <div className="text-sm text-[var(--text-secondary)]">{outcome.timeframe}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[var(--brand-primary)]">
                                {outcome.metric.includes('Revenue') ? '$' : ''}{outcome.value.toLocaleString()}
                                {outcome.metric.includes('Revenue') ? '/mo' : ''}
                              </div>
                              <div className="text-xs text-[var(--color-success)]">
                                {outcome.confidence}% confidence
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Next Steps */}
                  <Card variant="glow">
                    <div className="text-center space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">🚀 Ready to Start?</h3>
                      <p className="text-[var(--text-secondary)]">
                        All your projects have been created and are waiting for you in the pipeline.
                        Your personalized roadmap is ready to follow!
                      </p>
                      <div className="flex justify-center space-x-3">
                        <Button variant="primary" onClick={handleViewProjects}>
                          <Eye className="w-4 h-4" />
                          View My Projects
                        </Button>
                        <Button variant="secondary" onClick={handleCreateAnother}>
                          <Plus className="w-4 h-4" />
                          Create Another
                        </Button>
                        <Button variant="ghost" onClick={() => {
                          setShowSuccess(false);
                          setShowConfigurator(true);
                        }}>
                          <Settings className="w-4 h-4" />
                          Edit Configuration
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <TemplatePreview
                  template={selectedTemplate!}
                  onBack={() => setShowPreview(false)}
                  onUse={handleUseTemplate}
                  onCustomize={() => {
                    setShowPreview(false);
                    setShowConfigurator(true);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Niche Template Card Component
const NicheTemplateCard: React.FC<{
  template: ComprehensiveNicheTemplate;
  onSelect: () => void;
  onPersonalize?: (template: ComprehensiveNicheTemplate) => void;
}> = ({ template, onSelect, onPersonalize }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-[var(--surface-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-[var(--border-primary)]"
  >
    {/* Template Preview Header */}
    <div className={`bg-gradient-to-br ${template.color} p-4 text-white relative`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{template.icon}</div>
        {template.popular && (
          <Badge variant="warning" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-xs">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
      <h4 className="font-bold text-lg mb-1">{template.name}</h4>
      <p className="text-white/90 text-sm line-clamp-2">
        {template.description}
      </p>
    </div>

    {/* Full Template Preview Content */}
    <div className="p-4 space-y-4">
      {/* Key Features Preview */}
      <div className="space-y-2">
        <h5 className="font-semibold text-[var(--text-primary)] text-sm">What You Get:</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
            <span className="text-[var(--text-secondary)]">90-Day Roadmap</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
            <span className="text-[var(--text-secondary)]">{template.blueprint.preBuiltProjects.length} Projects</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
            <span className="text-[var(--text-secondary)]">Content Templates</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
            <span className="text-[var(--text-secondary)]">Automation Setup</span>
          </div>
        </div>
      </div>

      {/* Revenue Projection Preview */}
      <div className="bg-[var(--surface-tertiary)] rounded-lg p-3">
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--color-success)]">
            ${template.financialFramework.revenueProjections[2]?.estimatedRevenue.toLocaleString() || '5,000'}/mo
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            Projected revenue by month 6
          </div>
        </div>
      </div>

      {/* Template Stats */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{template.estimatedSetupTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
          />
          <span className="capitalize">{template.difficulty}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onSelect}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Use Full Template
        </Button>
        {onPersonalize && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPersonalize(template);
            }}
            className="w-full"
          >
            <Sliders className="w-4 h-4 mr-2" />
            Personalize
          </Button>
        )}
      </div>
    </div>
  </motion.div>
);

// Quick Template Card Component
const QuickTemplateCard: React.FC<{
  template: ProjectTemplate;
  onSelect: () => void;
}> = ({ template, onSelect }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-[var(--surface-secondary)] rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-[var(--border-primary)]"
    onClick={onSelect}
  >
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{template.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[var(--text-primary)]">{template.name}</h4>
            {template.popular && (
              <Badge variant="warning" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {template.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{template.estimatedDuration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
          />
          <span className="capitalize">{template.difficulty}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Template Preview Component
const TemplatePreview: React.FC<{
  template: ComprehensiveNicheTemplate;
  onBack: () => void;
  onUse: () => void;
  onCustomize?: () => void;
}> = ({ template, onBack, onUse, onCustomize }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack}>
        <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
        Back to Templates
      </Button>
      <div className="flex items-center space-x-3">
        {onCustomize && (
          <Button variant="secondary" onClick={onCustomize}>
            <Sliders className="w-4 h-4 mr-2" />
            Smart Customize
          </Button>
        )}
        <Button variant="primary" onClick={onUse}>
          <Download className="w-4 h-4 mr-2" />
          Use As-Is
        </Button>
      </div>
    </div>

    {/* Template Header */}
    <div className={`bg-gradient-to-br ${template.color} rounded-2xl p-8 text-white`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-4xl">{template.icon}</div>
        <div>
          <h2 className="text-2xl font-bold">{template.name}</h2>
          <p className="text-white/90">{template.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Setup: {template.estimatedSetupTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span className="capitalize">{template.difficulty} level</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>{template.blueprint.contentStrategy.growthGoals}</span>
        </div>
      </div>
    </div>

    {/* Blueprint Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Content Strategy */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Content Strategy</h3>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-1">Video Types:</h4>
            <div className="flex flex-wrap gap-1">
              {template.blueprint.contentStrategy.videoTypes.map((type, index) => (
                <Badge key={index} variant="neutral" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-1">Schedule:</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {template.blueprint.contentStrategy.postingSchedule}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-1">Monetization:</h4>
            <div className="flex flex-wrap gap-1">
              {template.blueprint.contentStrategy.monetization.map((method, index) => (
                <Badge key={index} variant="success" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Content Calendar */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-[var(--color-warning)]20 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[var(--color-warning)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Content Calendar</h3>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Weekly Structure:</h4>
            <div className="space-y-1">
              {Object.entries(template.blueprint.contentCalendar.weeklyStructure).map(([day, content]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{day}:</span>
                  <span className="text-[var(--text-primary)]">{content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Brand Assets */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-[var(--brand-secondary)]20 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-[var(--brand-secondary)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Brand Assets</h3>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Color Palette:</h4>
            <div className="flex space-x-2">
              {template.blueprint.brandAssets.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg border border-[var(--border-primary)]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-1">Thumbnail Styles:</h4>
            <div className="flex flex-wrap gap-1">
              {template.blueprint.brandAssets.thumbnailStyles.map((style, index) => (
                <Badge key={index} variant="neutral" className="text-xs">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Setup */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-[var(--color-success)]20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[var(--color-success)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Analytics & KPIs</h3>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-1">Key Metrics:</h4>
            <div className="space-y-1">
              {template.blueprint.analyticsSetup.kpis.map((kpi, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                  <span className="text-[var(--text-primary)]">{kpi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* Implementation Roadmap */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>90-Day Implementation Roadmap</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-success)]20 rounded-lg flex items-center justify-center text-[var(--color-success)] font-bold">1</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">{template.implementationRoadmap.phase1_setup.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{template.implementationRoadmap.phase1_setup.days} days</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">Key Milestones:</p>
              {template.implementationRoadmap.phase1_setup.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                  <span className="text-[var(--text-secondary)]">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-warning)]20 rounded-lg flex items-center justify-center text-[var(--color-warning)] font-bold">2</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">{template.implementationRoadmap.phase2_launch.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{template.implementationRoadmap.phase2_launch.days} days</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">Key Milestones:</p>
              {template.implementationRoadmap.phase2_launch.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                  <span className="text-[var(--text-secondary)]">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center text-[var(--brand-primary)] font-bold">3</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">{template.implementationRoadmap.phase3_growth.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{template.implementationRoadmap.phase3_growth.days} days</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">Key Milestones:</p>
              {template.implementationRoadmap.phase3_growth.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                  <span className="text-[var(--text-secondary)]">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--brand-secondary)]20 rounded-lg flex items-center justify-center text-[var(--brand-secondary)] font-bold">4</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">{template.implementationRoadmap.phase4_scale.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{template.implementationRoadmap.phase4_scale.days} days</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">Key Milestones:</p>
              {template.implementationRoadmap.phase4_scale.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                  <span className="text-[var(--text-secondary)]">{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>

    {/* Tools & Software */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <Settings className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>Tools & Software Stack</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-success)]20 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-[var(--color-success)]" />
              </div>
              <h4 className="font-medium text-[var(--text-primary)]">Starter Budget</h4>
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-[var(--color-success)]">{template.toolsAndSoftware.budgetTiers.starter.totalCost}</p>
              <div className="space-y-1">
                {template.toolsAndSoftware.budgetTiers.starter.tools.slice(0, 4).map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                    <span className="text-[var(--text-secondary)]">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--color-warning)]20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[var(--color-warning)]" />
              </div>
              <h4 className="font-medium text-[var(--text-primary)]">Professional</h4>
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-[var(--color-warning)]">{template.toolsAndSoftware.budgetTiers.professional.totalCost}</p>
              <div className="space-y-1">
                {template.toolsAndSoftware.budgetTiers.professional.tools.slice(0, 4).map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--color-warning)]" />
                    <span className="text-[var(--text-secondary)]">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-[var(--brand-primary)]" />
              </div>
              <h4 className="font-medium text-[var(--text-primary)]">Enterprise</h4>
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-[var(--brand-primary)]">{template.toolsAndSoftware.budgetTiers.enterprise.totalCost}</p>
              <div className="space-y-1">
                {template.toolsAndSoftware.budgetTiers.enterprise.tools.slice(0, 4).map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-[var(--brand-primary)]" />
                    <span className="text-[var(--text-secondary)]">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    {/* Financial Projections */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>Revenue Projections & Financial Framework</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {template.financialFramework.revenueProjections.map((projection, index) => (
          <Card key={index}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-[var(--text-primary)]">Month {projection.month}</div>
                <div className="text-3xl font-bold text-[var(--color-success)]">${projection.estimatedRevenue.toLocaleString()}</div>
                <div className="text-sm text-[var(--text-secondary)]">{projection.subscribers.toLocaleString()} subscribers</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">Revenue Breakdown:</p>
                {projection.revenueStreams.map((stream, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">{stream.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-[var(--text-primary)]">${stream.amount}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">({stream.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Content Creation Assets */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <Edit3 className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>Ready-to-Use Content Templates</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--text-primary)]">Script Templates</h4>
            {template.contentCreationAssets.scriptTemplates.slice(0, 1).map((script, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" className="text-xs">{script.videoType}</Badge>
                </div>
                <div className="bg-[var(--surface-tertiary)] rounded-lg p-4">
                  <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap overflow-x-auto">
                    {script.template.substring(0, 200)}...
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Hook Examples:</p>
                  {script.hooks.slice(0, 2).map((hook, idx) => (
                    <div key={idx} className="text-sm text-[var(--text-secondary)] italic">
                      ""{hook}""
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--text-primary)]">Thumbnail Templates</h4>
            {template.contentCreationAssets.thumbnailTemplates.slice(0, 1).map((thumb, index) => (
              <div key={index} className="space-y-3">
                <Badge variant="secondary" className="text-xs">{thumb.style}</Badge>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Text Formulas:</p>
                  <div className="flex flex-wrap gap-2">
                    {thumb.textFormulas.slice(0, 3).map((formula, idx) => (
                      <Badge key={idx} variant="neutral" className="text-xs">
                        {formula}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Color Schemes:</p>
                  <div className="space-y-1">
                    {thumb.colorSchemes.slice(0, 2).map((scheme, idx) => (
                      <div key={idx} className="text-sm text-[var(--text-secondary)]">
                        • {scheme}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>

    {/* Automation Systems */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <Zap className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>Automation Workflows & SOPs</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {template.automationSystems.workflows.slice(0, 2).map((workflow, index) => (
          <Card key={index}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[var(--text-primary)]">{workflow.name}</h4>
                <Badge variant="primary" className="text-xs">Automation</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">Trigger: {workflow.trigger}</p>
                <div className="space-y-1">
                  {workflow.steps.slice(0, 4).map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-5 h-5 bg-[var(--brand-primary)]20 rounded-full flex items-center justify-center text-xs font-medium text-[var(--brand-primary)]">
                        {idx + 1}
                      </div>
                      <span className="text-[var(--text-secondary)]">{step}</span>
                    </div>
                  ))}
                  {workflow.steps.length > 4 && (
                    <div className="text-sm text-[var(--text-tertiary)] ml-7">
                      +{workflow.steps.length - 4} more steps...
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-primary)]">
                <p className="text-xs text-[var(--text-tertiary)]">
                  Tools: {workflow.tools.join(', ')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Pre-built Projects */}
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center space-x-2">
        <Bookmark className="w-5 h-5 text-[var(--brand-primary)]" />
        <span>Included Projects ({template.blueprint.preBuiltProjects.length})</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {template.blueprint.preBuiltProjects.map((project, index) => (
          <Card key={index}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[var(--text-primary)]">{project.title}</h4>
                <Badge variant="primary" className="text-xs">
                  {project.type}
                </Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{project.estimatedHours}h estimated</span>
                </div>
                <span>{project.platform}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* What You Get Summary */}
    <Card variant="glow">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          🎯 Everything You Need to Succeed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[var(--color-success)]20 rounded-lg flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <p className="font-medium text-[var(--text-primary)]">90-Day Roadmap</p>
            <p className="text-[var(--text-secondary)]">Step-by-step implementation plan</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[var(--color-warning)]20 rounded-lg flex items-center justify-center mx-auto">
              <Edit3 className="w-6 h-6 text-[var(--color-warning)]" />
            </div>
            <p className="font-medium text-[var(--text-primary)]">Content Templates</p>
            <p className="text-[var(--text-secondary)]">Ready-to-use scripts & assets</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <p className="font-medium text-[var(--text-primary)]">Automation Setup</p>
            <p className="text-[var(--text-secondary)]">Workflows & SOPs included</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[var(--brand-secondary)]20 rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6 text-[var(--brand-secondary)]" />
            </div>
            <p className="font-medium text-[var(--text-primary)]">Financial Planning</p>
            <p className="text-[var(--text-secondary)]">Revenue projections & budgets</p>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          This isn't just a template - it's a complete business blueprint with everything you need to build a successful content empire.
          Follow the roadmap, use the templates, implement the systems, and watch your channel grow.
        </p>
      </div>
    </Card>
  </motion.div>
);

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return '#10B981';
    case 'intermediate': return '#F59E0B';
    case 'advanced': return '#EF4444';
    default: return 'var(--text-secondary)';
  }
};

export default ProjectTemplatesModal;
