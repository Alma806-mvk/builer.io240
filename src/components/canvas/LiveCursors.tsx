import React, { useEffect, useState } from 'react';
import { CollaborationUser } from '../../services/canvasCollaborationService';

interface LiveCursorsProps {
  collaborators: CollaborationUser[];
  currentUserId?: string;
  containerRef: React.RefObject<HTMLElement>;
}

interface CursorComponent {
  user: CollaborationUser;
  position: { x: number; y: number };
}

export const LiveCursors: React.FC<LiveCursorsProps> = ({
  collaborators,
  currentUserId,
  containerRef
}) => {
  const [visibleCursors, setVisibleCursors] = useState<CursorComponent[]>([]);

  useEffect(() => {
    // Filter out current user and users without cursor positions
    const otherUserCursors = collaborators
      .filter(user => user.id !== currentUserId && user.cursor)
      .map(user => ({
        user,
        position: user.cursor!
      }));

    setVisibleCursors(otherUserCursors);
  }, [collaborators, currentUserId]);

  if (!containerRef.current || visibleCursors.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {visibleCursors.map(({ user, position }) => (
        <div
          key={user.id}
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-2px, -2px)'
          }}
        >
          {/* Cursor Icon */}
          <div className="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* User Name Label */}
            <div 
              className="absolute left-5 top-0 px-2 py-1 text-xs font-medium text-white rounded shadow-lg whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveCursors;
