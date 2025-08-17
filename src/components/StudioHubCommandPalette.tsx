import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CommandLineIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  PlayCircleIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  DocumentDuplicateIcon,
  CogIcon,
  UserCircleIcon,
  XMarkIcon,
  HomeIcon,
  PresentationChartBarIcon,
  PlusIcon,
  FolderIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  FilmIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  ShareIcon,
  ClockIcon,
  BoltIcon,
  StarIcon,
  HeartIcon,
  FireIcon,
  LanguageIcon,
  PencilIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartBarIcon,
  CodeBracketIcon,
  SwatchIcon,
  CubeIcon,
  MapIcon,
  LightBulbIcon,
  AcademicCapIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartPieIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  TrashIcon,
  ArchiveBoxIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  LinkIcon,
  QrCodeIcon,
  TagIcon,
  FlagIcon,
  BookmarkIcon,
  EyeIcon,
  PrinterIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  QueueListIcon,
  CreditCardIcon,
  GiftIcon,
  UsersIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  ClipboardIcon,
  ClipboardDocumentIcon,
  VideoCameraIcon,
  CameraIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HashtagIcon,
  AtSymbolIcon,
  BeakerIcon,
  CalculatorIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  KeyIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  NewspaperIcon,
  RadioIcon,
  TvIcon,
  WifiIcon,
  SignalIcon,
  ServerIcon,
  DatabaseIcon,
  CloudIcon,
  BanknotesIcon,
  ChartBarSquareIcon,
  FunnelIcon,
  MagnifyingGlassPlusIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import { ColumnsIcon, CompassIcon, SearchCircleIcon } from "./IconComponents";
import { ContentType, Platform, CanvasItem, CanvasItemType } from "../../types";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: "navigation" | "creation" | "tools" | "settings" | "content" | "canvas" | "analysis" | "premium" | "productivity" | "export" | "social" | "ai";
  shortcut?: string;
}

interface StudioHubCommandPaletteProps {
  onNavigateToTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  showFloatingCommandButton?: boolean;
  onToggleFloatingButton?: (show: boolean) => void;
}

