import React, { useEffect } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import CleanOnboarding from "./CleanOnboarding";
import ProductTour from "./ProductTour";

interface OnboardingManagerProps {
  children: React.ReactNode;
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({
  children,
}) => {
  const {
    needsOnboarding,
    showWelcome,
    showTour,
    loading,
    completeWelcome,
    completeTour,
    skipOnboarding,
  } = useOnboarding();

  // Add tour data attributes to key elements when tour is active
  useEffect(() => {
    if (showTour) {
      // Check if we're in the main app (not on landing page)
      const isInMainApp = document.querySelector(
        '[data-tour="main-navigation"], nav, .main-tab-navigation',
      );

      if (!isInMainApp) {
        console.warn("⚠️ Tour: Not in main app, delaying tour start");
        // Retry after a delay
        const retryTimer = setTimeout(() => {
          const retryCheck = document.querySelector(
            '[data-tour="main-navigation"], nav, .main-tab-navigation',
          );
          if (retryCheck) {
            console.log("🎯 Tour: Main app detected, starting tour");
            addTourAttributes();
          } else {
            console.log("🚨 Tour: Still not in main app, skipping tour");
            skipOnboarding();
          }
        }, 2000);

        return () => clearTimeout(retryTimer);
      }

      const addTourAttributes = () => {
        // Add data-tour attributes to key elements
        const elements = [
          {
            selector: '.platform-selector, [role="listbox"]:has(option)',
            attr: "platform-selector",
          },
          {
            selector:
              '.content-type-selector, select[name*="content"], select[name*="type"]',
            attr: "content-type",
          },
          {
            selector:
              'textarea[placeholder*="content"], textarea[placeholder*="idea"], .smart-input',
            attr: "input-area",
          },
          {
            selector: '.ai-persona-selector, [data-testid="persona-selector"]',
            attr: "ai-personas",
          },
          {
            selector: 'button[type="submit"], .generate-button',
            attr: "generate-button",
          },
          {
            selector:
              '.results-container, .generated-content, [data-testid="results"]',
            attr: "results-area",
          },
          {
            selector: '.credits-display, [data-testid="credits"]',
            attr: "credits-display",
          },
        ];

        elements.forEach(({ selector, attr }) => {
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute("data-tour", attr);
          }
        });

        // Fallback: Add attributes to commonly named elements
        setTimeout(() => {
          // Platform selector fallbacks
          const platformSelectors = document.querySelectorAll(
            'select, [role="combobox"], .dropdown',
          );
          platformSelectors.forEach((el, index) => {
            if (index === 0 && !el.hasAttribute("data-tour")) {
              el.setAttribute("data-tour", "platform-selector");
            }
          });

          // Content type selector fallbacks
          const contentSelectors = document.querySelectorAll("select");
          contentSelectors.forEach((el, index) => {
            if (index === 1 && !el.hasAttribute("data-tour")) {
              el.setAttribute("data-tour", "content-type");
            }
          });

          // Input area fallbacks
          const textareas = document.querySelectorAll("textarea");
          textareas.forEach((el, index) => {
            if (index === 0 && !el.hasAttribute("data-tour")) {
              el.setAttribute("data-tour", "input-area");
            }
          });

          // Generate button fallbacks
          const buttons = document.querySelectorAll(
            'button[type="submit"], button',
          );
          buttons.forEach((el) => {
            const text = el.textContent?.toLowerCase() || "";
            if (
              (text.includes("generate") || text.includes("create")) &&
              !el.hasAttribute("data-tour")
            ) {
              el.setAttribute("data-tour", "generate-button");
            }
          });

          // Results area fallbacks
          const resultsContainers = document.querySelectorAll(
            '[class*="result"], [class*="output"], [class*="generated"]',
          );
          resultsContainers.forEach((el, index) => {
            if (index === 0 && !el.hasAttribute("data-tour")) {
              el.setAttribute("data-tour", "results-area");
            }
          });

          // Credits display fallbacks
          const creditElements = document.querySelectorAll(
            '[class*="credit"], [class*="balance"]',
          );
          creditElements.forEach((el, index) => {
            if (index === 0 && !el.hasAttribute("data-tour")) {
              el.setAttribute("data-tour", "credits-display");
            }
          });
        }, 1000);
      };

      // Add attributes immediately and after DOM changes
      addTourAttributes();

      // Watch for DOM changes and re-add attributes
      const observer = new MutationObserver(() => {
        addTourAttributes();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      return () => {
        observer.disconnect();
        // Clean up tour attributes
        document.querySelectorAll("[data-tour]").forEach((el) => {
          el.removeAttribute("data-tour");
        });
      };
    }
  }, [showTour]);

  // Removed loading screen for smooth premium experience
  // Onboarding state is handled gracefully without blocking UI

  return (
    <>
      {children}

      {/* Clean Onboarding Welcome Flow */}
      {showWelcome && (
        <CleanOnboarding onComplete={completeWelcome} onSkip={skipOnboarding} />
      )}

      {/* Interactive Product Tour */}
      {showTour && (
        <ProductTour
          isActive={showTour}
          onComplete={completeTour}
          onSkip={skipOnboarding}
        />
      )}
    </>
  );
};

export default OnboardingManager;
