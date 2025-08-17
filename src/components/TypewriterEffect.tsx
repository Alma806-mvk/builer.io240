import React, { useState, useEffect, useRef } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  onTypeStart?: () => void;
  className?: string;
  cursor?: boolean;
  delay?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 120, // Characters per second (increased from 50 to 120)
  onComplete,
  onTypeStart,
  className = '',
  cursor = true,
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(cursor);
  const currentIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Calculate delay between characters based on speed
  const charDelay = 1000 / speed;

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIsTyping(false);
    setShowCursor(cursor);
    currentIndex.current = 0;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start typing after initial delay
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
      onTypeStart?.();
      typeNextCharacter();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay]);

  const typeNextCharacter = () => {
    if (currentIndex.current < text.length) {
      const nextChar = text[currentIndex.current];
      
      setDisplayedText(prev => prev + nextChar);
      currentIndex.current++;

      // Variable speed based on character type
      let nextDelay = charDelay;
      
      // Faster for spaces, slower for punctuation
      if (nextChar === ' ') {
        nextDelay = charDelay * 0.3;
      } else if (['.', '!', '?'].includes(nextChar)) {
        nextDelay = charDelay * 2;
      } else if ([',', ';', ':'].includes(nextChar)) {
        nextDelay = charDelay * 1.5;
      } else if (nextChar === '\n') {
        nextDelay = charDelay * 2;
      }

      timeoutRef.current = setTimeout(typeNextCharacter, nextDelay);
    } else {
      // Typing complete
      setIsTyping(false);
      setShowCursor(false);
      onComplete?.();
    }
  };

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;

    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [isTyping]);

  // Parse text for markdown-like formatting
  const parseFormattedText = (text: string) => {
    const parts = [];
    let currentText = text;
    let key = 0;

    // Handle **bold** text
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      return `<strong key="${key++}">${content}</strong>`;
    });

    // Handle *italic* text
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      return `<em key="${key++}">${content}</em>`;
    });

    // Handle `code` text
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      return `<code key="${key++}" className="bg-slate-700 px-1 py-0.5 rounded text-cyan-300">${content}</code>`;
    });

    return { __html: currentText };
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={parseFormattedText(displayedText)}
      />
      {(isTyping || showCursor) && (
        <span
          className={`inline-block w-2 h-5 bg-cyan-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ${!isTyping ? 'animate-pulse' : ''}`}
        />
      )}
    </div>
  );
};

export default TypewriterEffect;
