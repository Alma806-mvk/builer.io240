// Runtime emoji fixer - replaces corrupted emoji characters on page load

const corruptedEmojiMap: Record<string, string> = {
  // Most common corrupted patterns found in the app
  '◆◆◆': '✨',
  '◆': '💎',
  '���': '🔍',
  '������': '⚠️',
  '�������': '⚠️⚠️⚠️',
  '����': '💻',
  '���': '🌈',
  '����': '⚫',
  '���': '🟡',
  '����': '🔵',
  '�����': '🟢',
  '���': '🟣',
  '������': '🐛',
  '��': '⭐',
  '����': '🎯',
  '������': '🚀',
  '����': '⚡',
  '������': '🧠',
  '����': '🔥',
  '���': '📊',
  '����': '🎨',
  '���': '🌐',
  '���': '📅',
  '����': '💳',
  '����': '📱',
  '���': '💰',
  '����': '���',
  '������': '🌟',
  '���': '🔮',
  '����': '💎',
  '���������': '🎯',
  '������������': '👥',
  '���������': '📊',
  '������': '📅',
  '��������': '📈',
  '���������': '📋',
  '����': '🔧',
  '������': '❤️',
  '����': '💚',
  '�����': '💜',
  '���️': '☁️',
  '������': '🎪',
  '����': '🎨',
  '�������': '🎊',
  '�����': '🎉',
  '���': '📝',
  '����': '🔒',
  '������': '🔑',
  '���': '🔗',
  '����': '🎤',
  '������': '📷',
  '�����': '🎬',
  '������': '🎥',
  '����': '📹',
  '������': '📺',
  '�����': '📻',
  '������': '🎵',
  '����': '🎶',
  '������': '🎸',
  '�����': '🥁',
  '�������': '🎹',
  '����': '🎺',
  '������': '🎻',
  '�����': '🎼',
  '������': '🎬',
  '���': '⬇️',
  '����': '📤',
  '�������': '📤',
  '������': '💻',
  '������': '👨‍💻',
  '������': '👩‍💻',
  '���������': '👨‍💼',
  '���������': '👩‍💼',
  '����': '👑',
  '������': '🎭',
  '�����': '🎪'
};

// Function to fix emoji in text content
function fixEmojiInText(text: string): string {
  let fixedText = text;
  
  // Replace all corrupted patterns
  for (const [corrupted, fixed] of Object.entries(corruptedEmojiMap)) {
    fixedText = fixedText.replace(new RegExp(corrupted, 'g'), fixed);
  }
  
  return fixedText;
}

// Function to fix emojis in DOM elements
function fixEmojisInDOM() {
  // First, immediately fix any visible running person emojis that shouldn't be there
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (element.textContent?.includes('🏃')) {
      // Check context to determine correct replacement
      const parent = element.parentElement;
      const text = element.textContent || '';

      // If it's in export/download context, replace with download arrow
      if (parent && (
        parent.textContent?.toLowerCase().includes('export') ||
        parent.textContent?.toLowerCase().includes('download') ||
        parent.textContent?.toLowerCase().includes('1-click')
      )) {
        element.textContent = text.replace(/🏃/g, '📤');
      }
      // If it's repeated (🏃🏃), it's likely corrupted export symbols
      else if (text.includes('🏃🏃')) {
        element.textContent = text.replace(/🏃+/g, '📤');
      }
    }
  });
  // Get all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes: Text[] = [];
  let node: Node | null;

  // Collect all text nodes
  while (node = walker.nextNode()) {
    textNodes.push(node as Text);
  }

  // Fix emojis in each text node
  textNodes.forEach(textNode => {
    const originalText = textNode.textContent || '';
    const fixedText = fixEmojiInText(originalText);
    
    if (fixedText !== originalText) {
      textNode.textContent = fixedText;
    }
  });

  // Fix emojis in element attributes (like data-* attributes, aria-labels, etc.)
  const allElementsForAttributes = document.querySelectorAll('*');
  allElementsForAttributes.forEach(element => {
    // Fix common attributes that might contain emojis
    const attributesToCheck = ['aria-label', 'title', 'data-tooltip', 'placeholder'];
    
    attributesToCheck.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        const fixedValue = fixEmojiInText(value);
        if (fixedValue !== value) {
          element.setAttribute(attr, fixedValue);
        }
      }
    });
  });

  console.log('✅ Runtime emoji fix completed');
}

// Function to observe for dynamically added content
function observeForNewContent() {
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            const fixedText = fixEmojiInText(text);
            if (fixedText !== text) {
              node.textContent = fixedText;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added element contains corrupted emojis
            const element = node as Element;
            const textContent = element.textContent || '';
            if (Object.keys(corruptedEmojiMap).some(corrupted => textContent.includes(corrupted))) {
              shouldFix = true;
            }
          }
        });
      }
    });
    
    if (shouldFix) {
      // Small delay to ensure DOM is stable
      setTimeout(fixEmojisInDOM, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize the emoji fixer
export function initializeEmojiRuntimeFixer() {
  // Fix emojis immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixEmojisInDOM();
      fixRunningPersonEmojis(); // Immediate fix for running person emojis
      observeForNewContent();
    });
  } else {
    fixEmojisInDOM();
    fixRunningPersonEmojis(); // Immediate fix for running person emojis
    observeForNewContent();
  }

  // Also fix emojis periodically (fallback)
  setInterval(fixEmojisInDOM, 5000);
  
  console.log('🚀 Emoji runtime fixer initialized');
}

// Make it available globally for debugging
(window as any).fixEmojisInDOM = fixEmojisInDOM;
(window as any).fixEmojiInText = fixEmojiInText;

// Function to immediately fix running person emojis
function fixRunningPersonEmojis() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes: Text[] = [];
  let node: Node | null;

  while (node = walker.nextNode()) {
    const textNode = node as Text;
    const text = textNode.textContent || '';

    if (text.includes('🏃')) {
      // Replace running person with appropriate emoji based on context
      let newText = text;

      // Check parent context
      const parent = textNode.parentElement;
      if (parent) {
        const parentText = parent.textContent?.toLowerCase() || '';

        if (parentText.includes('export') || parentText.includes('download') || parentText.includes('1-click')) {
          newText = text.replace(/🏃+/g, '📤');
        } else if (parentText.includes('assistant') || parentText.includes('ai')) {
          newText = text.replace(/🏃+/g, '✨');
        } else {
          // Default replacement for unknown context
          newText = text.replace(/🏃+/g, '⚡');
        }

        if (newText !== text) {
          textNode.textContent = newText;
        }
      }
    }
  }

  console.log('🔧 Fixed running person emojis');
}

// Make it globally available
(window as any).fixRunningPersonEmojis = fixRunningPersonEmojis;

export { fixEmojiInText, fixEmojisInDOM, fixRunningPersonEmojis };