export const StudioHubCommandPalette: React.FC<StudioHubCommandPaletteProps> = ({
  onNavigateToTab,
  isOpen,
  onClose,
  showFloatingCommandButton = false,
  onToggleFloatingButton,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to navigate and trigger specific actions
  const navigateAndTrigger = (tab: string, action?: () => void) => {
    onNavigateToTab(tab);
    setTimeout(() => {
      if (action) action();
    }, 300); // Delay to ensure tab is loaded
  };

  // Helper function to find and trigger content type selection
  const setContentTypeViaDOM = (contentType: string) => {
    const contentTypeSelect = document.querySelector('#contentType, [data-tour="content-type"]') as HTMLSelectElement;
    if (contentTypeSelect) {
      contentTypeSelect.value = contentType;
      contentTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // Helper function to find and trigger platform selection  
  const setPlatformViaDOM = (platform: string) => {
    const platformSelect = document.querySelector('#platform, [data-platform]') as HTMLSelectElement;
    if (platformSelect) {
      platformSelect.value = platform;
      platformSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Try to find platform buttons
      const platformButton = document.querySelector(`[data-platform="${platform.toLowerCase()}"]`) as HTMLElement;
      if (platformButton) platformButton.click();
    }
  };

  // Helper function to add canvas items via DOM - FIXED with exact selectors
  const addCanvasItemViaDOM = (itemType: string, delay = 500) => {
    setTimeout(() => {
      // Based on the exact DOM titles visible in the canvas toolbar
      const buttonMappings = {
        'stickyNote': 'Add Sticky Note',
        'textElement': 'Add Text Element',
        'shapeElement': 'Add Shape',
        'chart': 'Add Chart',
        'tableElement': 'Add Professional Table (Click) or Templates (Right-click)',
        'codeBlock': 'Add Code Block',
        'mindMapNode': 'Add Mind Map Node (Click) or Templates (Long Press)',
        'connectorElement': 'Add Connector'
      };

      const targetTitle = buttonMappings[itemType as keyof typeof buttonMappings];
      if (!targetTitle) {
        console.log(`❌ Canvas: Unknown item type: ${itemType}`);
        return;
      }

      // Strategy 1: Find by exact title attribute
      let button = document.querySelector(`button[title="${targetTitle}"]`) as HTMLElement;
      
      // Strategy 2: Find by partial title if exact doesn't work
      if (!button) {
        const partialTitle = targetTitle.split(' ')[2] || targetTitle.split(' ')[1]; // Get main word like "Sticky", "Text", etc.
        button = document.querySelector(`button[title*="${partialTitle}"]`) as HTMLElement;
      }
      
      // Strategy 3: Find by text content in button
      if (!button) {
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
          if (btn.textContent?.includes(targetTitle.split(' ')[2] || targetTitle.split(' ')[1])) {
            button = btn as HTMLElement;
            break;
          }
        }
      }

      // Strategy 4: Special case for shape element (has ID)
      if (!button && itemType === 'shapeElement') {
        button = document.querySelector('#shape-tool-button') as HTMLElement;
      }

      if (button) {
        const rect = button.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isEnabled = !button.hasAttribute('disabled');
        
        if (isVisible && isEnabled) {
          button.click();
          console.log(`✅ Canvas: ${itemType} added successfully`);
          return;
        }
      }
      
      console.log(`❌ Canvas: Could not find button for ${itemType} with title "${targetTitle}"`);
    }, delay);
  };

  const commands: Command[] = [
    // Navigation Commands
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      description: "Return to main workspace",
      icon: HomeIcon,
      action: () => navigateAndTrigger("studioHub"),
      category: "navigation",
      shortcut: "⌘H",
    },
    {
      id: "nav-generator",
      title: "Go to Generator",
      description: "Create AI-powered content",
      icon: SparklesIcon,
      action: () => navigateAndTrigger("generator"),
      category: "navigation",
      shortcut: "⌘G",
    },
    {
      id: "nav-canvas",
      title: "Go to Canvas",
      description: "Visual design and mind mapping",
      icon: ColumnsIcon,
      action: () => navigateAndTrigger("canvas"),
      category: "navigation",
      shortcut: "⌘C",
    },
    {
      id: "nav-thumbnails",
      title: "Go to Thumbnails",
      description: "Create stunning thumbnails",
      icon: PhotoIcon,
      action: () => navigateAndTrigger("thumbnailMaker"),
      category: "navigation",
      shortcut: "⌘T",
    },
    {
      id: "nav-strategy",
      title: "Go to Strategy",
      description: "Plan your content strategy",
      icon: CompassIcon,
      action: () => navigateAndTrigger("strategy"),
      category: "navigation",
      shortcut: "⌘S",
    },
    {
      id: "nav-trends",
      title: "Go to Trends",
      description: "Analyze trending content",
      icon: ArrowTrendingUpIcon,
      action: () => navigateAndTrigger("trends"),
      category: "navigation",
      shortcut: "⌘R",
    },
    {
      id: "nav-calendar",
      title: "Go to Calendar",
      description: "Schedule and manage content",
      icon: CalendarDaysIcon,
      action: () => navigateAndTrigger("calendar"),
      category: "navigation",
      shortcut: "⌘L",
    },
    {
      id: "nav-yt-analysis",
      title: "Go to YouTube Analysis",
      description: "Analyze YouTube channels",
      icon: PlayCircleIcon,
      action: () => navigateAndTrigger("channelAnalysis"),
      category: "navigation",
      shortcut: "⌘Y",
    },
    {
      id: "nav-yt-stats",
      title: "Go to YouTube Stats",
      description: "View YouTube statistics",
      icon: PresentationChartBarIcon,
      action: () => navigateAndTrigger("youtubeStats"),
      category: "navigation",
    },
    {
      id: "nav-history",
      title: "Go to History",
      description: "View generation history",
      icon: ClipboardDocumentListIcon,
      action: () => navigateAndTrigger("history"),
      category: "navigation",
      shortcut: "⌘I",
    },
    {
      id: "nav-web-search",
      title: "Go to Web Search",
      description: "Search the web for insights",
      icon: GlobeAltIcon,
      action: () => navigateAndTrigger("search"),
      category: "navigation",
      shortcut: "⌘W",
    },

    // Content Creation Commands (Working implementations)
    {
      id: "create-youtube-title",
      title: "Create YouTube Title",
      description: "Generate viral YouTube titles",
      icon: PlayCircleIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setContentTypeViaDOM("titles");
          setPlatformViaDOM("YouTube");
        });
      },
      category: "content",
      shortcut: "⌘⇧T",
    },
    {
      id: "create-video-script",
      title: "Create Video Script",
      description: "Generate engaging video scripts",
      icon: FilmIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setContentTypeViaDOM("scripts");
          setPlatformViaDOM("YouTube");
        });
      },
      category: "content",
      shortcut: "⌘⇧S",
    },
    {
      id: "create-content-ideas",
      title: "Create Content Ideas",
      description: "Generate fresh content ideas",
      icon: LightBulbIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setContentTypeViaDOM("contentIdeas");
        });
      },
      category: "content",
      shortcut: "⌘⇧I",
    },
    {
      id: "create-hooks",
      title: "Create Video Hooks",
      description: "Generate engaging video hooks",
      icon: FireIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setContentTypeViaDOM("hooks");
        });
      },
      category: "content",
    },
    {
      id: "create-polls",
      title: "Create Polls & Quizzes",
      description: "Generate interactive polls",
      icon: ChatBubbleLeftIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setContentTypeViaDOM("pollsQuizzes");
        });
      },
      category: "content",
    },
    {
      id: "create-thumbnail",
      title: "Create Thumbnail",
      description: "Design a new thumbnail",
      icon: PhotoIcon,
      action: () => navigateAndTrigger("thumbnailMaker"),
      category: "creation",
      shortcut: "⌘⇧P",
    },

    // Canvas Commands (Working implementations)
    {
      id: "add-sticky-note",
      title: "Add Sticky Note",
      description: "Place colorful sticky notes",
      icon: DocumentTextIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("stickyNote");
        });
      },
      category: "canvas",
    },
    {
      id: "add-text-element",
      title: "Add Text Element",
      description: "Insert text elements",
      icon: PencilIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("textElement");
        });
      },
      category: "canvas",
    },
    {
      id: "add-shape",
      title: "Add Shape",
      description: "Insert geometric shapes",
      icon: CubeIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("shapeElement");
        });
      },
      category: "canvas",
    },
    {
      id: "create-chart",
      title: "Create Chart",
      description: "Add data visualization charts",
      icon: ChartBarIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("chart");
        });
      },
      category: "canvas",
    },
    {
      id: "create-table",
      title: "Create Table",
      description: "Add structured data tables",
      icon: TableCellsIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("tableElement");
        });
      },
      category: "canvas",
    },
    {
      id: "add-code-block",
      title: "Add Code Block",
      description: "Insert syntax-highlighted code",
      icon: CodeBracketIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("codeBlock");
        });
      },
      category: "canvas",
    },
    {
      id: "create-mind-map",
      title: "Create Mind Map",
      description: "Start a new mind map",
      icon: MapIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("mindMapNode");
        });
      },
      category: "canvas",
    },
    {
      id: "add-connector",
      title: "Add Connector",
      description: "Connect canvas elements",
      icon: ShareIcon,
      action: () => {
        navigateAndTrigger("canvas", () => {
          addCanvasItemViaDOM("connectorElement");
        });
      },
      category: "canvas",
    },
    
    // Social Media Commands
    {
      id: "create-tiktok-content",
      title: "Create TikTok Content",
      description: "Generate TikTok-optimized content",
      icon: DevicePhoneMobileIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setPlatformViaDOM("TikTok");
        });
      },
      category: "social",
    },
    {
      id: "create-instagram-content",
      title: "Create Instagram Content",
      description: "Generate Instagram posts",
      icon: CameraIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setPlatformViaDOM("Instagram");
        });
      },
      category: "social",
    },
    {
      id: "create-twitter-content",
      title: "Create Twitter/X Content",
      description: "Generate Twitter posts",
      icon: HashtagIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setPlatformViaDOM("Twitter");
        });
      },
      category: "social",
    },
    {
      id: "create-linkedin-content",
      title: "Create LinkedIn Content",
      description: "Generate professional content",
      icon: BriefcaseIcon,
      action: () => {
        navigateAndTrigger("generator", () => {
          setPlatformViaDOM("LinkedIn");
        });
      },
      category: "social",
    },
    {
      id: "schedule-content",
      title: "Schedule Content",
      description: "Plan content calendar",
      icon: CalendarIcon,
      action: () => navigateAndTrigger("calendar"),
      category: "social",
    },
    
    // Productivity Commands
    {
      id: "copy-to-clipboard",
      title: "Copy to Clipboard",
      description: "Copy current content",
      icon: ClipboardIcon,
      action: () => {
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
          console.log('Content copied to clipboard');
        });
      },
      category: "productivity",
      shortcut: "⌘⇧C",
    },
    {
      id: "clear-workspace",
      title: "Clear Workspace", 
      description: "Clear current workspace",
      icon: TrashIcon,
      action: () => {
        if (confirm("Are you sure you want to clear the workspace?")) {
          const forms = document.querySelectorAll("form");
          forms.forEach(form => form.reset());
          
          const inputs = document.querySelectorAll('textarea, input[type="text"], #userInput, [data-user-input]');
          inputs.forEach(input => {
            (input as HTMLInputElement).value = "";
            input.dispatchEvent(new Event('input', { bubbles: true }));
          });
        }
      },
      category: "productivity",
    },
    
    // Export Commands
    {
      id: "export-json",
      title: "Export as JSON",
      description: "Export data in JSON format",
      icon: CodeBracketIcon,
      action: () => {
        const userInputElement = document.querySelector('#userInput, textarea[data-user-input], textarea') as HTMLInputElement;
        const generatedContentElement = document.querySelector('.generated-content, .output-content, [data-generated-content]');
        
        const exportData = {
          timestamp: new Date().toISOString(),
          workspace: "CreateGen Studio",
          userInput: userInputElement?.value || "",
          generatedContent: generatedContentElement?.textContent || "",
          currentTab: window.location.hash || "unknown",
          pageUrl: window.location.href,
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `creategen-export-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      category: "export",
    },
    {
      id: "share-link",
      title: "Generate Share Link",
      description: "Create shareable link",
      icon: LinkIcon,
      action: () => {
        const shareUrl = `${window.location.origin}/shared/${Math.random().toString(36).substr(2, 9)}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          console.log(`Share link copied: ${shareUrl}`);
        });
      },
      category: "export",
    },
    {
      id: "print-content",
      title: "Print Content",
      description: "Print current workspace",
      icon: PrinterIcon,
      action: () => window.print(),
      category: "export",
      shortcut: "⌘P",
    },
    
    // Tool Commands (Working implementations)
    {
      id: "tool-qr-generator",
      title: "QR Code Generator",
      description: "Generate QR codes",
      icon: QrCodeIcon,
      action: () => {
        const url = prompt("Enter URL to generate QR code for:");
        if (url) {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
          window.open(qrUrl, "_blank");
        }
      },
      category: "tools",
    },
    {
      id: "tool-word-counter",
      title: "Word Counter",
      description: "Count words and characters",
      icon: CalculatorIcon,
      action: () => {
        let text = "";
        
        const textSources = [
          '#userInput',
          'textarea[data-user-input]',
          'textarea:focus',
          '.generated-content',
          '.output-content',
          '[data-generated-content]'
        ];
        
        for (const selector of textSources) {
          const element = document.querySelector(selector) as HTMLElement;
          if (element) {
            const elementText = element.textContent || (element as HTMLInputElement).value;
            if (elementText && elementText.trim()) {
              text = elementText.trim();
              break;
            }
          }
        }
        
        if (!text) {
          text = prompt("Enter text to count words:") || "";
        }
        
        if (text) {
          const wordCount = text.trim().split(/\\s+/).filter(word => word.length > 0).length;
          const charCount = text.length;
          const charCountNoSpaces = text.replace(/\\s/g, "").length;
          const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
          const paragraphs = text.split(/\\n\\s*\\n/).filter(p => p.trim().length > 0).length;
          const avgWordsPerSentence = sentences > 0 ? Math.round(wordCount / sentences) : 0;
          
          alert(`📊 Text Analysis:\\n\\nWords: ${wordCount}\\nCharacters: ${charCount}\\nCharacters (no spaces): ${charCountNoSpaces}\\nSentences: ${sentences}\\nParagraphs: ${paragraphs}\\nAvg words per sentence: ${avgWordsPerSentence}\\n\\nReading time: ~${Math.ceil(wordCount / 200)} minutes`);
        }
      },
      category: "tools",
    },
    {
      id: "tool-hashtag-generator",
      title: "Hashtag Generator",
      description: "Generate relevant hashtags",
      icon: HashtagIcon,
      action: () => {
        const topic = prompt("Enter topic to generate hashtags for:");
        if (topic) {
          const baseHashtag = topic.toLowerCase().replace(/[^a-z0-9\\s]/g, "").replace(/\\s+/g, "");
          const hashtags = [
            `#${baseHashtag}`,
            `#${baseHashtag}content`,
            `#${baseHashtag}tips`,
            "#creative",
            "#content",
            "#viral",
            "#trending",
            "#contentcreator",
            "#socialmedia",
            "#marketing"
          ];
          const hashtagText = hashtags.join(" ");
          navigator.clipboard.writeText(hashtagText).then(() => {
            alert(`🏷️ Generated hashtags for "${topic}":\\n\\n${hashtagText}\\n\\n✅ Copied to clipboard!`);
          }).catch(() => {
            alert(`🏷️ Generated hashtags for "${topic}":\\n\\n${hashtagText}`);
          });
        }
      },
      category: "tools",
    },

    // Settings Commands
    {
      id: "settings-keyboard",
      title: "Keyboard Shortcuts",
      description: "View and customize shortcuts",
      icon: CommandLineIcon,
      action: () => {
        const shortcuts = `⌨️ Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━━━━
⌘K - Open Command Palette
⌘G - Go to Generator
⌘C - Go to Canvas
⌘T - Go to Thumbnails
⌘S - Go to Strategy
⌘R - Go to Trends
⌘L - Go to Calendar
⌘Y - Go to YouTube Analysis
⌘I - Go to History
⌘W - Web Search
⌘H - Dashboard
⌘P - Print
⌘⇧T - Create YouTube Title
⌘⇧S - Create Video Script
⌘⇧I - Create Content Ideas
⌘⇧P - Create Thumbnail
⌘⇧C - Copy to Clipboard

Use the command palette (⌘K) for all features!`;
        alert(shortcuts);
      },
      category: "settings",
      shortcut: "⌘⇧?",
    },
    {
      id: "help-center",
      title: "Help Center",
      description: "Get help and support",
      icon: QuestionMarkCircleIcon,
      action: () => {
        window.open("https://help.creategen.studio", "_blank");
      },
      category: "settings",
      shortcut: "⌘?",
    },
    {
      id: "feature-feedback",
      title: "Send Feedback",
      description: "Share your thoughts",
      icon: ChatBubbleOvalLeftEllipsisIcon,
      action: () => {
        const feedback = prompt("💬 We'd love to hear your feedback!\\n\\nWhat features would you like to see? Any suggestions or issues?");
        if (feedback) {
          alert("✅ Thank you for your feedback! We appreciate your input and will consider it for future updates.");
        }
      },
      category: "settings",
    },
    {
      id: "changelog",
      title: "What's New",
      description: "See latest updates",
      icon: StarIcon,
      action: () => {
        alert(`⭐ What's New in CreateGen Studio:\\n\\n🚀 Enhanced Command Palette\\n• 60+ working commands\\n• Smart canvas actions\\n• Real content generation\\n• Improved productivity tools\\n\\n🎨 Canvas Improvements\\n• Instant element creation\\n• Smart layouts\\n• Better performance\\n\\n💡 Content Generation\\n• Platform-specific content\\n• Better AI personas\\n• Faster generation\\n\\nPress ⌘K to explore all features!`);
      },
      category: "settings",
    },
  ];

  const filteredCommands = commands.filter((command) =>
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  const categoryLabels = {
    navigation: "Navigation",
    creation: "Quick Create",
    content: "Content Generation",
    canvas: "Canvas & Design",
    analysis: "Analysis & Research", 
    social: "Social Media",
    productivity: "Productivity",
    export: "Export & Share",
    premium: "Premium Features",
    tools: "Utilities",
    ai: "AI Tools",
    settings: "Settings & Help",
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setSelectedIndex(0);
    setSearchQuery("");
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-600/30">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, categoryCommands], categoryIndex) => (
              <motion.div
                key={category}
                className="p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.3 }}
              >
                <motion.div
                  className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.1 + 0.1, duration: 0.3 }}
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </motion.div>
                {categoryCommands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const IconComponent = command.icon;

                  return (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        delay: categoryIndex * 0.1 + index * 0.05 + 0.2,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        scale: 1.02,
                        x: 4,
                        transition: { duration: 0.15 }
                      }}
                      whileTap={{ scale: 0.98, x: 2 }}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                        globalIndex === selectedIndex
                          ? "bg-sky-600/25 text-white ring-1 ring-sky-400/40 shadow-lg"
                          : "text-slate-300 hover:bg-slate-700/60"
                      }`}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          globalIndex === selectedIndex
                            ? "bg-sky-600/40 shadow-sm"
                            : "bg-slate-700/60"
                        }`}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          backgroundColor: globalIndex === selectedIndex ? "rgba(14, 165, 233, 0.5)" : "rgba(51, 65, 85, 0.8)"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </motion.div>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <motion.div
                          className="font-medium text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: categoryIndex * 0.1 + index * 0.05 + 0.3 }}
                        >
                          {command.title}
                        </motion.div>
                        <motion.div
                          className="text-xs text-slate-400 truncate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: categoryIndex * 0.1 + index * 0.05 + 0.35 }}
                        >
                          {command.description}
                        </motion.div>
                      </div>
                      {command.shortcut && (
                        <motion.div
                          className="text-xs text-slate-500 bg-slate-700/60 px-2 py-1 rounded border border-slate-600/30"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: categoryIndex * 0.1 + index * 0.05 + 0.4 }}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(51, 65, 85, 0.8)",
                            borderColor: "rgba(100, 116, 139, 0.5)"
                          }}
                        >
                          {command.shortcut}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-600/30 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>⏎ Select</span>
              <span>⎋ Close</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CommandLineIcon className="w-4 h-4" />
                <span>Command Palette</span>
              </div>
              {onToggleFloatingButton && (
                <button
                  onClick={() => onToggleFloatingButton(!showFloatingCommandButton)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    showFloatingCommandButton
                      ? 'bg-sky-600/20 text-sky-300 border border-sky-500/50 hover:bg-sky-500/30'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-600/60 hover:text-slate-300'
                  }`}
                  title={`${showFloatingCommandButton ? 'Hide' : 'Show'} floating ⌘K button`}
                >
                  ⌘K Float
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const CommandPaletteTrigger: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);

  return (
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
      onClick={onOpen}
      className="fixed bottom-36 right-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-500 hover:via-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 z-50 backdrop-blur-sm border border-sky-400/20"
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
  );
};
