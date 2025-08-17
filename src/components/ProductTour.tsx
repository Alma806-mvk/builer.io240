import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XCircleIcon,
  RightArrowIcon,
  ArrowUpIcon,
  LightBulbIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "./IconComponents";

interface TourStep {
  id: string;
  title: string;
  description: string;
  element: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: string;
  optional?: boolean;
}

interface ProductTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [waitingForTrends, setWaitingForTrends] = useState(false);
  const [trendsGenerated, setTrendsGenerated] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Dev debugging function to reset onboarding
  if (import.meta.env.DEV) {
    (window as any).resetOnboarding = () => {
      localStorage.removeItem('creategen-onboarding-completed');
      console.log('🔄 Dev: Onboarding state reset - blue overlay will appear again');
    };
  }

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to CreateGen Studio! ����",
      description:
        "Let's take a quick tour to show you all the amazing features available to help you create viral content!",
      element: "body",
      position: "center",
    },
    {
      id: "trends-tab",
      title: "Welcome to your new Content Studio!",
      description:
        "Let's find some opportunities. Start by typing a niche or topic you're passionate about.",
      element: "input[placeholder*=\"Enter topic\"], input[placeholder*=\"industry\"], input[placeholder*=\"keyword\"], .trend-search-input, input[type=\"text\"]",
      position: "bottom",
      action: "navigate-to-trends",
    },
    {
      id: "generate-trend-content",
      title: "Perfect! Now for the magic.",
      description:
        "This button takes these insights and instantly turns them into creative content ideas. Click it to continue.",
      element: "button[class*=\"from-purple-600\"][class*=\"to-blue-600\"], button[class*=\"from-purple-600\"], .trend-generate-button, button",
      position: "bottom",
      action: "navigate-to-generator",
    },
  ];

  const findElement = (selector: string): Element | null => {
    try {
      // Try multiple selectors separated by commas
      const selectors = selector.split(", ");

      for (const sel of selectors) {
        try {
          const cleanSelector = sel.trim();
          if (cleanSelector) {
            const element = document.querySelector(cleanSelector);
            if (element) {
              console.log(`🎯 Tour: Found element with selector: ${cleanSelector}`);
              return element;
            }
          }
        } catch (selectorError) {
          console.warn(`⚠️ Tour: Invalid selector: ${sel}`, selectorError);
          continue;
        }
      }

      // Special handling for trends search input
      if (selector.includes('Enter topic') || selector.includes('industry') || selector.includes('keyword')) {
        const trendInputs = [
          'input[placeholder*="Enter topic"]',
          'input[placeholder*="industry"]',
          'input[placeholder*="keyword"]',
          'input[type="text"]',
          '.trend-search-input',
          'input.bg-slate-800'
        ];

        for (const trendSel of trendInputs) {
          try {
            const trendEl = document.querySelector(trendSel);
            if (trendEl) {
              console.log(`🎯 Tour: Found trends input with: ${trendSel}`);
              return trendEl;
            }
          } catch (e) {
            continue;
          }
        }
      }

      // Special handling for generate trend content button
      if (selector.includes('from-purple-600') || selector.includes('trend-generate')) {
        console.log('🔍 Tour: Looking for Generate Content button...');

        // Find ANY purple gradient button with Generate Content text
        const buttons = document.querySelectorAll('button');

        for (const btn of buttons) {
          const text = btn.textContent || '';
          const hasGradient = btn.className.includes('from-purple-600') ||
                             btn.className.includes('bg-gradient-to-r') ||
                             btn.className.includes('to-blue-600');

          // Look for lightning bolt and generate content text with gradient
          if (text.includes('⚡') && text.includes('Generate Content') && hasGradient) {
            console.log(`🎯 Tour: Found Generate Content button: ${text}`);
            console.log(`🎯 Tour: Button classes: ${btn.className}`);

            // Scroll the button into view to ensure it's visible
            btn.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });

            return btn;
          }
        }

        // Fallback: just look for any button with the text
        for (const btn of buttons) {
          const text = btn.textContent || '';
          if (text.includes('⚡') && text.includes('Generate Content')) {
            console.log(`🎯 Tour: Found Generate Content button (fallback): ${text}`);
            return btn;
          }
        }

        console.warn('⚠️ Tour: Could not find Generate Content button');
        return null;

        console.warn('⚠️ Tour: No generate content buttons found');
      }

      console.warn(`⚠️ Tour: No element found for any selector: ${selector}`);
      console.log("🗺️ Available elements:", {
        "main-navigation": !!document.querySelector('[data-tour="main-navigation"]'),
        "nav elements": document.querySelectorAll("nav").length,
        "tab-navigation": !!document.querySelector(".main-tab-navigation"),
        "text inputs": document.querySelectorAll('input[type="text"]').length,
        "all buttons": document.querySelectorAll('button').length,
        "body class": document.body.className,
        "current URL": window.location.href,
      });
      return null;
    } catch (error) {
      console.error(`���� Tour: Error in findElement:`, error);
      return null;
    }
  };

  const calculateTooltipPosition = (element: Element, position: string) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 20;
    const padding = 10; // Minimum distance from viewport edges

    let x = 0;
    let y = 0;

    // Calculate initial position based on preferred direction
    switch (position) {
      case "top":
        x = rect.left + rect.width / 2 - tooltipWidth / 2;
        y = rect.top - tooltipHeight - offset;
        break;
      case "bottom":
        // Always center horizontally below the element
        x = rect.left + rect.width / 2 - tooltipWidth / 2;
        // Check if this is the generate content button
        const isGenerateButton = element.textContent?.includes('⚡') &&
                                 element.textContent?.includes('Generate Content') &&
                                 (element.className?.includes('from-purple-600') || element.className?.includes('bg-gradient-to-r'));
        // For the generate button, position it very close below (glued)
        const extraSpacing = isGenerateButton ? 10 : 0;
        y = rect.bottom + offset + extraSpacing;
        break;
      case "left":
        x = rect.left - tooltipWidth - offset;
        y = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
      case "right":
        x = rect.right + offset;
        y = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
      case "center":
        x = window.innerWidth / 2 - tooltipWidth / 2;
        y = window.innerHeight / 2 - tooltipHeight / 2;
        break;
      default:
        x = window.innerWidth / 2 - tooltipWidth / 2;
        y = window.innerHeight / 2 - tooltipHeight / 2;
    }

    // Ensure tooltip stays within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal bounds checking
    if (x < padding) {
      x = padding;
    } else if (x + tooltipWidth > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth - padding;
    }

    // Vertical bounds checking
    if (y < padding) {
      y = padding;
    } else if (y + tooltipHeight > viewportHeight - padding) {
      y = viewportHeight - tooltipHeight - padding;
    }

    // If element is not visible, center the tooltip
    if (
      rect.top < 0 ||
      rect.bottom > viewportHeight ||
      rect.left < 0 ||
      rect.right > viewportWidth
    ) {
      x = viewportWidth / 2 - tooltipWidth / 2;
      y = viewportHeight / 2 - tooltipHeight / 2;
    }

    return { x, y };
  };

  const highlightElement = (element: Element, stepId?: string) => {
    // Remove previous highlights and cleanup spotlight effects
    document.querySelectorAll(".tour-highlight, .tour-spotlight").forEach((el) => {
      el.classList.remove("tour-highlight", "tour-spotlight");
      // Reset inline styles from previous spotlight
      (el as HTMLElement).style.pointerEvents = '';
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
    });

    // Remove any existing overlays
    const existingSpotlightOverlay = document.querySelector('.tour-spotlight-overlay');
    if (existingSpotlightOverlay) {
      existingSpotlightOverlay.remove();
    }

    // Clean up generate button highlighting
    document.querySelectorAll('.tour-generate-highlight').forEach((el) => {
      el.classList.remove('tour-generate-highlight');
      (el as HTMLElement).style.boxShadow = '';
      (el as HTMLElement).style.transform = '';
      (el as HTMLElement).style.transition = '';
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
      (el as HTMLElement).style.borderRadius = '';
      (el as HTMLElement).style.filter = '';

      // Remove any button overlays
      const overlay = el.querySelector('.tour-button-overlay');
      if (overlay) {
        overlay.remove();
      }
    });

    // Remove dimming overlay for step 3
    const dimmingOverlay = document.querySelector('#tour-step3-dimming');
    if (dimmingOverlay) {
      dimmingOverlay.remove();
    }

    // Only remove blue overlay if we're moving away from trends-tab step
    if (stepId !== "trends-tab") {
      const existingBlueOverlay = document.querySelector('#tour-search-overlay');
      if (existingBlueOverlay) {
        // Remove event listeners if they exist
        const updatePosition = (existingBlueOverlay as any).updatePosition;
        if (updatePosition) {
          window.removeEventListener('scroll', updatePosition);
          window.removeEventListener('resize', updatePosition);
        }
        existingBlueOverlay.remove();
      }
    }

    // Special highlighting for generate content button
    if (stepId === "generate-trend-content") {
      element.classList.add("tour-generate-highlight");

      // Create a dimming overlay for everything except the button
      const existingDimming = document.querySelector('#tour-step3-dimming');
      if (!existingDimming) {
        const dimmingOverlay = document.createElement('div');
        dimmingOverlay.className = 'tour-dimming-overlay';
        dimmingOverlay.id = 'tour-step3-dimming';
        dimmingOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          pointer-events: none;
        `;
        document.body.appendChild(dimmingOverlay);
        console.log('✨ Tour: Created dimming overlay for step 3');
      }

      // Add enhanced glow effect for the generate button
      (element as HTMLElement).style.position = 'relative';
      (element as HTMLElement).style.zIndex = '1004';
      (element as HTMLElement).style.outline = '4px solid rgba(139, 92, 246, 1)';
      (element as HTMLElement).style.outlineOffset = '4px';
      (element as HTMLElement).style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.9), 0 0 80px rgba(139, 92, 246, 0.6)';
      (element as HTMLElement).style.transform = 'scale(1.1)';
      (element as HTMLElement).style.transition = 'all 0.4s ease';
      (element as HTMLElement).style.borderRadius = '12px';
      (element as HTMLElement).style.filter = 'brightness(1.3) saturate(1.4)';

      // Add a pulsing background overlay
      const existingOverlay = element.querySelector('.tour-button-overlay');
      if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'tour-button-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3));
          border-radius: 16px;
          z-index: -1;
          animation: tour-overlay-pulse 2s infinite;
          pointer-events: none;
        `;
        element.appendChild(overlay);
      }

      // Set up click handler to auto-complete tour
      const clickHandler = (e: Event) => {
        console.log('🎉 Tour: Generate button clicked! Auto-completing tour...');
        // Clean up tour effects immediately
        cleanupTourEffects();
        // Complete the tour
        setTimeout(() => {
          onComplete();
        }, 100);
        element.removeEventListener('click', clickHandler);
      };
      element.addEventListener('click', clickHandler);

      console.log('✨ Tour: Applied enhanced highlighting with dimming overlay and click handler to generate button');
      return;
    }

    // Use simple blue overlay for search bar step - ONLY during first-time onboarding
    if (stepId === "trends-tab") {
      // Check if this is the first-time onboarding
      const hasSeenOnboarding = localStorage.getItem('creategen-onboarding-completed');

      if (!hasSeenOnboarding) {
        element.classList.add("tour-blue-highlight");

        // Create persistent blue overlay that sticks perfectly to the input outline
        const blueOverlay = document.createElement('div');
        blueOverlay.className = 'tour-blue-overlay';
        blueOverlay.id = 'tour-search-overlay';

        // Get exact input dimensions and position
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const borderRadius = computedStyle.borderRadius || '8px';

        // Position overlay to match input exactly
        blueOverlay.style.cssText = `
          position: absolute;
          top: ${rect.top + window.scrollY}px;
          left: ${rect.left + window.scrollX}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          border: 2px solid #3B82F6;
          border-radius: ${borderRadius};
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.6);
          background: rgba(59, 130, 246, 0.05);
          z-index: 1002;
          pointer-events: none;
          animation: tour-blue-pulse 2s infinite;
        `;
        document.body.appendChild(blueOverlay);

        // Update overlay position on scroll/resize
        const updateOverlayPosition = () => {
          const newRect = element.getBoundingClientRect();
          blueOverlay.style.top = `${newRect.top + window.scrollY}px`;
          blueOverlay.style.left = `${newRect.left + window.scrollX}px`;
          blueOverlay.style.width = `${newRect.width}px`;
          blueOverlay.style.height = `${newRect.height}px`;
        };

        window.addEventListener('scroll', updateOverlayPosition);
        window.addEventListener('resize', updateOverlayPosition);

        // Store event listeners for cleanup
        (blueOverlay as any).updatePosition = updateOverlayPosition;

        // Make sure input is interactive
        (element as HTMLElement).style.position = 'relative';
        (element as HTMLElement).style.zIndex = '1003';
      }
    } else {
      // Regular highlight for other steps
      element.classList.add("tour-highlight");
    }

    // Scroll element into view
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const updateStep = (stepIndex: number) => {
    try {
      const step = tourSteps[stepIndex];
      if (!step) {
        console.error(`⚠️ Tour: No step found at index ${stepIndex}`);
        return;
      }

      console.log(`🎤 Tour Step ${stepIndex + 1}: ${step.title}`);

      // Handle special actions
      if (step.action === "navigate-to-trends" || step.action === "click-tab") {
        // First check if we're in the main app
        const isInMainApp = document.querySelector(
          '[data-tour="main-navigation"], nav, .main-tab-navigation, button[data-tab]'
        );

        if (!isInMainApp && step.id === "trends-tab") {
          console.log('🚀 Tour: Not in main app, need to navigate first');
          // Try to find and click a "Get Started" or "Enter App" button
          const enterButtons = document.querySelectorAll('button, a');
          for (const btn of enterButtons) {
            const text = btn.textContent?.toLowerCase() || '';
            if (text.includes('get started') || text.includes('enter') || text.includes('dashboard') || text.includes('app')) {
              console.log('🚀 Tour: Found enter app button, clicking');
              (btn as HTMLElement).click();

              // Wait for navigation then retry the step
              setTimeout(() => {
                handleTabSwitch(step);
              }, 1500);
              return;
            }
          }
        }

        handleTabSwitch(step);
        // Continue with normal step positioning after tab switch
      }

      // For the search step, set up waiting for trends
      if (step.id === "trends-tab") {
        setWaitingForTrends(true);
      }

      // For the generate content step, ensure we're on trends tab and button exists
      if (step.id === "generate-trend-content") {
        // Remove blue overlay when moving to step 3
        const blueOverlay = document.querySelector('#tour-search-overlay');
        if (blueOverlay) {
          console.log('🔵 Removing blue overlay - moving to step 3');
          const updatePosition = (blueOverlay as any).updatePosition;
          if (updatePosition) {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
          }
          blueOverlay.remove();
        }

        // FIRST: Ensure we're on the trends tab
        const trendsTab = document.querySelector('button[data-tab="trends"]');
        const currentTab = document.querySelector('button[aria-current="page"]');
        const isOnTrendsTab = currentTab?.getAttribute('data-tab') === 'trends';

        if (!isOnTrendsTab && trendsTab) {
          console.log('🔄 Tour: NOT on trends tab, switching now');
          console.log('🔄 Current tab:', currentTab?.getAttribute('data-tab'));
          (trendsTab as HTMLElement).click();

          // Wait longer for tab to load and trends to be available
          setTimeout(() => {
            console.log('🔄 Tour: Retrying step 3 after tab switch');
            updateStep(currentStep);
          }, 2000);
          return;
        }

        console.log('✅ Tour: On trends tab, looking for generate button');

        // Look for ANY purple gradient button with generate content text
        const allButtons = document.querySelectorAll('button');
        let targetButton: Element | null = null;

        for (const btn of allButtons) {
          const text = btn.textContent || '';
          const hasGradient = btn.className.includes('from-purple-600') ||
                             btn.className.includes('bg-gradient-to-r');

          // Look for button with lightning and generate content text
          if (text.includes('⚡') && text.includes('Generate Content') && hasGradient) {
            targetButton = btn;
            console.log('✅ Tour: Found target generate button:', text);
            console.log('✅ Tour: Button classes:', btn.className);
            break;
          }
        }

        if (!targetButton) {
          console.log('⏳ Tour: Generate Content button not found yet, waiting for trends...');
          // Set up a watcher to wait for the button to appear
          const checkForButton = () => {
            const retryButtons = document.querySelectorAll('button');
            for (const btn of retryButtons) {
              const text = btn.textContent || '';
              const hasGradient = btn.className.includes('from-purple-600') ||
                                 btn.className.includes('bg-gradient-to-r');

              if (text.includes('⚡') && text.includes('Generate Content') && hasGradient) {
                console.log('🎉 Tour: Generate button appeared! Continuing step 3');
                clearInterval(buttonWatcher);
                updateStep(currentStep);
                return;
              }
            }
          };

          const buttonWatcher = setInterval(checkForButton, 1000);

          // Stop watching after 30 seconds
          setTimeout(() => {
            clearInterval(buttonWatcher);
          }, 30000);

          return;
        }

        // Button found, continue with normal step logic
        console.log('🎯 Tour: Ready to highlight generate button');
      }

      // Try to find element with retry logic
      let element = findElement(step.element);

      // For tab-switching steps, wait longer for content to load
      const isTabStep = step.action === "click-tab";
      const retryDelay = isTabStep ? 800 : 300;

      // If element not found, try again after a delay
      if (!element && step.element !== "body") {
        console.log(
          `🔍 Tour: Element not found immediately, retrying in ${retryDelay}ms: ${step.element}`,
        );
        setTimeout(() => {
          element = findElement(step.element);
          if (element) {
            console.log(`✅ Tour: Found element on retry: ${step.element}`);
            setHighlightedElement(element);
            highlightElement(element, step.id);
            // Force bottom position for generate content step
            const tooltipPos = step.id === "generate-trend-content" ? "bottom" : step.position;
            const position = calculateTooltipPosition(element, tooltipPos);
            setTooltipPosition(position);
          } else {
            // Still not found, center the tooltip but continue the tour
            console.warn(
              `⚠️ Tour: Element still not found after retry: ${step.element}. Centering tooltip.`,
            );
            setHighlightedElement(null);
            setTooltipPosition({
              x: window.innerWidth / 2 - 160,
              y: window.innerHeight / 2 - 100,
            });
          }
        }, retryDelay);

        // Show centered tooltip immediately while we wait
        setHighlightedElement(null);
        setTooltipPosition({
          x: window.innerWidth / 2 - 160,
          y: window.innerHeight / 2 - 100,
        });
        return;
      }

      if (element) {
        console.log(`✅ Tour: Found element immediately: ${step.element}`);
        setHighlightedElement(element);
        highlightElement(element, step.id);
        // Force bottom position for generate content step
        const tooltipPos = step.id === "generate-trend-content" ? "bottom" : step.position;
        const position = calculateTooltipPosition(element, tooltipPos);
        setTooltipPosition(position);
      } else {
        // Center position for body or when element not found
        console.log(`���� Tour: Centering tooltip for step: ${step.title}`);
        setHighlightedElement(null);
        setTooltipPosition({
          x: window.innerWidth / 2 - 160,
          y: window.innerHeight / 2 - 100,
        });
      }
    } catch (error) {
      console.error('🚨 Tour: Error in updateStep:', error);
      // Center tooltip as fallback
      setTooltipPosition({
        x: window.innerWidth / 2 - 160,
        y: window.innerHeight / 2 - 100,
      });
    }
  };

  const handleTabSwitch = (step: TourStep) => {
    // Handle special actions
    if (step.action === "navigate-to-trends") {
      // Navigate to trends tab
      const selectors = [
        `button[data-tab='trends']`,
        `[data-tour='trends-tab']`,
      ];

      let tabButton: HTMLButtonElement | null = null;

      // Try specific selectors first
      for (const selector of selectors) {
        try {
          const btn = document.querySelector(selector) as HTMLButtonElement;
          if (btn) {
            tabButton = btn;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // Fallback: find button by text content
      if (!tabButton) {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.toLowerCase().includes('trends')) {
            tabButton = btn as HTMLButtonElement;
            break;
          }
        }
      }

      if (tabButton) {
        console.log(`🎯 Tour: Switching to trends tab`);
        tabButton.click();
        console.log(`✅ Tour: Tab switched to trends`);

        // Wait a bit for the tab to load, then continue with the step
        setTimeout(() => {
          // Force update the step after tab switch
          const step = tourSteps[currentStep];
          if (step) {
            const element = findElement(step.element);
            if (element) {
              console.log(`✅ Tour: Found search input after tab switch`);
              setHighlightedElement(element);
              highlightElement(element, step.id);
              const position = calculateTooltipPosition(element, step.position);
              setTooltipPosition(position);
            } else {
              console.warn(`⚠️ Tour: Search input still not found after tab switch`);
              // Center tooltip as fallback
              setTooltipPosition({
                x: window.innerWidth / 2 - 160,
                y: window.innerHeight / 2 - 100,
              });
            }
          }
        }, 1000);
      } else {
        console.warn(`⚠️ Tour: Could not find trends tab button`);
      }
      return;
    }

    if (step.action === "wait-for-trends") {
      // This step waits for trend cards to be generated
      // No immediate action needed, the step will wait for the generate button to appear
      console.log(`🕰️ Tour: Waiting for trends to be generated...`);
      return;
    }

    if (step.action === "navigate-to-generator") {
      // The user should click the generate button which will take them to generator tab
      // We'll complete the tour when this happens
      console.log(`🎯 Tour: User should click generate button to go to generator`);

      // Set up a click listener on the generate button to complete tour
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent?.includes('Generate Content for This Trend')) {
          const clickHandler = () => {
            setTimeout(() => {
              console.log('🎉 Tour: Generate button clicked, completing tour!');
              handleComplete();
            }, 500); // Small delay to let navigation happen
            btn.removeEventListener('click', clickHandler);
          };
          btn.addEventListener('click', clickHandler);
          break;
        }
      }
      return;
    }

    // Legacy tab switching (if needed for future steps)
    let tabToActivate = "";

    switch (step.id) {
      case "trends-tab":
        tabToActivate = "trends";
        break;
    }

    if (tabToActivate) {
      const selectors = [
        `button[data-tab='${tabToActivate}']`,
        `[data-tour='${step.id}']`,
      ];

      let tabButton: HTMLButtonElement | null = null;

      for (const selector of selectors) {
        const btn = document.querySelector(selector) as HTMLButtonElement;
        if (btn) {
          tabButton = btn;
          break;
        }
      }

      if (tabButton) {
        console.log(`🎯 Tour: Switching to ${tabToActivate} tab`);
        tabButton.click();
        console.log(`✅ Tour: Tab switched to ${tabToActivate}`);
      } else {
        console.warn(`⚠️ Tour: Could not find tab button for ${tabToActivate}`);
        setTooltipPosition({
          x: window.innerWidth / 2 - 160,
          y: window.innerHeight / 2 - 100,
        });
      }
    }
  };

  useEffect(() => {
    console.log(
      `🔄 Tour: useEffect triggered. isActive: ${isActive}, currentStep: ${currentStep}, totalSteps: ${tourSteps.length}`,
    );

    // Reset trends generated state when tour starts
    if (isActive && currentStep === 0) {
      setTrendsGenerated(false);
      setWaitingForTrends(false);
    }

    if (isActive && currentStep < tourSteps.length) {
      updateStep(currentStep);
    } else if (isActive && currentStep >= tourSteps.length) {
      console.warn(
        `⚠️ Tour: Step index ${currentStep} exceeds tour steps length ${tourSteps.length}`,
      );
      handleComplete();
    }
  }, [currentStep, isActive]);

  // Watch for trends being generated to auto-advance to step 3
  useEffect(() => {
    if (!isActive || currentStep !== 1 || !waitingForTrends) return;

    const checkForTrendCards = () => {
      // Look for trend cards or generate buttons that indicate trends were generated
      try {
        // First, check if generate button exists by text content
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const text = btn.textContent || '';
          if (text.includes('Generate Content for This Trend') || (text.includes('Generate Content') && text.includes('⚡'))) {
            console.log('🎉 Tour: Trends detected! Setting trends generated state');
            setWaitingForTrends(false);
            setTrendsGenerated(true);
            return;
          }
        }

        // Fallback: check for trend-related elements
        const trendIndicators = [
          '.trend-card',
          '.bg-gradient-to-br',
          '[class*="trend"]',
          'button[class*="from-purple-600"]',
        ];

        for (const selector of trendIndicators) {
          try {
            const element = document.querySelector(selector);
            if (element) {
              // Double-check for generate button text in the area
              const parentContainer = element.closest('div, section') || element;
              const buttonsInContainer = parentContainer.querySelectorAll('button');
              for (const btn of buttonsInContainer) {
                if (btn.textContent?.includes('Generate Content')) {
                  console.log('🎉 Tour: Trends detected via container! Setting trends generated state');
                  setWaitingForTrends(false);
                  setTrendsGenerated(true);
                  return;
                }
              }
            }
          } catch (selectorError) {
            console.warn(`⚠️ Tour: Invalid selector: ${selector}`, selectorError);
            continue;
          }
        }
      } catch (error) {
        console.error('🚨 Tour: Error in checkForTrendCards:', error);
      }
    };

    // Check immediately and then periodically
    checkForTrendCards();
    const interval = setInterval(checkForTrendCards, 1000);

    // Cleanup after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setWaitingForTrends(false);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, currentStep, waitingForTrends]);

  useEffect(() => {
    // Add tour styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .tour-highlight {
        position: relative;
        z-index: 1001 !important;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 8px rgba(99, 102, 241, 0.2) !important;
        border-radius: 8px !important;
        animation: tour-pulse 2s infinite;
      }

      .tour-blue-highlight {
        position: relative !important;
        z-index: 1003 !important;
        border-radius: 8px !important;
      }

      .tour-generate-highlight {
        position: relative !important;
        z-index: 1003 !important;
        animation: tour-generate-pulse 2s infinite !important;
      }

      .tour-blue-overlay {
        pointer-events: none !important;
      }

      @keyframes tour-pulse {
        0%, 100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 8px rgba(99, 102, 241, 0.2); }
        50% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.8), 0 0 0 8px rgba(99, 102, 241, 0.4); }
      }

      @keyframes tour-blue-pulse {
        0%, 100% {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.5);
          border-color: #3B82F6;
        }
        50% {
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.8);
          border-color: #1D4ED8;
        }
      }

      @keyframes tour-generate-pulse {
        0%, 100% {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.7), 0 0 50px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.2);
          outline: 4px solid rgba(139, 92, 246, 0.9);
          transform: scale(1.08);
          filter: brightness(1.1) saturate(1.2);
        }
        50% {
          box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.9), 0 0 60px rgba(139, 92, 246, 0.6), inset 0 0 25px rgba(139, 92, 246, 0.3);
          outline: 5px solid rgba(139, 92, 246, 1);
          transform: scale(1.12);
          filter: brightness(1.2) saturate(1.3);
        }
      }

      @keyframes tour-overlay-pulse {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.05);
        }
      }

      .tour-overlay {
        pointer-events: none;
      }

      .tour-overlay .tour-tooltip {
        pointer-events: auto;
      }

      .tour-overlay-with-spotlight {
        background: transparent !important;
        pointer-events: none;
      }

      .tour-spotlight-overlay {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
      // Clean up highlights
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
      });
    };
  }, []);

  const handleNext = () => {
    try {
      // Check if we're still in the main app before advancing
      const isInMainApp = document.querySelector(
        '[data-tour="main-navigation"], nav, .main-tab-navigation',
      );
      if (!isInMainApp) {
        console.warn("⚠️ Tour: Not in main app during next, skipping tour");
        onSkip();
        return;
      }

      console.log(
        `🟢 Tour: handleNext called. Current step: ${currentStep}, Total steps: ${tourSteps.length}`,
      );
      if (currentStep < tourSteps.length - 1) {
        const nextStep = currentStep + 1;
        console.log(
          `🟢 Tour: Moving from step ${currentStep + 1} to step ${nextStep + 1}`,
        );

        // If moving from step 2 to step 3, ensure trends are generated
        if (currentStep === 1 && nextStep === 2) {
          if (!trendsGenerated) {
            console.log('⚠️ Tour: Cannot advance to step 3 - trends not generated yet');
            return;
          }
          console.log('🎉 Tour: Advancing to step 3 - generate content step');

          // Add small delay to ensure DOM is ready for step 3
          setTimeout(() => {
            const step3 = tourSteps[2];
            if (step3) {
              const generateButton = findElement(step3.element);
              if (generateButton) {
                console.log('✅ Tour: Found generate button for step 3, positioning tooltip');
                setHighlightedElement(generateButton);
                highlightElement(generateButton, step3.id);
                // Force bottom position for step 3
                const position = calculateTooltipPosition(generateButton, "bottom");
                setTooltipPosition(position);
              } else {
                console.warn('⚠️ Tour: Generate button not found for step 3, checking if we need to go to trends tab');
                // If no generate button found, maybe we need to switch to trends tab first
                const trendsTabButton = document.querySelector('button[data-tab="trends"]');
                if (trendsTabButton) {
                  console.log('🔄 Tour: Switching to trends tab for step 3');
                  (trendsTabButton as HTMLElement).click();
                  // Wait for trends tab to load, then retry
                  setTimeout(() => {
                    const retryButton = findElement(step3.element);
                    if (retryButton) {
                      setHighlightedElement(retryButton);
                      highlightElement(retryButton, step3.id);
                      // Force bottom position for step 3
                      const retryPosition = calculateTooltipPosition(retryButton, "bottom");
                      setTooltipPosition(retryPosition);
                    }
                  }, 800);
                }
              }
            }
          }, 300);
        }

        setCurrentStep(nextStep);
      } else {
        console.log("🏁 Tour: Completing tour - reached final step");
        handleComplete();
      }
    } catch (error) {
      console.error("⚠️ Tour: Error in handleNext", error);
      handleComplete();
    }
  };

  const handlePrev = () => {
    try {
      if (currentStep > 0) {
        console.log(`🟡 Tour: Moving to step ${currentStep}`);
        setCurrentStep((prev) => prev - 1);
      }
    } catch (error) {
      console.error("���️ Tour: Error in handlePrev", error);
    }
  };

  const cleanupTourEffects = () => {
    // Clean up highlights and spotlight
    document.querySelectorAll(".tour-highlight, .tour-spotlight, .tour-blue-highlight, .tour-generate-highlight").forEach((el) => {
      el.classList.remove("tour-highlight", "tour-spotlight", "tour-blue-highlight", "tour-generate-highlight");
      // Reset inline styles
      (el as HTMLElement).style.pointerEvents = '';
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
      (el as HTMLElement).style.boxShadow = '';
      (el as HTMLElement).style.transform = '';
      (el as HTMLElement).style.transition = '';
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
      (el as HTMLElement).style.borderRadius = '';
      (el as HTMLElement).style.filter = '';

      // Remove any button overlays
      const overlay = el.querySelector('.tour-button-overlay');
      if (overlay) {
        overlay.remove();
      }
    });

    // Remove overlays
    const spotlightOverlay = document.querySelector('.tour-spotlight-overlay');
    if (spotlightOverlay) {
      spotlightOverlay.remove();
    }

    const blueOverlay = document.querySelector('#tour-search-overlay');
    if (blueOverlay) {
      // Remove event listeners if they exist
      const updatePosition = (blueOverlay as any).updatePosition;
      if (updatePosition) {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      }
      blueOverlay.remove();
    }

    // Remove dimming overlay for step 3
    const dimmingOverlay = document.querySelector('#tour-step3-dimming');
    if (dimmingOverlay) {
      dimmingOverlay.remove();
    }

    // Mark onboarding as completed - NEVER show blue overlay again
    localStorage.setItem('creategen-onboarding-completed', 'true');
    console.log('🎉 Onboarding completed - blue overlay will never appear again');

    // Reset all pointer events
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.pointerEvents = '';
      (el as HTMLElement).style.position = '';
      (el as HTMLElement).style.zIndex = '';
    });
  };

  const handleComplete = () => {
    cleanupTourEffects();
    onComplete();
  };

  const handleSkip = () => {
    cleanupTourEffects();
    onSkip();
  };

  if (!isActive) return null;

  // Check if we're in the main app before showing tour
  const isInMainApp = document.querySelector(
    '[data-tour="main-navigation"], nav, .main-tab-navigation',
  );
  if (!isInMainApp) {
    console.warn("⚠️ Tour: Not in main app, cancelling tour");
    onSkip();
    return null;
  }

  const currentTourStep = tourSteps[currentStep];
  if (!currentTourStep) {
    console.error("⚠️ Tour: Invalid step index", currentStep);
    onComplete();
    return null;
  }

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const isSpotlightStep = currentTourStep.id === "trends-tab";
  const isGenerateStep = currentTourStep.id === "generate-trend-content";

  return (
    <>
      {/* Overlay - transparent for spotlight and generate step, dark for others */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-1000 tour-overlay ${
          (isSpotlightStep || isGenerateStep) ? 'tour-overlay-with-spotlight' : 'bg-black/60'
        }`}
        style={{ zIndex: 1000 }}
      />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed tour-tooltip bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 1001,
          }}
        >
          {/* Progress Bar */}
          <div className="h-1 bg-slate-700 rounded-t-xl">
            <motion.div
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Header */}
          <div className="p-4 pb-2">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <LightBulbIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">
                    Step {currentStep + 1} of {tourSteps.length}
                  </div>
                  <h3 className="text-white font-semibold text-sm">
                    {currentTourStep?.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {currentTourStep?.description}
            </p>
          </div>

          {/* Optional Badge */}
          {currentTourStep?.optional && (
            <div className="px-4 pb-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                <SparklesIcon className="h-3 w-3" />
                Premium Feature
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-800/50 p-4 flex justify-between items-center rounded-b-xl">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
            >
              <ArrowUpIcon className="h-3 w-3" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Skip tour
              </button>

              {/* Only show Next button if not step 2, or if step 2 and trends are generated */}
              {(currentStep !== 1 || trendsGenerated) && (
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-1"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircleIcon className="h-3 w-3" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <RightArrowIcon className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}

              {/* Show waiting message for step 2 when trends not generated */}
              {currentStep === 1 && !trendsGenerated && (
                <div className="text-slate-400 text-sm italic flex items-center gap-1">
                  <span className="animate-spin">⏳</span>
                  <span>Search for trends first...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ProductTour;
