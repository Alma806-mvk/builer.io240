// Global keyboard shortcuts that work from ANY tab
let globalShortcutsInitialized = false;
let onNavigateToTabCallback: ((tab: string) => void) | null = null;
let onOpenCommandPaletteCallback: (() => void) | null = null;

// Helper function to set content type via DOM
const setContentTypeViaDOM = (contentType: string) => {
  setTimeout(() => {
    const contentTypeSelect = document.querySelector('#contentType, [data-tour="content-type"]') as HTMLSelectElement;
    if (contentTypeSelect) {
      contentTypeSelect.value = contentType;
      contentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, 200);
};

// Helper function to copy content to clipboard
const copyContentToClipboard = () => {
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
  
  navigator.clipboard.writeText(textToCopy);
};

// Global keyboard event handler
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Command Palette shortcut (Ctrl+K or Cmd+K) - highest priority
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenCommandPaletteCallback) {
      onOpenCommandPaletteCallback();
    } else {
      // Fallback: try to find and trigger command palette
      const commandPaletteEvent = new CustomEvent('openCommandPalette', { bubbles: true });
      document.dispatchEvent(commandPaletteEvent);
    }
    return;
  }

  // Don't interfere with form inputs
  const target = e.target as HTMLElement;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return;
  }

  // Content creation shortcuts (Cmd/Ctrl + Shift + Key)
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && onNavigateToTabCallback) {
    switch (e.key.toLowerCase()) {
      case "t":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("generator");
        setContentTypeViaDOM("titles");
        break;
      case "s":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("generator");
        setContentTypeViaDOM("scripts");
        break;
      case "i":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("generator");
        setContentTypeViaDOM("contentIdeas");
        break;
      case "p":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("thumbnailMaker");
        break;
      case "c":
        e.preventDefault();
        e.stopPropagation();
        copyContentToClipboard();
        break;
      case "?":
        e.preventDefault();
        e.stopPropagation();
        const shortcuts = `⌨️ Global Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━━━━━━━━━━
⌘K - Open Command Palette (WORKS EVERYWHERE!)
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

Content Creation (from any tab):
⌘⇧T - Create YouTube Title
⌘⇧S - Create Video Script
⌘⇧I - Create Content Ideas
⌘⇧P - Create Thumbnail
⌘⇧C - Copy to Clipboard
⌘⇧? - Show Shortcuts

✨ All shortcuts work from ANY tab!`;
        alert(shortcuts);
        break;
    }
  }

  // Navigation shortcuts (Cmd/Ctrl + Key)
  if ((e.metaKey || e.ctrlKey) && !e.shiftKey && onNavigateToTabCallback) {
    switch (e.key.toLowerCase()) {
      case "h":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("studioHub");
        break;
      case "g":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("generator");
        break;
      case "c":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("canvas");
        break;
      case "t":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("thumbnailMaker");
        break;
      case "s":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("strategy");
        break;
      case "r":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("trends");
        break;
      case "l":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("calendar");
        break;
      case "y":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("channelAnalysis");
        break;
      case "i":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("history");
        break;
      case "w":
        e.preventDefault();
        e.stopPropagation();
        onNavigateToTabCallback("search");
        break;
      case "p":
        e.preventDefault();
        e.stopPropagation();
        window.print();
        break;
      case "?":
        e.preventDefault();
        e.stopPropagation();
        window.open("https://help.creategen.studio", "_blank");
        break;
    }
  }
};

// Initialize global keyboard shortcuts
export const initializeGlobalKeyboardShortcuts = (
  onNavigateToTab: (tab: string) => void,
  onOpenCommandPalette?: () => void
) => {
  if (globalShortcutsInitialized) {
    // Update callbacks
    onNavigateToTabCallback = onNavigateToTab;
    if (onOpenCommandPalette) {
      onOpenCommandPaletteCallback = onOpenCommandPalette;
    }
    return;
  }

  onNavigateToTabCallback = onNavigateToTab;
  if (onOpenCommandPalette) {
    onOpenCommandPaletteCallback = onOpenCommandPalette;
  }

  // Add global event listener with capture to ensure it works everywhere
  document.addEventListener("keydown", handleGlobalKeyDown, true);
  
  globalShortcutsInitialized = true;
  console.log('🚀 Global keyboard shortcuts initialized and working from ALL tabs!');
};

// Cleanup function
export const cleanupGlobalKeyboardShortcuts = () => {
  if (globalShortcutsInitialized) {
    document.removeEventListener("keydown", handleGlobalKeyDown, true);
    globalShortcutsInitialized = false;
    onNavigateToTabCallback = null;
    onOpenCommandPaletteCallback = null;
  }
};

// Listen for command palette open events
document.addEventListener('openCommandPalette', () => {
  if (onOpenCommandPaletteCallback) {
    onOpenCommandPaletteCallback();
  }
});
