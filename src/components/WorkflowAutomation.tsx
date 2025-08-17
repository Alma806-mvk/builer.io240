import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { automationService, AutomationSettings } from '../services/automationService';
import { notificationService } from '../services/notificationService';

interface WorkflowAutomationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowAutomation: React.FC<WorkflowAutomationProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [scheduleFrequency, setScheduleFrequency] = useState('daily');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [reportFrequency, setReportFrequency] = useState('weekly');
  const [reportEmail, setReportEmail] = useState('');
  const [alert24h, setAlert24h] = useState(true);
  const [alert1week, setAlert1week] = useState(true);
  const [aiSettings, setAiSettings] = useState({
    autoGenerateTitles: true,
    smartPriority: true,
    autoTagging: false,
    collaborationSuggestions: false,
  });

  useEffect(() => {
    if (isOpen && user) {
      loadSettings();
    }
  }, [isOpen, user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSettings = await automationService.getAutomationSettings(user.uid);
      if (userSettings) {
        setSettings(userSettings);
        // Populate form fields with existing settings
        if (userSettings.contentScheduling) {
          setScheduleFrequency(userSettings.contentScheduling.frequency);
        }
        if (userSettings.autoExport) {
          setExportFormat(userSettings.autoExport.format);
        }
        if (userSettings.analyticsReports) {
          setReportFrequency(userSettings.analyticsReports.frequency);
          setReportEmail(userSettings.analyticsReports.email);
        }
        if (userSettings.smartAlerts) {
          setAlert24h(userSettings.smartAlerts.before24h);
          setAlert1week(userSettings.smartAlerts.before1week);
        }
        if (userSettings.aiAutomations) {
          setAiSettings(userSettings.aiAutomations);
        }
      }
    } catch (error) {
      console.error('Error loading automation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupContentScheduling = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await automationService.setupContentScheduling(user.uid, scheduleFrequency);
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Error setting up content scheduling:', error);
      alert('Failed to setup content scheduling. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAutoExport = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await automationService.setupAutoExport(user.uid, exportFormat);
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Error setting up auto-export:', error);
      alert('Failed to setup auto-export. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAnalyticsReports = async () => {
    if (!user || !reportEmail) {
      alert('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await automationService.setupAnalyticsReports(user.uid, reportFrequency, reportEmail);
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Error setting up analytics reports:', error);
      alert('Failed to setup analytics reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSmartAlerts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await automationService.setupSmartAlerts(user.uid, alert24h, alert1week);
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Error setting up smart alerts:', error);
      alert('Failed to setup smart alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAiAutomations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await automationService.updateAiAutomations(user.uid, aiSettings);
      await loadSettings(); // Refresh settings
    } catch (error) {
      console.error('Error updating AI automations:', error);
      alert('Failed to update AI automations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Save all automation settings
      await Promise.all([
        handleSetupContentScheduling(),
        handleSetupAutoExport(),
        reportEmail ? handleSetupAnalyticsReports() : Promise.resolve(),
        handleSetupSmartAlerts(),
        handleUpdateAiAutomations(),
      ]);

      // Create success notification
      await notificationService.createNotification(
        user.uid,
        'success',
        'Automation Settings Saved',
        'All your workflow automation settings have been successfully configured!',
        false
      );

      onClose();
    } catch (error) {
      console.error('Error saving automation settings:', error);
      alert('Some settings failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                ⚙️ Workflow Automation
              </h2>
              <p className="text-slate-400 text-sm">Automate your content creation workflow</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-slate-800/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-3 text-white">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Saving automation settings...</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Automation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Scheduling */}
              <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">📅</div>
                  <div>
                    <h3 className="font-bold text-white">Content Scheduling</h3>
                    <p className="text-slate-400 text-sm">Auto-schedule content</p>
                  </div>
                  {settings?.contentScheduling?.enabled && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3">Automatically schedule generated content across platforms</p>
                <select
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm mb-3"
                >
                  <option value="daily">Daily at 9:00 AM</option>
                  <option value="mwf">Mon/Wed/Fri at 2:00 PM</option>
                  <option value="weekly">Weekly on Tuesday</option>
                </select>
                <button
                  onClick={handleSetupContentScheduling}
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
                >
                  {settings?.contentScheduling?.enabled ? 'Update Schedule' : 'Setup Schedule Automation'}
                </button>
              </div>

              {/* Auto-Export */}
              <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:border-green-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">🔄</div>
                  <div>
                    <h3 className="font-bold text-white">Auto-Export</h3>
                    <p className="text-slate-400 text-sm">Export on completion</p>
                  </div>
                  {settings?.autoExport?.enabled && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3">Automatically export projects when they reach 100%</p>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm mb-3"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="json">JSON Data</option>
                  <option value="csv">CSV Spreadsheet</option>
                </select>
                <button
                  onClick={handleSetupAutoExport}
                  disabled={loading}
                  className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
                >
                  {settings?.autoExport?.enabled ? 'Update Export Settings' : 'Enable Auto-Export'}
                </button>
              </div>

              {/* Analytics Reports */}
              <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">📊</div>
                  <div>
                    <h3 className="font-bold text-white">Analytics Reports</h3>
                    <p className="text-slate-400 text-sm">Weekly summaries</p>
                  </div>
                  {settings?.analyticsReports?.enabled && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3">Receive automated weekly performance reports</p>
                <div className="space-y-2 mb-3">
                  <select
                    value={reportFrequency}
                    onChange={(e) => setReportFrequency(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value="weekly">Weekly on Monday</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>
                <button
                  onClick={handleSetupAnalyticsReports}
                  disabled={loading}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
                >
                  {settings?.analyticsReports?.enabled ? 'Update Reports' : 'Setup Weekly Reports'}
                </button>
              </div>

              {/* Smart Alerts */}
              <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">🚨</div>
                  <div>
                    <h3 className="font-bold text-white">Smart Alerts</h3>
                    <p className="text-slate-400 text-sm">Deadline reminders</p>
                  </div>
                  {settings?.smartAlerts?.enabled && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-3">Get notified about project deadlines and milestones</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alert24h}
                        onChange={(e) => setAlert24h(e.target.checked)}
                        className="w-3 h-3"
                      />
                      <span className="text-slate-300">24h before</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alert1week}
                        onChange={(e) => setAlert1week(e.target.checked)}
                        className="w-3 h-3"
                      />
                      <span className="text-slate-300">1 week before</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSetupSmartAlerts}
                  disabled={loading}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
                >
                  {settings?.smartAlerts?.enabled ? 'Update Alerts' : 'Configure Alerts'}
                </button>
              </div>
            </div>

            {/* AI-Powered Automations */}
            <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🤖 AI-Powered Automations
              </h3>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSettings.autoGenerateTitles}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, autoGenerateTitles: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-slate-300">Auto-generate project titles based on content</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSettings.smartPriority}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, smartPriority: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-slate-300">Smart priority assignment for new projects</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSettings.autoTagging}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, autoTagging: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-slate-300">Auto-tag projects based on content analysis</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSettings.collaborationSuggestions}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, collaborationSuggestions: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-slate-300">Suggest optimal collaboration assignments</span>
                </label>
              </div>
              <button
                onClick={handleUpdateAiAutomations}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
              >
                Update AI Settings
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAllSettings}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              Save Automation Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkflowAutomation;
