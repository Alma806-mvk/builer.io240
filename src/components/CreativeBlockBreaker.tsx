import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  Shuffle,
  Timer,
  Target,
  Palette,
  Brain,
  Zap,
  RefreshCw,
  Save,
  Send,
  Flame,
  Heart,
  Coffee,
  Rocket,
  Star,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { Card, Button, GradientText } from './ui/WorldClassComponents';

interface CreativeBlock {
  id: string;
  idea: string;
  components: {
    trending: string;
    perspective: string;
    format: string;
  };
  timestamp: Date;
}

interface Mood {
  emoji: string;
  label: string;
  color: string;
  prompts: string[];
}

interface CreativeBlockBreakerProps {
  onNavigateToTab?: (tab: string) => void;
  onSendToGenerator?: (idea: string) => void;
}

const CreativeBlockBreaker: React.FC<CreativeBlockBreakerProps> = ({
  onNavigateToTab,
  onSendToGenerator
}) => {
  const [activeMode, setActiveMode] = useState<'mood' | 'generator' | 'brainstorm' | 'challenge' | 'whatif' | 'visual'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [currentIdea, setCurrentIdea] = useState<CreativeBlock | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<CreativeBlock[]>([]);
  const [brainstormInput, setBrainstormInput] = useState('');
  const [brainstormHistory, setBrainstormHistory] = useState<Array<{isUser: boolean, text: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [challengeTimer, setChallengeTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [challengeIdeas, setChallengeIdeas] = useState<string[]>([]);

  const moods: Mood[] = [
    {
      emoji: '😤',
      label: 'Frustrated',
      color: 'from-red-500/20 to-orange-500/20 border-red-500/20',
      prompts: [
        'Turn that frustration into "Things That Annoy Me About [Your Niche]"',
        'Create "Why Everyone Gets [Topic] Wrong" content',
        'Make a "Brutally Honest Review of [Popular Thing]" video'
      ]
    },
    {
      emoji: '😴',
      label: 'Tired',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20',
      prompts: [
        'Low-energy content: "Lazy Day [Your Topic] Tips"',
        'Create while lying down: "Productivity Tips from Bed"',
        'Make "5-Minute [Topic] Solutions" for other tired people'
      ]
    },
    {
      emoji: '🤔',
      label: 'Overthinking',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
      prompts: [
        'Stream-of-consciousness content about your thoughts',
        'Create "Overthinking [Topic]: A Deep Dive"',
        'Make "Random Thoughts About [Your Niche]" content'
      ]
    },
    {
      emoji: '😊',
      label: 'Happy',
      color: 'from-green-500/20 to-teal-500/20 border-green-500/20',
      prompts: [
        'Spread joy with "Feel-Good [Topic] Stories"',
        'Create uplifting "[Topic] Wins This Week"',
        'Make "Why [Your Niche] Makes Me Happy" content'
      ]
    },
    {
      emoji: '🔥',
      label: 'Energetic',
      color: 'from-orange-500/20 to-red-500/20 border-orange-500/20',
      prompts: [
        'High-energy "[Topic] Challenge" content',
        'Create "30-Day [Your Niche] Transformation"',
        'Make "Get Pumped About [Topic]" motivational content'
      ]
    },
    {
      emoji: '😐',
      label: 'Neutral',
      color: 'from-slate-500/20 to-gray-500/20 border-slate-500/20',
      prompts: [
        'Create balanced "Pros and Cons of [Topic]"',
        'Make objective "[Topic] Explained Simply"',
        'Do a calm "[Topic] Q&A" session'
      ]
    }
  ];

  const trendingTopics = [
    'AI Tools', 'Productivity Hacks', 'Mental Health', 'Side Hustles', 'Sustainable Living',
    'Remote Work', 'Content Creation', 'Crypto/NFTs', 'Fitness Trends', 'Minimalism',
    'Social Media Strategy', 'Personal Finance', 'Skill Learning', 'Tech Reviews', 'Travel Tips'
  ];

  const perspectives = [
    'As a Complete Beginner', 'From a Pet\'s Perspective', 'Like a Time Traveler',
    'As Someone from the Future', 'Through a Child\'s Eyes', 'Like a Detective',
    'As an Alien Observer', 'From the Opposite Gender', 'As a 90-Year-Old',
    'Like a Robot Learning Emotions', 'As Someone Who Failed', 'From Another Planet'
  ];

  const formats = [
    'Text Message Screenshots', 'Song Parody', 'News Report Style',
    'Documentary Narration', 'Infomercial Parody', 'Breaking News',
    'Job Interview Format', 'Recipe Instructions', 'Sports Commentary',
    'Nature Documentary Style', 'Cooking Show Format', 'Game Show Concept'
  ];

  const whatIfScenarios = [
    'What if your niche existed in medieval times?',
    'What if your topic was explained to aliens?',
    'What if your content was a horror movie?',
    'What if you had to explain it using only emojis?',
    'What if your niche was a dating app?',
    'What if your topic was a board game?',
    'What if your content was set in space?',
    'What if you could only use questions?'
  ];

  const challenges = [
    '60-Second Idea Sprint: Generate 10 ideas in 60 seconds',
    'Opposite Day: Take your best content and flip everything',
    'Emoji Story: Create content using only emojis first',
    'Random Word Mix: Use 3 random words in your content',
    'One-Minute Explain: Explain complex topic in 60 seconds',
    'Constraint Challenge: Create content with specific limitations'
  ];

  const brainstormResponses = [
    "That's interesting! What if we took that angle and made it more personal?",
    "I love that direction! How could we make it more visual?",
    "Great start! What would happen if we flipped that completely?",
    "That has potential! Who would be the perfect audience for this?",
    "Nice! What's the most surprising thing about that topic?",
    "Cool idea! How could we make this go viral?",
    "That's solid! What problem does this solve for people?",
    "Interesting! What would the clickbait title be?",
    "Good thinking! How could we add some controversy to this?",
    "I like it! What's the emotion we want people to feel?"
  ];

  // Timer effect for challenges
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer((prev) => prev - 1);
      }, 1000);
    } else if (challengeTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, challengeTimer]);

  const generateRandomIdea = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const trending = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
      const perspective = perspectives[Math.floor(Math.random() * perspectives.length)];
      const format = formats[Math.floor(Math.random() * formats.length)];
      
      const newIdea: CreativeBlock = {
        id: Date.now().toString(),
        idea: `"${trending}" content ${perspective.toLowerCase()} using ${format.toLowerCase()}`,
        components: { trending, perspective, format },
        timestamp: new Date()
      };
      
      setCurrentIdea(newIdea);
      setIsGenerating(false);
    }, 1000);
  };

  const saveIdea = (idea: CreativeBlock) => {
    setSavedIdeas(prev => [idea, ...prev.slice(0, 4)]);
  };

  const sendToBrainstorm = (text: string) => {
    setBrainstormHistory(prev => [...prev, { isUser: true, text }]);
    setBrainstormInput('');
    
    setTimeout(() => {
      const response = brainstormResponses[Math.floor(Math.random() * brainstormResponses.length)];
      setBrainstormHistory(prev => [...prev, { isUser: false, text: response }]);
    }, 1000);
  };

  const startChallenge = () => {
    setChallengeTimer(60);
    setIsTimerRunning(true);
    setChallengeIdeas([]);
  };

  const addChallengeIdea = () => {
    const idea = `Quick idea #${challengeIdeas.length + 1}`;
    setChallengeIdeas(prev => [...prev, idea]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="heading-4">Creative Block Breaker</h3>
              <p className="text-sm text-[var(--text-secondary)]">Spark new ideas when you're stuck</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--surface-secondary)] rounded-lg">
          {[
            { key: 'mood', icon: Heart, label: 'Mood' },
            { key: 'generator', icon: Sparkles, label: 'Generate' },
            { key: 'brainstorm', icon: Lightbulb, label: 'Chat' },
            { key: 'challenge', icon: Timer, label: 'Challenge' },
            { key: 'whatif', icon: RefreshCw, label: 'What If' },
            { key: 'visual', icon: Palette, label: 'Visual' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveMode(key as any)}
              className={`p-2 rounded text-xs font-medium transition-all ${
                activeMode === key
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3 h-3 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeMode === 'mood' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <h4 className="text-sm font-medium text-[var(--text-primary)]">How are you feeling?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedMood === mood.label
                          ? `bg-gradient-to-r ${mood.color}`
                          : 'bg-[var(--surface-tertiary)] border-[var(--border-primary)] hover:bg-[var(--surface-quaternary)]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <h5 className="text-sm font-medium text-[var(--text-primary)]">
                      Perfect for your {selectedMood.toLowerCase()} mood:
                    </h5>
                    {moods.find(m => m.label === selectedMood)?.prompts.map((prompt, index) => (
                      <div key={index} className="p-2 bg-[var(--surface-tertiary)] rounded text-xs">
                        {prompt}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeMode === 'generator' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <Button 
                    onClick={generateRandomIdea}
                    disabled={isGenerating}
                    className="mx-auto"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-4 h-4 mr-2" />
                        Generate Random Idea
                      </>
                    )}
                  </Button>
                </div>

                {currentIdea && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"
                  >
                    <div className="space-y-2 mb-3">
                      <div className="text-xs text-[var(--text-secondary)]">
                        <span className="text-orange-400">🔥 TRENDING:</span> {currentIdea.components.trending}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        <span className="text-blue-400">👀 PERSPECTIVE:</span> {currentIdea.components.perspective}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        <span className="text-green-400">📱 FORMAT:</span> {currentIdea.components.format}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[var(--surface-secondary)] rounded-lg mb-3">
                      <div className="text-sm font-medium text-[var(--text-primary)] mb-1">💡 YOUR IDEA:</div>
                      <div className="text-sm text-[var(--text-secondary)]">{currentIdea.idea}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => saveIdea(currentIdea)}>
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={generateRandomIdea}>
                        <Shuffle className="w-3 h-3 mr-1" />
                        New
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => onSendToGenerator?.(currentIdea.idea)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeMode === 'brainstorm' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="h-40 bg-[var(--surface-secondary)] rounded-lg p-3 overflow-y-auto">
                  {brainstormHistory.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] text-xs mt-16">
                      Start brainstorming! Type your topic or challenge below.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {brainstormHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-2 rounded-lg text-xs ${
                              msg.isUser
                                ? 'bg-[var(--brand-primary)] text-white'
                                : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="What's your challenge or topic?"
                    value={brainstormInput}
                    onChange={(e) => setBrainstormInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && brainstormInput.trim() && sendToBrainstorm(brainstormInput.trim())}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => brainstormInput.trim() && sendToBrainstorm(brainstormInput.trim())}
                    disabled={!brainstormInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activeMode === 'challenge' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-primary)] mb-2">
                    {formatTime(challengeTimer)}
                  </div>
                  <Button onClick={startChallenge} disabled={isTimerRunning}>
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start 60s Sprint
                      </>
                    )}
                  </Button>
                </div>

                {isTimerRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quick Ideas:</span>
                      <Button size="sm" variant="ghost" onClick={addChallengeIdea}>
                        <Zap className="w-3 h-3 mr-1" />
                        Add Idea
                      </Button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {challengeIdeas.map((idea, index) => (
                        <div key={index} className="p-2 bg-[var(--surface-tertiary)] rounded text-xs">
                          {index + 1}. {idea}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="text-sm font-medium mb-2">Available Challenges:</h5>
                  <div className="space-y-1">
                    {challenges.map((challenge, index) => (
                      <div key={index} className="p-2 bg-[var(--surface-tertiary)] rounded text-xs">
                        {challenge}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 'whatif' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <h4 className="text-sm font-medium text-[var(--text-primary)]">Mind-Bending Scenarios:</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {whatIfScenarios.map((scenario, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer"
                      onClick={() => onSendToGenerator?.(scenario)}
                    >
                      <div className="text-sm text-[var(--text-primary)]">{scenario}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeMode === 'visual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-dashed border-blue-500/30">
                    <Palette className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm text-[var(--text-secondary)]">Visual inspiration coming soon!</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">Random images, color prompts, and mood boards</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved Ideas */}
        {savedIdeas.length > 0 && (
          <div className="border-t border-[var(--border-primary)] pt-3">
            <h5 className="text-sm font-medium mb-2 flex items-center">
              <Star className="w-3 h-3 mr-1 text-yellow-400" />
              Recent Sparks ({savedIdeas.length})
            </h5>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {savedIdeas.slice(0, 3).map((idea) => (
                <div key={idea.id} className="p-2 bg-[var(--surface-tertiary)] rounded text-xs truncate">
                  {idea.idea}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CreativeBlockBreaker;
