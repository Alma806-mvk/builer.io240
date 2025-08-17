import React, { useState, useEffect } from 'react';
import { Users, Share2, UserPlus, Eye, Clock, MousePointer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { canvasCollaborationService, CollaborationUser, CollaborationEvent } from '../../services/canvasCollaborationService';
import { AppNotifications } from '../../utils/appNotifications';

interface CanvasCollaborationProps {
  projectId: string;
  projectName: string;
  onCollaboratorsChange?: (users: CollaborationUser[]) => void;
  onCanvasItemsChange?: (items: any[]) => void;
}

export const CanvasCollaboration: React.FC<CanvasCollaborationProps> = ({
  projectId,
  projectName,
  onCollaboratorsChange,
  onCanvasItemsChange
}) => {
  const { user } = useAuth();
  const { billingInfo } = useSubscription();
  const [isCollaborationActive, setIsCollaborationActive] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  // Check if user has Agency Pro access
  const hasCollaborationAccess = canvasCollaborationService.hasCollaborationAccess(
    billingInfo?.subscription?.planId || 'free'
  );

  useEffect(() => {
    if (!hasCollaborationAccess || !user || !projectId) return;

    // Initialize collaboration
    const initCollaboration = async () => {
      try {
        await canvasCollaborationService.initializeCollaboration(
          projectId,
          user.uid,
          user.displayName || user.email || 'Anonymous',
          user.email || ''
        );

        // Subscribe to presence updates
        const unsubscribePresence = canvasCollaborationService.subscribeToPresence(
          projectId,
          (users) => {
            setCollaborators(users);
            onCollaboratorsChange?.(users);
          }
        );

        // Subscribe to canvas items updates
        const unsubscribeItems = canvasCollaborationService.subscribeToCanvasItems(
          projectId,
          (items) => {
            onCanvasItemsChange?.(items);
          }
        );

        // Subscribe to collaboration events
        const unsubscribeEvents = canvasCollaborationService.subscribeToEvents(
          projectId,
          (events) => {
            setRecentEvents(events);
          },
          10
        );

        setIsCollaborationActive(true);

        // Cleanup on unmount
        return () => {
          unsubscribePresence();
          unsubscribeItems();
          unsubscribeEvents();
          canvasCollaborationService.cleanup();
        };
      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
        AppNotifications.serviceUnavailable('Collaboration');
      }
    };

    initCollaboration();
  }, [projectId, user, hasCollaborationAccess]);

  const handleInviteCollaborator = async () => {
    if (!inviteEmail || !user) return;

    try {
      await canvasCollaborationService.addCollaborator(projectId, inviteEmail, user.uid);
      AppNotifications.operationSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
      AppNotifications.networkError();
    }
  };

  // If user doesn't have access, show upgrade prompt
  if (!hasCollaborationAccess) {
    return (
      <div className="fixed top-20 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Users className="h-5 w-5 text-orange-400" />
          <h3 className="text-white font-semibold">Real-Time Collaboration</h3>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Collaborate with your team in real-time. See live cursors, instant updates, and work together seamlessly.
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MousePointer className="h-3 w-3" />
            <span>Live cursor tracking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="h-3 w-3" />
            <span>Real-time presence indicators</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Share2 className="h-3 w-3" />
            <span>Instant canvas sync</span>
          </div>
        </div>
        <button 
          className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-sm font-medium transition-all"
          onClick={() => AppNotifications.operationSuccess('Upgrade modal would open here')}
        >
          Upgrade to Agency Pro
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <h3 className="text-white font-semibold">Live Collaboration</h3>
            {isCollaborationActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowActivityFeed(!showActivityFeed)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Activity Feed"
            >
              <Clock className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Invite Collaborator"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Collaborators */}
      <div className="p-4">
        <div className="text-xs text-slate-400 mb-3">
          Active Now ({collaborators.length})
        </div>
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">
                  {collaborator.name}
                  {collaborator.id === user?.uid && (
                    <span className="text-xs text-slate-400 ml-1">(You)</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {collaborator.email}
                </div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
          ))}
          {collaborators.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm">
              No active collaborators
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      {showActivityFeed && (
        <div className="border-t border-slate-600/50 p-4">
          <div className="text-xs text-slate-400 mb-3">Recent Activity</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentEvents.map((event, index) => (
              <div key={index} className="text-xs text-slate-300">
                <span className="font-medium">{event.userName}</span>
                <span className="text-slate-400 ml-1">
                  {event.action === 'item_added' && 'added an item'}
                  {event.action === 'item_updated' && 'updated an item'}
                  {event.action === 'item_deleted' && 'deleted an item'}
                </span>
                <span className="text-slate-500 ml-1">
                  {event.timestamp.toDate().toLocaleTimeString()}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="text-slate-400 text-center py-2">
                No recent activity
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Invite Collaborator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteCollaborator}
                  disabled={!inviteEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg transition-colors"
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

export default CanvasCollaboration;
