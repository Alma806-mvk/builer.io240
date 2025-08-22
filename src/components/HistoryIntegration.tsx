import React from 'react';
import HistoryWorldClass from './HistoryWorldClass';

interface HistoryItem {
  id: string;
  title?: string;
  contentType: string;
  content: any;
  platform?: string;
  timestamp: Date | number;
  tags?: string[];
  userInput?: string;
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
    userInput: item.userInput || item.title || '',
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
        console.log("History item clicked:", item);

        // Find the original history item to get full input and output
        const originalItem = history.find(h => h.id === item.id);
        console.log("Original item found:", originalItem);

        if (originalItem) {
          // Create a detailed view of the item
          const modal = document.createElement('div');
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 20px;
          `;

          modal.onclick = () => modal.remove();

          const content = document.createElement('div');
          content.style.cssText = `
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 24px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          `;

          content.onclick = (e) => e.stopPropagation();

          const contentType = item.type === 'text' ? 'Content Idea' :
                             item.type === 'image' ? 'Image Idea' :
                             item.type === 'video' ? 'Video Idea' :
                             item.type === 'analytics' ? 'Analytics' :
                             item.type === 'strategy' ? 'Strategy' :
                             item.type.charAt(0).toUpperCase() + item.type.slice(1);

          content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #38bdf8;">
                ${contentType} for ${item.platform}
              </h2>
              <button id="close-modal" style="
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
              ">×</button>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; color: #60a5fa;">User Input:</h3>
              <p style="margin: 0; padding: 12px; background: #1e293b; border-radius: 8px; border: 1px solid #475569; line-height: 1.5;">
                ${originalItem.userInput || item.userInput || 'No input provided'}
              </p>
            </div>

            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; color: #60a5fa;">Generated Output:</h3>
              <div style="padding: 12px; background: #1e293b; border-radius: 8px; border: 1px solid #475569; line-height: 1.5;">
                ${typeof originalItem.content === 'object' ?
                  JSON.stringify(originalItem.content, null, 2) :
                  originalItem.content || item.content}
              </div>
            </div>
          `;

          modal.appendChild(content);
          document.body.appendChild(modal);

          // Add close button event listener
          const closeBtn = content.querySelector('#close-modal');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
          }
        }
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
