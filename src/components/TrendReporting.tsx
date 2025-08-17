import React, { useState } from "react";
import { TrendAnalysisOutput, Platform } from "../types";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  format: "pdf" | "powerpoint" | "excel" | "word";
  isPremium: boolean;
  icon: string;
  estimatedTime: string;
  pages: number;
}

interface ScheduledReport {
  id: string;
  templateId: string;
  templateName: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  recipients: string[];
  isActive: boolean;
  lastGenerated?: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  templateName: string;
  generatedAt: string;
  format: string;
  size: string;
  downloadCount: number;
  status: "ready" | "generating" | "failed";
}

interface TrendReportingProps {
  trendData?: TrendAnalysisOutput | null;
  platform?: Platform;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const TrendReporting: React.FC<TrendReportingProps> = ({
  trendData,
  platform,
  isPremium,
  onUpgrade,
}) => {
  const [activeTab, setActiveTab] = useState<"templates" | "customize" | "export" | "schedule" | "history">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("executive");
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [reportSettings, setReportSettings] = useState({
    includeCharts: true,
    includeRawData: false,
    includePredictions: true,
    includeCompetitorAnalysis: true,
    includeBranding: true,
    watermark: !isPremium,
    customTitle: "",
    customDescription: "",
    logoUrl: "",
    companyName: "",
    authorName: "",
    dateRange: "30d",
    confidentialityLevel: "public"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    templateId: "",
    frequency: "weekly" as const,
    recipients: [""],
    dayOfWeek: "monday",
    timeOfDay: "09:00"
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: "executive",
      name: "Executive Summary",
      description: "High-level insights for decision makers",
      sections: [
        "Key Insights",
        "Performance Metrics",
        "Trend Analysis",
        "Recommendations",
        "Action Items"
      ],
      format: "pdf",
      isPremium: false,
      icon: "📊",
      estimatedTime: "2-3 min",
      pages: 5
    },
    {
      id: "detailed",
      name: "Detailed Analysis Report",
      description: "Comprehensive breakdown with data and charts",
      sections: [
        "Executive Summary",
        "Methodology",
        "Data Analysis",
        "Trend Breakdown",
        "Regional Analysis",
        "Competitor Comparison",
        "Future Projections",
        "Appendix"
      ],
      format: "pdf",
      isPremium: true,
      icon: "📋",
      estimatedTime: "5-7 min",
      pages: 15
    },
    {
      id: "marketing",
      name: "Marketing Intelligence",
      description: "Actionable insights for marketing teams",
      sections: [
        "Market Overview",
        "Audience Insights",
        "Content Opportunities",
        "Campaign Recommendations",
        "Budget Allocation",
        "Timeline"
      ],
      format: "powerpoint",
      isPremium: true,
      icon: "📈",
      estimatedTime: "3-4 min",
      pages: 12
    },
    {
      id: "competitive",
      name: "Competitive Intelligence",
      description: "Monitor competitors and market position",
      sections: [
        "Competitive Landscape",
        "Market Share Analysis",
        "Competitor Performance",
        "Gap Analysis",
        "Strategic Recommendations"
      ],
      format: "pdf",
      isPremium: true,
      icon: "⚔️",
      estimatedTime: "4-5 min",
      pages: 10
    },
    {
      id: "financial",
      name: "Financial Impact Report",
      description: "ROI and financial implications of trends",
      sections: [
        "Market Size Analysis",
        "Revenue Opportunities",
        "Cost Implications",
        "ROI Projections",
        "Financial Recommendations"
      ],
      format: "excel",
      isPremium: true,
      icon: "💰",
      estimatedTime: "3-4 min",
      pages: 8
    },
    {
      id: "technical",
      name: "Technical Deep Dive",
      description: "Technical analysis for product and engineering teams",
      sections: [
        "Technical Overview",
        "Implementation Analysis",
        "Technical Requirements",
        "Risk Assessment",
        "Development Roadmap"
      ],
      format: "word",
      isPremium: true,
      icon: "⚙️",
      estimatedTime: "4-6 min",
      pages: 12
    }
  ];

  const availableSections = [
    "Executive Summary",
    "Methodology",
    "Key Insights",
    "Performance Metrics",
    "Trend Analysis",
    "Data Analysis",
    "Regional Analysis",
    "Audience Demographics",
    "Competitor Analysis",
    "Market Opportunities",
    "Risks and Challenges",
    "Future Projections",
    "Recommendations",
    "Action Items",
    "Timeline",
    "Budget Considerations",
    "Appendix"
  ];

  // Initialize with some demo generated reports
  React.useEffect(() => {
    setGeneratedReports([
      {
        id: "report-1",
        name: "AI Automation Trends - Executive Summary",
        templateName: "Executive Summary",
        generatedAt: "2025-07-20T14:30:00Z",
        format: "PDF",
        size: "2.3 MB",
        downloadCount: 5,
        status: "ready"
      },
      {
        id: "report-2",
        name: "Q4 Marketing Intelligence Report",
        templateName: "Marketing Intelligence",
        generatedAt: "2025-07-18T09:15:00Z",
        format: "PowerPoint",
        size: "4.7 MB",
        downloadCount: 12,
        status: "ready"
      },
      {
        id: "report-3",
        name: "Competitive Analysis - Tech Trends",
        templateName: "Competitive Intelligence",
        generatedAt: "2025-07-15T16:45:00Z",
        format: "PDF",
        size: "3.1 MB",
        downloadCount: 8,
        status: "ready"
      }
    ]);

    setScheduledReports([
      {
        id: "schedule-1",
        templateId: "executive",
        templateName: "Executive Summary",
        frequency: "weekly",
        nextRun: "2025-07-28T09:00:00Z",
        recipients: ["team@company.com", "ceo@company.com"],
        isActive: true,
        lastGenerated: "2025-07-21T09:00:00Z"
      },
      {
        id: "schedule-2",
        templateId: "marketing",
        templateName: "Marketing Intelligence",
        frequency: "monthly",
        nextRun: "2025-08-01T10:00:00Z",
        recipients: ["marketing@company.com"],
        isActive: true
      }
    ]);
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const template = reportTemplates.find(t => t.id === selectedTemplate);
      if (!template) return;

      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        templateName: template.name,
        generatedAt: new Date().toISOString(),
        format: template.format.toUpperCase(),
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        downloadCount: 0,
        status: "ready"
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      setActiveTab("history");
      
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (reportId: string) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) return;

    // Simulate download
    const blob = new Blob([`Mock ${report.templateName} Report Content`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '_')}.${report.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update download count
    setGeneratedReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
  };

  const deleteReport = (reportId: string) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
  };

  const scheduleReport = () => {
    if (!newSchedule.templateId || !newSchedule.recipients[0]) return;

    const template = reportTemplates.find(t => t.id === newSchedule.templateId);
    if (!template) return;

    const schedule: ScheduledReport = {
      id: Date.now().toString(),
      templateId: newSchedule.templateId,
      templateName: template.name,
      frequency: newSchedule.frequency,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      recipients: newSchedule.recipients.filter(email => email.trim()),
      isActive: true
    };

    setScheduledReports(prev => [schedule, ...prev]);
    setShowScheduleModal(false);
    setNewSchedule({
      templateId: "",
      frequency: "weekly",
      recipients: [""],
      dayOfWeek: "monday",
      timeOfDay: "09:00"
    });
  };

  const toggleScheduledReport = (scheduleId: string) => {
    setScheduledReports(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const deleteScheduledReport = (scheduleId: string) => {
    setScheduledReports(prev => prev.filter(s => s.id !== scheduleId));
  };

  const addRecipient = () => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, ""]
    }));
  };

  const updateRecipient = (index: number, value: string) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.map((email, i) => i === index ? value : email)
    }));
  };

  const removeRecipient = (index: number) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Report Templates</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">
            {reportTemplates.filter(t => !t.isPremium || isPremium).length} available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((template) => (
          <div
            key={template.id}
            className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
              selectedTemplate === template.id
                ? "bg-purple-600/20 border-purple-500/50"
                : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50"
            } ${
              template.isPremium && !isPremium ? "opacity-60" : ""
            }`}
            onClick={() => {
              if (!template.isPremium || isPremium) {
                setSelectedTemplate(template.id);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{template.icon}</span>
                  <h4 className="font-semibold text-white">{template.name}</h4>
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3">{template.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Format:</span>
                <span className="text-white font-medium">{template.format.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Pages:</span>
                <span className="text-white font-medium">{template.pages}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Generation Time:</span>
                <span className="text-white font-medium">{template.estimatedTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-slate-300">Sections Include:</h5>
              <div className="flex flex-wrap gap-1">
                {template.sections.slice(0, 3).map((section, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                  >
                    {section}
                  </span>
                ))}
                {template.sections.length > 3 && (
                  <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded">
                    +{template.sections.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {template.isPremium && !isPremium && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpgrade();
                  }}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-sm font-medium"
                >
                  Upgrade to Access
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">Selected Template Preview</h4>
            <button
              onClick={() => setActiveTab("customize")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium"
            >
              Customize →
            </button>
          </div>
          
          {(() => {
            const template = reportTemplates.find(t => t.id === selectedTemplate);
            return template ? (
              <div className="space-y-3">
                <h5 className="font-medium text-white">{template.name} - Section Overview</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.sections.map((section, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </span>
                      <span className="text-slate-300">{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );

  const renderCustomize = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Customize Report</h3>
        <button
          onClick={() => setActiveTab("export")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium"
        >
          Generate Report →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Settings */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Report Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Custom Title
                </label>
                <input
                  type="text"
                  value={reportSettings.customTitle}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, customTitle: e.target.value }))}
                  placeholder="Enter custom report title..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={reportSettings.customDescription}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, customDescription: e.target.value }))}
                  placeholder="Describe the purpose of this report..."
                  rows={3}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={reportSettings.companyName}
                    onChange={(e) => setReportSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Your company name"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={reportSettings.authorName}
                    onChange={(e) => setReportSettings(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="Report author"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Content Options</h4>
            <div className="space-y-4">
              {[
                { key: "includeCharts", label: "Include Charts & Graphs", description: "Visual representations of data" },
                { key: "includeRawData", label: "Include Raw Data", description: "Detailed datasets and tables" },
                { key: "includePredictions", label: "Include Future Predictions", description: "AI-powered forecasts" },
                { key: "includeCompetitorAnalysis", label: "Competitor Analysis", description: "Market comparison data" },
                { key: "includeBranding", label: "Custom Branding", description: "Your company logo and colors" }
              ].map((option) => (
                <div key={option.key} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={reportSettings[option.key as keyof typeof reportSettings] as boolean}
                    onChange={(e) => setReportSettings(prev => ({ 
                      ...prev, 
                      [option.key]: e.target.checked 
                    }))}
                    className="mt-1 rounded bg-slate-700 border-slate-600"
                  />
                  <div>
                    <p className="text-white font-medium">{option.label}</p>
                    <p className="text-slate-400 text-sm">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Customization */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Report Sections</h4>
            <div className="space-y-3">
              {(() => {
                const template = reportTemplates.find(t => t.id === selectedTemplate);
                return template ? template.sections.map((section, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </span>
                      <span className="text-white">{section}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-slate-700 border-slate-600"
                    />
                  </div>
                )) : null;
              })()}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <h5 className="font-medium text-white mb-3">Add Custom Sections</h5>
              <div className="space-y-2">
                {availableSections
                  .filter(section => {
                    const template = reportTemplates.find(t => t.id === selectedTemplate);
                    return !template?.sections.includes(section);
                  })
                  .slice(0, 5)
                  .map((section) => (
                    <label key={section} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={customSections.includes(section)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomSections(prev => [...prev, section]);
                          } else {
                            setCustomSections(prev => prev.filter(s => s !== section));
                          }
                        }}
                        className="rounded bg-slate-700 border-slate-600"
                      />
                      <span className="text-slate-300 text-sm">{section}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Data Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date Range
                </label>
                <select
                  value={reportSettings.dateRange}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confidentiality Level
                </label>
                <select
                  value={reportSettings.confidentialityLevel}
                  onChange={(e) => setReportSettings(prev => ({ ...prev, confidentialityLevel: e.target.value }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal Use</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Generate & Export Report</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Report Summary</h4>
            <div className="space-y-3">
              {(() => {
                const template = reportTemplates.find(t => t.id === selectedTemplate);
                return template ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Template:</span>
                      <span className="text-white font-medium">{template.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Format:</span>
                      <span className="text-white font-medium">{template.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Pages:</span>
                      <span className="text-white font-medium">{template.pages + customSections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Generation Time:</span>
                      <span className="text-white font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Range:</span>
                      <span className="text-white font-medium">{reportSettings.dateRange}</span>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Export Options</h4>
            <div className="space-y-3">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 rounded-lg text-white font-semibold flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <span>📊</span>
                    <span>Generate Report</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowScheduleModal(true)}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
              >
                <span>⏰</span>
                <span>Schedule Recurring Report</span>
              </button>
              
              <button
                onClick={() => setActiveTab("history")}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
              >
                <span>📁</span>
                <span>View Report History</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Report Preview</h4>
          <div className="bg-slate-700/30 rounded-lg p-4 min-h-[400px]">
            <div className="space-y-4">
              <div className="border-b border-slate-600 pb-2">
                <h5 className="font-semibold text-white">
                  {reportSettings.customTitle || reportTemplates.find(t => t.id === selectedTemplate)?.name}
                </h5>
                <p className="text-slate-400 text-sm">
                  {reportSettings.customDescription || "Generated trend analysis report"}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                <div className="h-4 bg-slate-600 rounded w-5/6"></div>
              </div>
              
              {reportSettings.includeCharts && (
                <div className="h-32 bg-slate-600/50 rounded flex items-center justify-center">
                  <span className="text-slate-400">📊 Chart Placeholder</span>
                </div>
              )}
              
              <div className="space-y-1">
                <div className="h-3 bg-slate-600 rounded w-full"></div>
                <div className="h-3 bg-slate-600 rounded w-4/5"></div>
                <div className="h-3 bg-slate-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Scheduled Reports</h3>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium"
        >
          + Schedule New Report
        </button>
      </div>

      {scheduledReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Reports</h3>
          <p className="text-slate-400 mb-4">Set up automatic report generation and delivery</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
          >
            Schedule Your First Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledReports.map((schedule) => (
            <div key={schedule.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{schedule.templateName}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      schedule.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}>
                      {schedule.isActive ? "Active" : "Paused"}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {schedule.frequency}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Next Run:</span>
                      <p className="text-white font-medium">
                        {new Date(schedule.nextRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Recipients:</span>
                      <p className="text-white font-medium">{schedule.recipients.length} recipients</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Generated:</span>
                      <p className="text-white font-medium">
                        {schedule.lastGenerated 
                          ? new Date(schedule.lastGenerated).toLocaleDateString()
                          : "Never"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-slate-400 text-sm">Recipients: </span>
                    <span className="text-slate-300 text-sm">
                      {schedule.recipients.join(", ")}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleScheduledReport(schedule.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      schedule.isActive
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {schedule.isActive ? "Pause" : "Resume"}
                  </button>
                  <button
                    onClick={() => deleteScheduledReport(schedule.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Report History</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">{generatedReports.length} reports</span>
        </div>
      </div>

      {generatedReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Reports Generated</h3>
          <p className="text-slate-400 mb-4">Generate your first report to see it here</p>
          <button
            onClick={() => setActiveTab("templates")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
          >
            Create Your First Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {generatedReports.map((report) => (
            <div key={report.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{report.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "ready" ? "bg-green-500/20 text-green-400" :
                      report.status === "generating" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Template:</span>
                      <p className="text-white font-medium">{report.templateName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Format:</span>
                      <p className="text-white font-medium">{report.format}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Size:</span>
                      <p className="text-white font-medium">{report.size}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Downloads:</span>
                      <p className="text-white font-medium">{report.downloadCount}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mt-2">
                    Generated on {new Date(report.generatedAt).toLocaleDateString()} at{" "}
                    {new Date(report.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => downloadReport(report.id)}
                    disabled={report.status !== "ready"}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Report Generation
            </h1>
            <p className="text-slate-400 text-sm">
              Create professional trend analysis reports
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30">
            <span className="text-emerald-400 text-xl">📄</span>
            <span className="text-emerald-300 text-sm font-semibold">
              Professional Reports
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex space-x-2">
          {[
            { key: "templates", label: "Templates", icon: "📋" },
            { key: "customize", label: "Customize", icon: "⚙️" },
            { key: "export", label: "Generate", icon: "📊" },
            { key: "schedule", label: "Schedule", icon: "⏰" },
            { key: "history", label: "History", icon: "📁" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-auto">
        {activeTab === "templates" && renderTemplates()}
        {activeTab === "customize" && renderCustomize()}
        {activeTab === "export" && renderExport()}
        {activeTab === "schedule" && renderSchedule()}
        {activeTab === "history" && renderHistory()}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Schedule Recurring Report</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Report Template
                </label>
                <select
                  value={newSchedule.templateId}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="">Select a template</option>
                  {reportTemplates
                    .filter(t => !t.isPremium || isPremium)
                    .map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSchedule.timeOfDay}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, timeOfDay: e.target.value }))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Recipients
                </label>
                <div className="space-y-2">
                  {newSchedule.recipients.map((email, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                      />
                      {newSchedule.recipients.length > 1 && (
                        <button
                          onClick={() => removeRecipient(index)}
                          className="px-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addRecipient}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                  >
                    + Add Recipient
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleReport}
                  disabled={!newSchedule.templateId || !newSchedule.recipients[0]}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50"
                >
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
