import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StudioHubCommandPalette } from "./StudioHubCommandPalette";
import { CommandLineIcon } from "@heroicons/react/24/outline";

interface GlobalCommandPaletteProps {
  onNavigateToTab: (tab: string) => void;
  showFloatingButton?: boolean;
  onToggleFloatingButton?: (show: boolean) => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  onNavigateToTab,
  showFloatingButton = true,
  onToggleFloatingButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Command Palette shortcut (Ctrl+K or Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Additional global shortcuts
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key) {
          case "T":
            e.preventDefault();
            // Create YouTube Title
            onNavigateToTab("generator");
            setTimeout(() => {
              const contentTypeSelect = document.querySelector('#contentType') as HTMLSelectElement;
              if (contentTypeSelect) {
                contentTypeSelect.value = "titles";
                contentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }, 300);
            break;
          case "S":
            e.preventDefault();
            // Create Video Script
            onNavigateToTab("generator");
            setTimeout(() => {
              const contentTypeSelect = document.querySelector('#contentType') as HTMLSelectElement;
              if (contentTypeSelect) {
                contentTypeSelect.value = "scripts";
                contentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }, 300);
            break;
          case "I":
            e.preventDefault();
            // Create Content Ideas
            onNavigateToTab("generator");
            setTimeout(() => {
              const contentTypeSelect = document.querySelector('#contentType') as HTMLSelectElement;
              if (contentTypeSelect) {
                contentTypeSelect.value = "contentIdeas";
                contentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }, 300);
            break;
          case "P":
            e.preventDefault();
            // Create Thumbnail
            onNavigateToTab("thumbnailMaker");
            break;
          case "C":
            e.preventDefault();
            // Copy to clipboard
            let textToCopy = "";
            const contentSources = [
              '.generated-content',
              '.output-content', 
              '.content-output',
              '[data-generated-content]',
              'textarea[data-user-input]',
              '#userInput',
              'textarea:focus',
              'input[type="text"]:focus'
            ];
            
            for (const selector of contentSources) {
              const element = document.querySelector(selector) as HTMLElement;
              if (element) {
                const text = element.textContent || (element as HTMLInputElement).value;
                if (text && text.trim()) {
                  textToCopy = text.trim();
                  break;
                }
              }
            }
            
            if (!textToCopy) {
              textToCopy = "CreateGen Studio - AI Content Creation Platform";
            }
            
            navigator.clipboard.writeText(textToCopy).then(() => {
              // Show a brief toast notification
              const toast = document.createElement('div');
              toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
              toast.textContent = '📋 Copied to clipboard!';
              document.body.appendChild(toast);
              setTimeout(() => {
                document.body.removeChild(toast);
              }, 2000);
            });
            break;
          case "?":
            e.preventDefault();
            // Show keyboard shortcuts
            const shortcuts = `⌨️ Global Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌘K - Open Command Palette
⌘G - Go to Generator
⌘C - Go to Canvas
⌘T - Go to Thumbnails
⌘S - Go to Strategy
⌘R - Go to Trends
⌘L - Go to Calendar
⌘Y - Go to YouTube Analysis
⌘I - Go to History
⌘W - Go to Web Search
⌘H - Go to Dashboard
⌘P - Print
⌘? - Help Center

Content Creation:
⌘⇧T - Create YouTube Title
⌘⇧S - Create Video Script
⌘⇧I - Create Content Ideas
⌘⇧P - Create Thumbnail
⌘⇧C - Copy to Clipboard
⌘⇧? - Show Shortcuts

✨ These shortcuts work from ANY tab!`;
            alert(shortcuts);
            break;
        }
      }

      // Navigation shortcuts (without shift)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch (e.key) {
          case "h":
            e.preventDefault();
            onNavigateToTab("studioHub");
            break;
          case "g":
            e.preventDefault();
            onNavigateToTab("generator");
            break;
          // Removed Ctrl+C shortcut
          // case "c":
          //   e.preventDefault();
          //   onNavigateToTab("canvas");
          //   break;
          case "t":
            e.preventDefault();
            onNavigateToTab("thumbnailMaker");
            break;
          case "s":
            e.preventDefault();
            onNavigateToTab("strategy");
            break;
          case "r":
            e.preventDefault();
            onNavigateToTab("trends");
            break;
          case "l":
            e.preventDefault();
            onNavigateToTab("calendar");
            break;
          case "y":
            e.preventDefault();
            onNavigateToTab("channelAnalysis");
            break;
          case "i":
            e.preventDefault();
            onNavigateToTab("history");
            break;
          case "w":
            e.preventDefault();
            onNavigateToTab("search");
            break;
          case "p":
            e.preventDefault();
            window.print();
            break;
          case "?":
            e.preventDefault();
            window.open("https://help.creategen.studio", "_blank");
            break;
        }
      }
    };

    // Add global event listener
    document.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [onNavigateToTab]);

  return (
    <>
      {/* Command Palette */}
      <StudioHubCommandPalette
        onNavigateToTab={onNavigateToTab}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showFloatingCommandButton={showFloatingButton}
        onToggleFloatingButton={onToggleFloatingButton}
      />
      
      {/* Global Trigger Button - Conditionally visible with beautiful animations */}
      {showFloatingButton && (
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.25), 0 10px 10px -5px rgba(14, 165, 233, 0.04)"
        }}
        whileHover={{
          scale: 1.05,
          y: -2,
          boxShadow: "0 20px 35px -5px rgba(14, 165, 233, 0.35), 0 15px 15px -5px rgba(14, 165, 233, 0.1)",
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.95,
          y: 0,
          transition: { duration: 0.1 }
        }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-500 hover:via-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 z-50 backdrop-blur-sm border border-sky-400/20"
        title="Open Command Palette (⌘K)"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
          delay: 0.5
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <CommandLineIcon className="w-5 h-5" />
        </motion.div>
        <span className="font-semibold text-sm">⌘K</span>
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full opacity-20 blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
      )}
    </>
  );
};

// Initialize global command palette when this module is imported
export const initializeGlobalCommandPalette = (onNavigateToTab: (tab: string) => void) => {
  // Check if already initialized
  if (document.getElementById('global-command-palette-root')) {
    return;
  }

  // Create a root element for the global command palette
  const root = document.createElement('div');
  root.id = 'global-command-palette-root';
  document.body.appendChild(root);

  // This would normally use React.render but since we're in a React component context,
  // we'll rely on the component being imported and used in the main app
  console.log('Global Command Palette initialized');
};
