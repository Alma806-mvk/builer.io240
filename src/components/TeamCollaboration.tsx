import React, { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar: string;
  lastActive: string;
  permissions: string[];
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  trends: string[];
  reports: string[];
  goals: Array<{ id: string; title: string; target: number; current: number; deadline: string; priority: "low" | "medium" | "high" }>;
  integrations: Array<{ id: string; name: string; type: string; status: "active" | "inactive"; lastSync: string }>;
  notifications: { email: boolean; slack: boolean; teams: boolean; realTime: boolean };
  security: { twoFactor: boolean; ssoEnabled: boolean; auditLog: boolean; ipRestriction: boolean };
  automation: Array<{ id: string; name: string; trigger: string; action: string; enabled: boolean }>;
}

interface TeamCollaborationProps {
  userPlan: "free" | "pro" | "enterprise";
  onUpgrade: () => void;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  userPlan,
  onUpgrade,
}) => {
  const isEnterprise = userPlan === "enterprise";

  const [activeTab, setActiveTab] = useState<
    "workspaces" | "members" | "permissions" | "activity"
  >("workspaces");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"editor" | "viewer">(
    "viewer",
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null,
  );
  const [showWorkspaceSettings, setShowWorkspaceSettings] = useState<string | null>(null);
  const [showTrendsModal, setShowTrendsModal] = useState<string | null>(null);
  const [showReportsModal, setShowReportsModal] = useState<string | null>(null);
  const [editingWorkspace, setEditingWorkspace] = useState<string | null>(null);
  const [workspaceForm, setWorkspaceForm] = useState({ name: "", description: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showGoalsModal, setShowGoalsModal] = useState<string | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<string | null>(null);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState<string | null>(null);
  const [showAutomationModal, setShowAutomationModal] = useState<string | null>(null);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const teamActivities: Array<{
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    type: string;
  }> = [];

  const inviteTeamMember = () => {
    if (!newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: newMemberRole,
      avatar: "👤",
      lastActive: new Date().toISOString(),
      permissions: newMemberRole === "editor" ? ["read", "write"] : ["read"],
    };

    if (selectedWorkspace) {
      setWorkspaces((prev) =>
        prev.map((workspace) =>
          workspace.id === selectedWorkspace
            ? { ...workspace, members: [...workspace.members, newMember] }
            : workspace,
        ),
      );
    }

    setNewMemberEmail("");
    setShowInviteModal(false);
  };

  const removeTeamMember = (workspaceId: string, memberId: string) => {
    setWorkspaces((prev) =>
      prev.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              members: workspace.members.filter((m) => m.id !== memberId),
            }
          : workspace,
      ),
    );
  };

  const updateMemberRole = (
    workspaceId: string,
    memberId: string,
    newRole: "admin" | "editor" | "viewer",
  ) => {
    setWorkspaces((prev) =>
      prev.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              members: workspace.members.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      role: newRole,
                      permissions:
                        newRole === "admin"
                          ? ["read", "write", "admin", "export"]
                          : newRole === "editor"
                            ? ["read", "write", "export"]
                            : ["read"],
                    }
                  : member,
              ),
            }
          : workspace,
      ),
    );
  };

  const createWorkspace = () => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: "New Workspace",
      description: "Workspace description",
      members: [],
      createdAt: new Date().toISOString().split("T")[0],
      trends: [],
      reports: [],
      goals: [],
      integrations: [],
      notifications: { email: true, slack: false, teams: false, realTime: true },
      security: { twoFactor: false, ssoEnabled: false, auditLog: true, ipRestriction: false },
      automation: [],
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  const editWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setWorkspaceForm({ name: workspace.name, description: workspace.description });
      setEditingWorkspace(workspaceId);
    }
  };

  const saveWorkspaceChanges = () => {
    if (!editingWorkspace) return;

    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === editingWorkspace
          ? { ...workspace, name: workspaceForm.name, description: workspaceForm.description }
          : workspace
      )
    );
    setEditingWorkspace(null);
    setWorkspaceForm({ name: "", description: "" });
  };

  const deleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
    setShowDeleteConfirm(null);
  };

  const addTrendToWorkspace = (workspaceId: string, trend: string) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === workspaceId
          ? { ...workspace, trends: [...workspace.trends, trend] }
          : workspace
      )
    );
  };

  const removeTrendFromWorkspace = (workspaceId: string, trendIndex: number) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === workspaceId
          ? { ...workspace, trends: workspace.trends.filter((_, i) => i !== trendIndex) }
          : workspace
      )
    );
  };

  const generateReport = (workspaceId: string, reportType: string) => {
    const reportName = `${reportType} Report - ${new Date().toLocaleDateString()}`;
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === workspaceId
          ? { ...workspace, reports: [...workspace.reports, reportName] }
          : workspace
      )
    );
    alert(`Generated ${reportType} report for workspace!`);
  };

  const exportWorkspaceData = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      const dataStr = JSON.stringify(workspace, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workspace.name.replace(/\s+/g, '_')}_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const renderTabContent = () => {
    if (!isEnterprise) {
      return (
        <div className="text-center py-16 px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-3xl">👑</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            Enterprise Team Collaboration
          </h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Unlock the full potential of team collaboration with advanced workspace management,
            enterprise-grade security, and powerful automation tools designed for growing businesses.
          </p>
          {/* Feature Categories */}
          <div className="space-y-8 mb-10">
            {/* Core Collaboration Features */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-xl font-semibold text-amber-400 mb-4 flex items-center justify-center">
                <span className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center mr-3">🏢</span>
                Advanced Workspace Management
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {[
                  "🏢 Unlimited team workspaces",
                  "👥 Advanced role & permission management",
                  "📊 Real-time team activity tracking",
                  "💬 Collaborative commenting & discussions",
                  "📄 Shared trend libraries & resources",
                  "🔄 Real-time synchronization across devices"
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-slate-300 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
                  >
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center justify-center">
                <span className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">✨</span>
                Premium Business Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {[
                  "🎯 Goals & KPI tracking system",
                  "📈 Advanced analytics & insights dashboard",
                  "🔌 Enterprise integrations (Slack, Teams, etc.)",
                  "🔔 Smart notification management",
                  "📧 Automated email & digest reports",
                  "📊 Custom report generation & scheduling"
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-slate-300 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
                  >
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Automation */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-xl font-semibold text-blue-400 mb-4 flex items-center justify-center">
                <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">🛡️</span>
                Security & Automation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {[
                  "🛡️ Enterprise-grade security & compliance",
                  "🔐 Two-factor authentication & SSO",
                  "📋 Audit logging & data retention policies",
                  "⚡ Workflow automation & triggers",
                  "🤖 AI-powered content quality checks",
                  "🌐 API access & custom integrations"
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-slate-300 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
                  >
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-6 mb-8 border border-amber-500/30">
            <h4 className="text-lg font-semibold text-amber-300 mb-3">🚀 Transform Your Team's Productivity</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-400">5x</div>
                <div className="text-sm text-amber-300">Faster Content Creation</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">90%</div>
                <div className="text-sm text-amber-300">Time Saved on Reports</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-amber-300">Automated Monitoring</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <button
              onClick={onUpgrade}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-white shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              🚀 Upgrade to Enterprise Now
            </button>
            <p className="text-slate-400 text-sm">
              30-day free trial • Cancel anytime • Setup support included
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "workspaces":
        return (
          <div className="space-y-6">
            {/* Workspace Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Workspaces</p>
                    <p className="text-2xl font-bold text-blue-300">
                      {workspaces.length}
                    </p>
                  </div>
                  <span className="text-2xl">🏢</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Members</p>
                    <p className="text-2xl font-bold text-emerald-300">
                      {workspaces.reduce((sum, w) => sum + w.members.length, 0)}
                    </p>
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Shared Trends</p>
                    <p className="text-2xl font-bold text-amber-300">
                      {workspaces.reduce((sum, w) => sum + w.trends.length, 0)}
                    </p>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            {/* Create Workspace Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Team Workspaces
              </h3>
              <button
                onClick={createWorkspace}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium"
              >
                + Create Workspace
              </button>
            </div>

            {/* Workspaces Grid */}
            {workspaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Workspaces Yet</h3>
                <p className="text-slate-400 mb-4">Create your first workspace to start collaborating with your team.</p>
                <button
                  onClick={createWorkspace}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium"
                >
                  Create Your First Workspace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {workspace.name}
                        </h4>
                        <p className="text-slate-400 text-sm mb-3">
                          {workspace.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Created: {workspace.createdAt}</span>
                          <span>{workspace.members.length} members</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedWorkspace(workspace.id);
                            setShowInviteModal(true);
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs"
                        >
                          Invite
                        </button>
                        <button
                          onClick={() => setShowWorkspaceSettings(workspace.id)}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-xs"
                        >
                          Settings
                        </button>
                      </div>
                    </div>

                    {/* Members Preview */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-2">
                        Team Members
                      </h5>
                      {workspace.members.length === 0 ? (
                        <p className="text-slate-400 text-sm">No members yet</p>
                      ) : (
                        <div className="flex -space-x-2">
                          {workspace.members.slice(0, 5).map((member) => (
                            <div
                              key={member.id}
                              className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm border-2 border-slate-800"
                              title={member.name}
                            >
                              {member.avatar}
                            </div>
                          ))}
                          {workspace.members.length > 5 && (
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs text-slate-300 border-2 border-slate-800">
                              +{workspace.members.length - 5}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Active Trends */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-2">
                        Active Trends
                      </h5>
                      {workspace.trends.length === 0 ? (
                        <p className="text-slate-400 text-sm">No trends yet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {workspace.trends.slice(0, 3).map((trend, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30"
                            >
                              {trend}
                            </span>
                          ))}
                          {workspace.trends.length > 3 && (
                            <span className="px-2 py-1 bg-slate-600/50 text-slate-400 rounded text-xs">
                              +{workspace.trends.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowTrendsModal(workspace.id)}
                        className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-white text-sm"
                      >
                        View Trends
                      </button>
                      <button
                        onClick={() => setShowReportsModal(workspace.id)}
                        className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-white text-sm"
                      >
                        Reports
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium"
              >
                + Invite Member
              </button>
            </div>

            {workspaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Team Members Yet</h3>
                <p className="text-slate-400 mb-4">Create a workspace and invite team members to get started.</p>
                <button
                  onClick={createWorkspace}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium"
                >
                  Create Workspace First
                </button>
              </div>
            ) : (
              workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6"
                >
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {workspace.name}
                  </h4>

                  <div className="space-y-3">
                    {workspace.members.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">👥</div>
                        <p className="text-slate-400">No members in this workspace yet</p>
                        <button
                          onClick={() => {
                            setSelectedWorkspace(workspace.id);
                            setShowInviteModal(true);
                          }}
                          className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
                        >
                          Invite Members
                        </button>
                      </div>
                    ) : (
                      workspace.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-lg">
                              {member.avatar}
                            </div>
                            <div>
                              <h5 className="font-medium text-white">
                                {member.name}
                              </h5>
                              <p className="text-slate-400 text-sm">
                                {member.email}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    member.role === "admin"
                                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                      : member.role === "editor"
                                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                                  }`}
                                >
                                  {member.role}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Last active:{" "}
                                  {new Date(member.lastActive).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                updateMemberRole(
                                  workspace.id,
                                  member.id,
                                  e.target.value as any,
                                )
                              }
                              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() =>
                                removeTeamMember(workspace.id, member.id)
                              }
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "permissions":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Permission Management
            </h3>

            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Role Permissions
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-slate-400">
                        Permission
                      </th>
                      <th className="text-center py-3 text-slate-400">
                        Viewer
                      </th>
                      <th className="text-center py-3 text-slate-400">
                        Editor
                      </th>
                      <th className="text-center py-3 text-slate-400">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        permission: "View trends and analytics",
                        viewer: true,
                        editor: true,
                        admin: true,
                      },
                      {
                        permission: "Create new trend analyses",
                        viewer: false,
                        editor: true,
                        admin: true,
                      },
                      {
                        permission: "Edit existing trends",
                        viewer: false,
                        editor: true,
                        admin: true,
                      },
                      {
                        permission: "Export reports",
                        viewer: false,
                        editor: true,
                        admin: true,
                      },
                      {
                        permission: "Invite team members",
                        viewer: false,
                        editor: false,
                        admin: true,
                      },
                      {
                        permission: "Manage permissions",
                        viewer: false,
                        editor: false,
                        admin: true,
                      },
                      {
                        permission: "Delete workspace",
                        viewer: false,
                        editor: false,
                        admin: true,
                      },
                    ].map((perm, index) => (
                      <tr key={index} className="border-b border-slate-700/50">
                        <td className="py-3 text-white">{perm.permission}</td>
                        <td className="text-center py-3">
                          {perm.viewer ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-slate-500">✗</span>
                          )}
                        </td>
                        <td className="text-center py-3">
                          {perm.editor ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-slate-500">✗</span>
                          )}
                        </td>
                        <td className="text-center py-3">
                          {perm.admin ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-slate-500">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Team Activity</h3>

            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
              {teamActivities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
                  <p className="text-slate-400">Team activity will appear here as members collaborate on workspaces.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          activity.type === "create"
                            ? "bg-green-500/20 text-green-400"
                            : activity.type === "share"
                              ? "bg-blue-500/20 text-blue-400"
                              : activity.type === "member"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {activity.type === "create"
                          ? "+"
                          : activity.type === "share"
                            ? "📤"
                            : activity.type === "member"
                              ? "👤"
                              : "🔒"}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-semibold">{activity.target}</span>
                        </p>
                        <p className="text-slate-400 text-sm">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Team Collaboration
            </h1>
            <p className="text-slate-400 text-sm">
              Manage team workspaces, members, and permissions
            </p>
          </div>
          {isEnterprise && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30">
              <span className="text-indigo-400 text-xl">🏢</span>
              <span className="text-indigo-300 text-sm font-semibold">
                Enterprise
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      {isEnterprise && (
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex space-x-2">
            {[
              { key: "workspaces", label: "Workspaces", icon: "🏢" },
              { key: "members", label: "Members", icon: "👥" },
              { key: "permissions", label: "Permissions", icon: "🔒" },
              { key: "activity", label: "Activity", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6 overflow-auto">{renderTabContent()}</div>

      {/* Workspace Settings Modal */}
      {showWorkspaceSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Workspace Settings</h3>
                <p className="text-slate-400 text-sm">Manage your workspace configuration and premium features</p>
              </div>
              <button
                onClick={() => setShowWorkspaceSettings(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mr-3">⚙️</span>
                  Basic Settings
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => editWorkspace(showWorkspaceSettings)}
                    className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">✏️</div>
                    <div className="font-semibold">Edit Details</div>
                    <div className="text-xs text-blue-400">Change name & description</div>
                  </button>

                  <button
                    onClick={() => exportWorkspaceData(showWorkspaceSettings)}
                    className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">📤</div>
                    <div className="font-semibold">Export Data</div>
                    <div className="text-xs text-green-400">Download workspace data</div>
                  </button>

                  <button
                    onClick={() => {
                      const workspace = workspaces.find(w => w.id === showWorkspaceSettings);
                      if (workspace) {
                        navigator.share && navigator.share({
                          title: `Join ${workspace.name} workspace`,
                          text: `You've been invited to collaborate on ${workspace.name}`,
                          url: window.location.href
                        }).catch(() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Invite link copied to clipboard!');
                        });
                      }
                    }}
                    className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="font-semibold">Share Link</div>
                    <div className="text-xs text-purple-400">Invite via link</div>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(showWorkspaceSettings)}
                    className="p-4 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🗑️</div>
                    <div className="font-semibold">Delete</div>
                    <div className="text-xs text-red-400">Remove workspace</div>
                  </button>
                </div>
              </div>

              {/* Premium Features */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 mr-3">👑</span>
                  Premium Features
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowGoalsModal(showWorkspaceSettings)}
                    className="p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold">Goals & KPIs</div>
                    <div className="text-xs text-emerald-400">Track team objectives</div>
                  </button>

                  <button
                    onClick={() => setShowAnalyticsModal(showWorkspaceSettings)}
                    className="p-4 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold">Analytics</div>
                    <div className="text-xs text-cyan-400">Performance insights</div>
                  </button>

                  <button
                    onClick={() => setShowIntegrationsModal(showWorkspaceSettings)}
                    className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🔌</div>
                    <div className="font-semibold">Integrations</div>
                    <div className="text-xs text-indigo-400">Connect tools & apps</div>
                  </button>

                  <button
                    onClick={() => setShowNotificationsModal(showWorkspaceSettings)}
                    className="p-4 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🔔</div>
                    <div className="font-semibold">Notifications</div>
                    <div className="text-xs text-violet-400">Alert preferences</div>
                  </button>

                  <button
                    onClick={() => setShowSecurityModal(showWorkspaceSettings)}
                    className="p-4 bg-orange-600/20 border border-orange-500/30 rounded-lg text-orange-300 hover:bg-orange-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">🛡️</div>
                    <div className="font-semibold">Security</div>
                    <div className="text-xs text-orange-400">Access & compliance</div>
                  </button>

                  <button
                    onClick={() => setShowAutomationModal(showWorkspaceSettings)}
                    className="p-4 bg-teal-600/20 border border-teal-500/30 rounded-lg text-teal-300 hover:bg-teal-600/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-semibold">Automation</div>
                    <div className="text-xs text-teal-400">Workflow automation</div>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <h5 className="font-semibold text-white mb-3">Workspace Quick Stats</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{workspaces.find(w => w.id === showWorkspaceSettings)?.members?.length || 0}</div>
                    <div className="text-xs text-slate-400">Team Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{workspaces.find(w => w.id === showWorkspaceSettings)?.trends?.length || 0}</div>
                    <div className="text-xs text-slate-400">Active Trends</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{workspaces.find(w => w.id === showWorkspaceSettings)?.reports?.length || 0}</div>
                    <div className="text-xs text-slate-400">Generated Reports</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{Math.floor(Math.random() * 100) + 50}%</div>
                    <div className="text-xs text-slate-400">Engagement Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Workspace</h3>
              <button
                onClick={() => setEditingWorkspace(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceForm.name}
                  onChange={(e) => setWorkspaceForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={workspaceForm.description}
                  onChange={(e) => setWorkspaceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingWorkspace(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWorkspaceChanges}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Delete Workspace</h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to delete this workspace? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteWorkspace(showDeleteConfirm)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white"
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Modal */}
      {showTrendsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Workspace Trends</h3>
              <button
                onClick={() => setShowTrendsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {(() => {
              const workspace = workspaces.find(w => w.id === showTrendsModal);
              return workspace ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workspace.trends.map((trend, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{trend}</h4>
                            <p className="text-xs text-slate-400">Active trend • {Math.floor(Math.random() * 100) + 1} mentions</p>
                          </div>
                          <button
                            onClick={() => removeTrendFromWorkspace(workspace.id, index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add new trend..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            addTrendToWorkspace(workspace.id, e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                      />
                      <button
                        onClick={() => generateReport(workspace.id, 'Trend Analysis')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded text-white"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Workspace Reports</h3>
              <button
                onClick={() => setShowReportsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {(() => {
              const workspace = workspaces.find(w => w.id === showReportsModal);
              return workspace ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {workspace.reports.map((report, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{report}</h4>
                            <p className="text-xs text-slate-400">Generated • {Math.floor(Math.random() * 30) + 1} days ago</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs">
                              View
                            </button>
                            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs">
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="font-semibold text-white mb-3">Generate New Report</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { type: 'Trend Analysis', icon: '📈' },
                        { type: 'Performance Summary', icon: '📊' },
                        { type: 'Team Activity', icon: '👥' },
                        { type: 'Engagement Report', icon: '💬' },
                        { type: 'Growth Analysis', icon: '🚀' },
                        { type: 'Custom Report', icon: '🔧' }
                      ].map((reportType) => (
                        <button
                          key={reportType.type}
                          onClick={() => generateReport(workspace.id, reportType.type)}
                          className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-sm text-center"
                        >
                          <div className="text-lg mb-1">{reportType.icon}</div>
                          <div>{reportType.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Workspace Goals & KPIs
                </h3>
                <p className="text-slate-400 text-sm">Track team objectives and key performance indicators</p>
              </div>
              <button
                onClick={() => setShowGoalsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Goal Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 text-sm">Active Goals</p>
                      <p className="text-2xl font-bold text-emerald-300">7</p>
                    </div>
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-blue-300">12</p>
                    </div>
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <div className="p-4 bg-amber-600/20 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-amber-300">85%</p>
                    </div>
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>

              {/* Goal Templates */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Quick Goal Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Content Engagement", target: "10K", metric: "interactions", icon: "💬" },
                    { title: "Trend Discovery", target: "25", metric: "trends/week", icon: "🔍" },
                    { title: "Team Productivity", target: "50", metric: "reports/month", icon: "⚡" },
                    { title: "Revenue Growth", target: "25%", metric: "increase", icon: "💰" },
                    { title: "User Acquisition", target: "500", metric: "new users", icon: "👥" },
                    { title: "Brand Awareness", target: "1M", metric: "impressions", icon: "🌟" }
                  ].map((template, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-600/30 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{template.icon}</span>
                        <button className="text-xs bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded text-white">
                          Use Template
                        </button>
                      </div>
                      <h5 className="font-semibold text-white mb-1">{template.title}</h5>
                      <p className="text-slate-400 text-sm">Target: {template.target} {template.metric}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Goal Creation */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Create Custom Goal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Goal Title</label>
                    <input
                      type="text"
                      placeholder="Enter goal name..."
                      className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Value</label>
                    <input
                      type="number"
                      placeholder="Enter target..."
                      className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-white font-medium">
                    Create Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Workspace Analytics
                </h3>
                <p className="text-slate-400 text-sm">Deep insights into team performance and trends</p>
              </div>
              <button
                onClick={() => setShowAnalyticsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Performance Metrics</h4>

                <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <h5 className="font-semibold text-white mb-3">Team Productivity</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Content Created</span>
                      <span className="text-emerald-400 font-semibold">127 items</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[78%]"></div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Trends Analyzed</span>
                      <span className="text-blue-400 font-semibold">89 trends</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-[92%]"></div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Reports Generated</span>
                      <span className="text-purple-400 font-semibold">34 reports</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-[67%]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <h5 className="font-semibold text-white mb-3">Engagement Rates</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">8.7/10</div>
                      <div className="text-xs text-slate-400">Avg. Content Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">94%</div>
                      <div className="text-xs text-slate-400">Team Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Analytics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Trend Analytics</h4>

                <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <h5 className="font-semibold text-white mb-3">Top Performing Content</h5>
                  <div className="space-y-3">
                    {[
                      { title: "AI Technology Trends", score: 9.2, engagement: "2.3M" },
                      { title: "Sustainable Business", score: 8.8, engagement: "1.8M" },
                      { title: "Remote Work Future", score: 8.5, engagement: "1.5M" }
                    ].map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                        <div>
                          <h6 className="font-medium text-white">{content.title}</h6>
                          <p className="text-xs text-slate-400">{content.engagement} total engagement</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400">{content.score}</div>
                          <div className="text-xs text-slate-400">Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <h5 className="font-semibold text-white mb-3">Growth Insights</h5>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-600/20 rounded-lg">
                      <div className="text-xl font-bold text-green-400">+23%</div>
                      <div className="text-xs text-green-300">Content Quality</div>
                    </div>
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">+156%</div>
                      <div className="text-xs text-blue-300">Team Efficiency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">
                Export Analytics
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg text-white">
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Modal */}
      {showIntegrationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🔌</span>
                  Workspace Integrations
                </h3>
                <p className="text-slate-400 text-sm">Connect your favorite tools and automate workflows</p>
              </div>
              <button
                onClick={() => setShowIntegrationsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Popular Integrations */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Popular Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Slack", type: "Communication", status: "active", icon: "💬", color: "emerald" },
                    { name: "Microsoft Teams", type: "Communication", status: "inactive", icon: "👥", color: "blue" },
                    { name: "Google Analytics", type: "Analytics", status: "active", icon: "📈", color: "amber" },
                    { name: "Zapier", type: "Automation", status: "active", icon: "⚡", color: "orange" },
                    { name: "Notion", type: "Documentation", status: "inactive", icon: "📝", color: "purple" },
                    { name: "Figma", type: "Design", status: "active", icon: "🎨", color: "pink" }
                  ].map((integration, index) => (
                    <div key={index} className={`p-4 bg-${integration.color}-600/20 border border-${integration.color}-500/30 rounded-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h5 className="font-semibold text-white">{integration.name}</h5>
                            <p className="text-xs text-slate-400">{integration.type}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          integration.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-500/20 text-slate-400"
                        }`}>
                          {integration.status}
                        </div>
                      </div>
                      <button className={`w-full py-2 rounded-lg text-sm font-medium ${
                        integration.status === "active"
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : `bg-${integration.color}-600/30 text-${integration.color}-300 hover:bg-${integration.color}-600/40`
                      }`}>
                        {integration.status === "active" ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Webhooks */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Custom Webhooks</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-white">Content Generation Hook</h5>
                        <p className="text-sm text-slate-400">https://api.yourapp.com/webhooks/content</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs">
                          Test
                        </button>
                        <button className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-xs">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                    + Add New Webhook
                  </button>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">API Keys & Tokens</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Workspace API Key</h5>
                      <p className="text-sm text-slate-400 font-mono">wsk_••••••••••••••••••••••••••••••••</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs">
                        Copy
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs">
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🔔</span>
                  Notification Settings
                </h3>
                <p className="text-slate-400 text-sm">Customize how and when you receive notifications</p>
              </div>
              <button
                onClick={() => setShowNotificationsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Notification Channels */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  {[
                    { type: "Email", icon: "📧", enabled: true, description: "Get updates via email" },
                    { type: "Slack", icon: "💬", enabled: false, description: "Receive alerts in Slack channels" },
                    { type: "Microsoft Teams", icon: "👥", enabled: false, description: "Get notified in Teams" },
                    { type: "In-App", icon: "🔔", enabled: true, description: "Real-time notifications in the app" }
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{channel.icon}</span>
                        <div>
                          <h5 className="font-semibold text-white">{channel.type}</h5>
                          <p className="text-sm text-slate-400">{channel.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={channel.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    { type: "New Trends Detected", enabled: true },
                    { type: "Goal Progress Updates", enabled: true },
                    { type: "Team Member Activity", enabled: false },
                    { type: "Report Generation Complete", enabled: true },
                    { type: "Integration Sync Issues", enabled: true },
                    { type: "Security Alerts", enabled: true },
                    { type: "Weekly Digest", enabled: false },
                    { type: "Monthly Summary", enabled: true }
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                      <span className="text-white">{notif.type}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={notif.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Quiet Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-emerald-600 bg-slate-600 border-slate-500 rounded focus:ring-emerald-500"
                    />
                    <span className="text-slate-300">Enable quiet hours on weekends</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg text-white font-medium">
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🛡️</span>
                  Security & Compliance
                </h3>
                <p className="text-slate-400 text-sm">Manage workspace security settings and compliance features</p>
              </div>
              <button
                onClick={() => setShowSecurityModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Security Status */}
              <div className="p-4 bg-green-600/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-green-300">Security Status: Excellent</h4>
                    <p className="text-green-400 text-sm">All security features are properly configured</p>
                  </div>
                </div>
              </div>

              {/* Authentication & Access */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Authentication & Access</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Two-Factor Authentication</h5>
                      <p className="text-sm text-slate-400">Add an extra layer of security to your workspace</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Single Sign-On (SSO)</h5>
                      <p className="text-sm text-slate-400">Enable SSO integration with your identity provider</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">IP Address Restrictions</h5>
                      <p className="text-sm text-slate-400">Limit access to specific IP addresses or ranges</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Compliance & Auditing */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Compliance & Auditing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-white">Audit Logging</h5>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Track all user actions and system events</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View Audit Logs</button>
                  </div>

                  <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-white">Data Retention</h5>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Configured</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Automatically manage data lifecycle (90 days)</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Configure Retention</button>
                  </div>

                  <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-white">GDPR Compliance</h5>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Compliant</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Ensure data privacy and user rights</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Privacy Settings</button>
                  </div>

                  <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-white">SOC 2 Compliance</h5>
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">In Progress</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Enterprise security framework compliance</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View Report</button>
                  </div>
                </div>
              </div>

              {/* Data Encryption */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Data Encryption</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-white mb-2">Encryption in Transit</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-green-400 text-sm">TLS 1.3 Enabled</span>
                    </div>
                    <p className="text-xs text-slate-400">All data transmitted using highest security protocols</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-2">Encryption at Rest</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-green-400 text-sm">AES-256 Enabled</span>
                    </div>
                    <p className="text-xs text-slate-400">All stored data encrypted with industry standard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">
                Download Security Report
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg text-white font-medium">
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Modal */}
      {showAutomationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Workflow Automation
                </h3>
                <p className="text-slate-400 text-sm">Create and manage automated workflows for your workspace</p>
              </div>
              <button
                onClick={() => setShowAutomationModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Automation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-teal-600/20 border border-teal-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-400 text-sm">Active Automations</p>
                      <p className="text-2xl font-bold text-teal-300">8</p>
                    </div>
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 text-sm">Tasks Automated</p>
                      <p className="text-2xl font-bold text-emerald-300">1,247</p>
                    </div>
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <div className="p-4 bg-amber-600/20 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-sm">Time Saved</p>
                      <p className="text-2xl font-bold text-amber-300">42hrs</p>
                    </div>
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
              </div>

              {/* Automation Templates */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Quick Setup Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Trend Alert System",
                      description: "Automatically notify team when new trends are detected",
                      trigger: "New trend detected",
                      action: "Send Slack notification",
                      icon: "📈",
                      color: "blue"
                    },
                    {
                      name: "Goal Progress Tracker",
                      description: "Update team on goal progress milestones",
                      trigger: "Goal milestone reached",
                      action: "Generate progress report",
                      icon: "🎯",
                      color: "emerald"
                    },
                    {
                      name: "Content Quality Check",
                      description: "Review content before publishing",
                      trigger: "Content created",
                      action: "Run quality analysis",
                      icon: "✅",
                      color: "purple"
                    },
                    {
                      name: "Weekly Digest",
                      description: "Compile and send weekly team summary",
                      trigger: "Every Monday 9AM",
                      action: "Email digest report",
                      icon: "📧",
                      color: "amber"
                    }
                  ].map((template, index) => (
                    <div key={index} className={`p-4 bg-${template.color}-600/20 border border-${template.color}-500/30 rounded-lg`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h5 className="font-semibold text-white">{template.name}</h5>
                            <p className="text-sm text-slate-400">{template.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs">
                          <span className="text-slate-400">Trigger:</span>
                          <span className={`ml-2 text-${template.color}-400`}>{template.trigger}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400">Action:</span>
                          <span className={`ml-2 text-${template.color}-400`}>{template.action}</span>
                        </div>
                      </div>
                      <button className={`w-full py-2 bg-${template.color}-600/30 hover:bg-${template.color}-600/40 rounded-lg text-${template.color}-300 text-sm font-medium`}>
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Automations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Active Automations</h4>
                  <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg text-white text-sm font-medium">
                    + Create Custom Automation
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Slack Trend Alerts", status: "active", lastRun: "2 hours ago", runs: 247 },
                    { name: "Daily Progress Email", status: "active", lastRun: "1 day ago", runs: 89 },
                    { name: "Quality Score Updates", status: "paused", lastRun: "3 days ago", runs: 156 },
                    { name: "Weekly Team Report", status: "active", lastRun: "6 days ago", runs: 12 }
                  ].map((automation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${automation.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <h5 className="font-semibold text-white">{automation.name}</h5>
                          <p className="text-sm text-slate-400">
                            Last run: {automation.lastRun} • {automation.runs} total runs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs">
                          Edit
                        </button>
                        <button className={`px-3 py-1 rounded text-white text-xs ${
                          automation.status === 'active'
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}>
                          {automation.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automation Builder Preview */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Automation Builder</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h5 className="font-semibold text-white mb-2">Trigger</h5>
                    <p className="text-sm text-slate-400">When something happens</p>
                  </div>
                  <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg text-center">
                    <div className="text-2xl mb-2">⚙️</div>
                    <h5 className="font-semibold text-white mb-2">Condition</h5>
                    <p className="text-sm text-slate-400">If criteria are met</p>
                  </div>
                  <div className="p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <h5 className="font-semibold text-white mb-2">Action</h5>
                    <p className="text-sm text-slate-400">Then do this</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium">
                    Open Automation Builder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Invite Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter team member's email"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="viewer">
                    Viewer - Can view trends and reports
                  </option>
                  <option value="editor">
                    Editor - Can create and edit content
                  </option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={inviteTeamMember}
                  disabled={!newMemberEmail.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white disabled:opacity-50"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
