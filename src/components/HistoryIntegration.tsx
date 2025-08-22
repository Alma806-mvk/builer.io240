import React from 'react';
import HistoryWorldClass from './HistoryWorldClass';

interface HistoryItem {
  id: string;
  title?: string;
  contentType: string;
  content: any;
  platform?: string;
  timestamp: Date;
  tags?: string[];
}

interface HistoryIntegrationProps {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  onNavigateToTab?: (tabId: string) => void;
}

const HistoryIntegration: React.FC<HistoryIntegrationProps> = ({
  history,
  setHistory,
  onNavigateToTab,
}) => {
  const historyItems = history.map(item => ({
    id: item.id,
    title: item.title || `${item.contentType} Content`,
    type: item.contentType === 'YoutubeChannelStats' ? 'analytics' as const : 
          item.contentType === 'ChannelAnalysis' ? 'analytics' as const :
          item.contentType === 'ThumbnailMaker' ? 'image' as const :
          item.contentType === 'ContentStrategy' ? 'strategy' as const : 'text' as const,
    content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
    platform: item.platform || 'Multi-Platform',
    timestamp: item.timestamp,
    tags: item.tags || [],
    starred: false,
    views: Math.floor(Math.random() * 2000) + 100,
    performance: Math.floor(Math.random() * 40) + 60,
  }));

  // Rating handler function
  const handleUpdateItemRating = (itemId: string, rating: 1 | -1 | 0) => {
    const updatedHistory = history.map(item =>
      item.id === itemId
        ? { ...item, rating }
        : item
    );
    setHistory(updatedHistory);

    // Show confirmation message
    const confirmationMessage = rating === 1
      ? "Thank you for your positive feedback! 🎉"
      : rating === -1
        ? "Thank you for sharing your experience. We'll work to improve! 💪"
        : "Rating removed";

    // Create and show a temporary confirmation message
    const messageEl = document.createElement('div');
    messageEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        border: 1px solid #334155;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
      ">
        ${confirmationMessage}
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      </style>
    `;

    document.body.appendChild(messageEl);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageEl.firstElementChild) {
        (messageEl.firstElementChild as HTMLElement).style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (document.body.contains(messageEl)) {
            document.body.removeChild(messageEl);
          }
        }, 300);
      }
    }, 3000);
  };

  return (
    <HistoryWorldClass
      historyItems={historyItems}
      onViewItem={(item) => {
        console.log("Viewing item:", item);
      }}
      onDeleteItem={(itemId) => {
        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
          const updatedHistory = history.filter(item => item.id !== itemId);
          setHistory(updatedHistory);
        }
      }}
      onStarItem={(itemId) => {
        console.log("Starring item:", itemId);
      }}
      onExportItems={(items) => {
        console.log("Exporting items:", items);
      }}
      updateItemRating={handleUpdateItemRating}
      onNavigateToTab={onNavigateToTab}
    />
  );
};

export default HistoryIntegration;
