/**
 * Intelligent Troubleshooting System for CreateGen Studio
 * Comprehensive problem detection, diagnosis, and resolution guidance
 */

export interface TroubleshootingIssue {
  id: string;
  title: string;
  description: string;
  category: 'generation' | 'performance' | 'ui' | 'auth' | 'billing' | 'connectivity' | 'browser' | 'feature';
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  possibleCauses: string[];
  diagnosticQuestions: string[];
  solutions: TroubleshootingSolution[];
  preventionTips: string[];
  relatedIssues: string[];
}

export interface TroubleshootingSolution {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  estimatedTime: string;
  steps: Array<{
    step: number;
    action: string;
    details: string;
    expectedResult: string;
    troubleshootingTip?: string;
  }>;
  successCriteria: string[];
  fallbackOptions: string[];
}

export interface DiagnosticResult {
  issue: TroubleshootingIssue;
  confidence: number;
  recommendedSolution: TroubleshootingSolution;
  additionalContext: string;
}

// Common Troubleshooting Issues Database
export const TROUBLESHOOTING_DATABASE: TroubleshootingIssue[] = [
  {
    id: 'generation-slow',
    title: 'Content Generation Taking Too Long',
    description: 'AI content generation is slower than expected or appears stuck',
    category: 'generation',
    severity: 'medium',
    symptoms: [
      'Generation spinner shows for more than 2 minutes',
      'No response after clicking Generate button',
      'Loading indicator appears indefinitely',
      'Browser becomes unresponsive during generation'
    ],
    possibleCauses: [
      'High server demand during peak hours',
      'Complex batch generation request',
      'Network connectivity issues',
      'Browser performance limitations',
      'Account generation limits reached'
    ],
    diagnosticQuestions: [
      'How long has the generation been running?',
      'Are you generating multiple variations (batch)?',
      'What type of content are you generating?',
      'Is your internet connection stable?',
      'Have you reached your daily generation limit?'
    ],
    solutions: [
      {
        id: 'generation-slow-basic',
        title: 'Basic Generation Optimization',
        difficulty: 'easy',
        estimatedTime: '2-5 minutes',
        steps: [
          {
            step: 1,
            action: 'Check internet connection',
            details: 'Ensure you have a stable internet connection with good speed',
            expectedResult: 'Connection is stable and fast',
            troubleshootingTip: 'Try visiting other websites to test connectivity'
          },
          {
            step: 2,
            action: 'Refresh the page',
            details: 'Press Ctrl+R (Windows) or Cmd+R (Mac) to refresh',
            expectedResult: 'Page reloads and generation interface is responsive',
            troubleshootingTip: 'This clears any temporary issues with the generation process'
          },
          {
            step: 3,
            action: 'Simplify your request',
            details: 'Reduce batch variations from 15 to 3-5, use shorter prompts',
            expectedResult: 'Generation completes faster with simplified request',
            troubleshootingTip: 'Complex requests take longer to process'
          },
          {
            step: 4,
            action: 'Try different content type',
            details: 'Test with a simple title generation to verify system works',
            expectedResult: 'Simple generation works quickly',
            troubleshootingTip: 'This helps isolate if the issue is with specific content types'
          }
        ],
        successCriteria: [
          'Generation completes within 30-60 seconds',
          'Results appear without errors',
          'System remains responsive'
        ],
        fallbackOptions: [
          'Try generation during off-peak hours',
          'Contact support if issue persists',
          'Consider premium upgrade for priority processing'
        ]
      },
      {
        id: 'generation-slow-advanced',
        title: 'Advanced Generation Troubleshooting',
        difficulty: 'medium',
        estimatedTime: '5-10 minutes',
        steps: [
          {
            step: 1,
            action: 'Clear browser cache and cookies',
            details: 'Go to browser settings and clear browsing data for the last hour',
            expectedResult: 'Cache is cleared and browser feels more responsive',
            troubleshootingTip: 'Cached data can sometimes interfere with API calls'
          },
          {
            step: 2,
            action: 'Try incognito/private mode',
            details: 'Open a new incognito window and test generation',
            expectedResult: 'Generation works normally in incognito mode',
            troubleshootingTip: 'This bypasses extensions and cached data that might cause issues'
          },
          {
            step: 3,
            action: 'Disable browser extensions',
            details: 'Temporarily disable ad blockers and other extensions',
            expectedResult: 'Generation speed improves without extensions',
            troubleshootingTip: 'Some extensions can block or slow down API requests'
          },
          {
            step: 4,
            action: 'Check account limitations',
            details: 'Verify you haven\'t reached daily generation limits in account settings',
            expectedResult: 'Account shows available generations remaining',
            troubleshootingTip: 'Free accounts have daily limits that reset at midnight UTC'
          },
          {
            step: 5,
            action: 'Monitor network activity',
            details: 'Open browser developer tools (F12) and check network tab during generation',
            expectedResult: 'Network requests are completing successfully',
            troubleshootingTip: 'Look for failed requests or timeout errors'
          }
        ],
        successCriteria: [
          'Generation completes consistently',
          'No network errors in developer tools',
          'Account limits are not exceeded'
        ],
        fallbackOptions: [
          'Try different browser (Chrome, Firefox, Safari)',
          'Check firewall/antivirus settings',
          'Contact technical support with browser console logs'
        ]
      }
    ],
    preventionTips: [
      'Use premium account for priority processing',
      'Generate during off-peak hours (early morning, late evening)',
      'Keep prompts focused and specific',
      'Avoid excessive batch variations',
      'Maintain good internet connection'
    ],
    relatedIssues: ['generation-failed', 'browser-compatibility', 'account-limits']
  },
  
  {
    id: 'generation-failed',
    title: 'Content Generation Failed or Returned Errors',
    description: 'Generation process fails with error messages or produces no results',
    category: 'generation',
    severity: 'high',
    symptoms: [
      'Error message appears during generation',
      'Generation completes but shows no results',
      '"Something went wrong" error',
      'API error messages',
      'Generation button becomes unresponsive'
    ],
    possibleCauses: [
      'Invalid or inappropriate content request',
      'API service temporarily unavailable',
      'Account permissions or billing issues',
      'Content filters blocking request',
      'Server overload or maintenance'
    ],
    diagnosticQuestions: [
      'What error message exactly did you see?',
      'What type of content were you trying to generate?',
      'Did you use any specific keywords or phrases?',
      'Is your account in good standing?',
      'Are other features of the app working normally?'
    ],
    solutions: [
      {
        id: 'generation-failed-content',
        title: 'Content Request Optimization',
        difficulty: 'easy',
        estimatedTime: '3-5 minutes',
        steps: [
          {
            step: 1,
            action: 'Review content request',
            details: 'Check if your prompt contains inappropriate content, excessive length, or unclear instructions',
            expectedResult: 'Prompt is appropriate and clear',
            troubleshootingTip: 'Avoid controversial topics, excessive length, or vague requests'
          },
          {
            step: 2,
            action: 'Simplify the prompt',
            details: 'Make your request more specific and focused on a single topic',
            expectedResult: 'Prompt is clear, specific, and actionable',
            troubleshootingTip: 'Examples: "Create YouTube title for tech review" vs "Create content"'
          },
          {
            step: 3,
            action: 'Try different content type',
            details: 'Test with a different content type to see if the issue is specific',
            expectedResult: 'Other content types work normally',
            troubleshootingTip: 'Start with simple types like titles or ideas'
          },
          {
            step: 4,
            action: 'Check content filters',
            details: 'Ensure your request doesn\'t trigger content safety filters',
            expectedResult: 'Request passes content safety checks',
            troubleshootingTip: 'Avoid violent, adult, or harmful content requests'
          }
        ],
        successCriteria: [
          'Generation completes without errors',
          'Results are relevant and useful',
          'No content filter warnings'
        ],
        fallbackOptions: [
          'Try alternative phrasing for your request',
          'Use different keywords or approach',
          'Contact support for content guidelines'
        ]
      }
    ],
    preventionTips: [
      'Keep prompts clear and specific',
      'Follow content guidelines',
      'Test with simple requests first',
      'Avoid inappropriate or harmful content',
      'Use examples from successful generations'
    ],
    relatedIssues: ['generation-slow', 'account-limits', 'content-quality']
  },

  {
    id: 'canvas-performance',
    title: 'Canvas Running Slowly or Unresponsive',
    description: 'Canvas tool performance issues, slow rendering, or unresponsive interface',
    category: 'performance',
    severity: 'medium',
    symptoms: [
      'Canvas elements take long to load',
      'Dragging elements is laggy',
      'Browser becomes slow when using Canvas',
      'Canvas doesn\'t respond to clicks',
      'Export takes very long time'
    ],
    possibleCauses: [
      'Large canvas with many elements',
      'High-resolution images on canvas',
      'Browser performance limitations',
      'Too many complex elements',
      'Memory usage too high'
    ],
    diagnosticQuestions: [
      'How many elements are on your canvas?',
      'Are you using high-resolution images?',
      'What browser are you using?',
      'How much RAM does your device have?',
      'Are other applications running?'
    ],
    solutions: [
      {
        id: 'canvas-performance-optimize',
        title: 'Canvas Performance Optimization',
        difficulty: 'medium',
        estimatedTime: '5-10 minutes',
        steps: [
          {
            step: 1,
            action: 'Reduce canvas complexity',
            details: 'Group related elements together and remove unnecessary items',
            expectedResult: 'Canvas has fewer individual elements',
            troubleshootingTip: 'Aim for under 50 elements per canvas for best performance'
          },
          {
            step: 2,
            action: 'Optimize image sizes',
            details: 'Replace high-resolution images with web-optimized versions',
            expectedResult: 'Images load faster and take less memory',
            troubleshootingTip: 'Use images under 2MB and appropriate dimensions'
          },
          {
            step: 3,
            action: 'Close other browser tabs',
            details: 'Close unnecessary tabs and applications to free up memory',
            expectedResult: 'Browser has more available memory',
            troubleshootingTip: 'Canvas is memory-intensive and benefits from available resources'
          },
          {
            step: 4,
            action: 'Use canvas zoom efficiently',
            details: 'Zoom out when working with large canvases, zoom in for detail work',
            expectedResult: 'Canvas renders more efficiently at appropriate zoom levels',
            troubleshootingTip: 'Lower zoom levels require less rendering power'
          }
        ],
        successCriteria: [
          'Canvas responds quickly to interactions',
          'Elements move smoothly when dragged',
          'Export completes in reasonable time'
        ],
        fallbackOptions: [
          'Break large canvas into multiple smaller ones',
          'Use a different browser with better performance',
          'Consider upgrading device hardware'
        ]
      }
    ],
    preventionTips: [
      'Keep canvas projects focused and manageable',
      'Use appropriate image sizes',
      'Regularly clean up unused elements',
      'Break complex designs into multiple canvases',
      'Use modern browser with good performance'
    ],
    relatedIssues: ['browser-compatibility', 'memory-issues', 'export-problems']
  },

  {
    id: 'youtube-analysis-failed',
    title: 'YouTube Channel Analysis Not Working',
    description: 'YouTube channel analysis fails to complete or returns no results',
    category: 'feature',
    severity: 'medium',
    symptoms: [
      'Channel not found error',
      'Analysis gets stuck at "Analyzing..." stage',
      'No results returned after analysis',
      'Invalid channel URL error',
      'Analysis fails for certain channels'
    ],
    possibleCauses: [
      'Incorrect channel URL format',
      'Private or restricted channel',
      'Channel has no recent videos',
      'YouTube API limitations',
      'Network connectivity issues'
    ],
    diagnosticQuestions: [
      'What format did you use for the channel URL?',
      'Is the channel public and active?',
      'Does the channel have recent videos?',
      'Are you analyzing multiple channels at once?',
      'Do other YouTube features work normally?'
    ],
    solutions: [
      {
        id: 'youtube-analysis-fix',
        title: 'YouTube Analysis Troubleshooting',
        difficulty: 'easy',
        estimatedTime: '3-5 minutes',
        steps: [
          {
            step: 1,
            action: 'Verify channel URL format',
            details: 'Use format: youtube.com/@channelname or youtube.com/c/channelname',
            expectedResult: 'URL is in correct format',
            troubleshootingTip: 'Copy the URL directly from the YouTube channel page'
          },
          {
            step: 2,
            action: 'Check channel accessibility',
            details: 'Verify the channel is public and has recent videos',
            expectedResult: 'Channel loads normally in YouTube and has content',
            troubleshootingTip: 'Private or empty channels cannot be analyzed'
          },
          {
            step: 3,
            action: 'Try single channel analysis',
            details: 'If analyzing multiple channels, try one at a time',
            expectedResult: 'Single channel analysis completes successfully',
            troubleshootingTip: 'Multiple channel analysis takes longer and may timeout'
          },
          {
            step: 4,
            action: 'Use channel name instead of URL',
            details: 'Try entering just the channel name without the full URL',
            expectedResult: 'Analysis finds and processes the channel',
            troubleshootingTip: 'Sometimes channel names work better than URLs'
          }
        ],
        successCriteria: [
          'Analysis completes without errors',
          'Comprehensive report is generated',
          'Content insights are meaningful and accurate'
        ],
        fallbackOptions: [
          'Try analysis during off-peak hours',
          'Use YouTube Stats tool for basic metrics',
          'Contact support if specific channels consistently fail'
        ]
      }
    ],
    preventionTips: [
      'Use exact channel URLs from YouTube',
      'Verify channels are public before analysis',
      'Analyze channels with substantial content',
      'Be patient with large channel analysis',
      'Keep track of successful channel formats'
    ],
    relatedIssues: ['youtube-stats-issues', 'api-connectivity', 'account-limits']
  },

  {
    id: 'browser-compatibility',
    title: 'Browser Compatibility Issues',
    description: 'App features not working properly in certain browsers',
    category: 'browser',
    severity: 'medium',
    symptoms: [
      'Features missing or not loading',
      'Buttons not responding to clicks',
      'Styling appears broken',
      'JavaScript errors in console',
      'Upload features not working'
    ],
    possibleCauses: [
      'Outdated browser version',
      'Unsupported browser',
      'Browser extensions interfering',
      'JavaScript disabled',
      'Cookie/storage restrictions'
    ],
    diagnosticQuestions: [
      'What browser and version are you using?',
      'Do you have any browser extensions enabled?',
      'Does the issue occur in incognito mode?',
      'Are cookies and JavaScript enabled?',
      'Have you tried a different browser?'
    ],
    solutions: [
      {
        id: 'browser-compatibility-fix',
        title: 'Browser Compatibility Resolution',
        difficulty: 'easy',
        estimatedTime: '5-10 minutes',
        steps: [
          {
            step: 1,
            action: 'Update your browser',
            details: 'Ensure you\'re using the latest version of your browser',
            expectedResult: 'Browser is updated to latest version',
            troubleshootingTip: 'CreateGen Studio works best with current browser versions'
          },
          {
            step: 2,
            action: 'Try recommended browsers',
            details: 'Test with Chrome, Firefox, or Safari (latest versions)',
            expectedResult: 'App works normally in recommended browser',
            troubleshootingTip: 'Chrome generally provides the best compatibility'
          },
          {
            step: 3,
            action: 'Disable browser extensions',
            details: 'Temporarily disable all extensions, especially ad blockers',
            expectedResult: 'App functions improve without extensions',
            troubleshootingTip: 'Some extensions can block JavaScript or API calls'
          },
          {
            step: 4,
            action: 'Enable JavaScript and cookies',
            details: 'Verify JavaScript is enabled and cookies are allowed',
            expectedResult: 'JavaScript and cookies are properly configured',
            troubleshootingTip: 'The app requires both JavaScript and cookies to function'
          },
          {
            step: 5,
            action: 'Clear browser data',
            details: 'Clear cache, cookies, and local storage for the site',
            expectedResult: 'Browser data is cleared and app loads fresh',
            troubleshootingTip: 'Corrupted cache can cause various issues'
          }
        ],
        successCriteria: [
          'All app features load and function properly',
          'No JavaScript errors in browser console',
          'Interactive elements respond normally'
        ],
        fallbackOptions: [
          'Use different device if available',
          'Contact support with browser details',
          'Wait for browser compatibility updates'
        ]
      }
    ],
    preventionTips: [
      'Keep browser updated to latest version',
      'Use recommended browsers (Chrome, Firefox, Safari)',
      'Regularly clear browser cache and data',
      'Be cautious with browser extensions',
      'Enable JavaScript and cookies for the site'
    ],
    relatedIssues: ['performance-issues', 'feature-not-working', 'upload-problems']
  }
];

// Intelligent Diagnostic Engine
export class TroubleshootingDiagnostic {
  /**
   * Analyze user-reported symptoms and suggest most likely issues
   */
  diagnoseIssue(symptoms: string[], userContext?: any): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];
    
    for (const issue of TROUBLESHOOTING_DATABASE) {
      const confidence = this.calculateConfidence(symptoms, issue);
      
      if (confidence > 0.3) { // Only include issues with reasonable confidence
        results.push({
          issue,
          confidence,
          recommendedSolution: this.selectBestSolution(issue, userContext),
          additionalContext: this.generateAdditionalContext(issue, symptoms, confidence)
        });
      }
    }
    
    // Sort by confidence, highest first
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate confidence score based on symptom matching
   */
  private calculateConfidence(userSymptoms: string[], issue: TroubleshootingIssue): number {
    const symptomsLower = userSymptoms.map(s => s.toLowerCase());
    const issueSymptoms = issue.symptoms.map(s => s.toLowerCase());
    
    let matches = 0;
    let totalWeight = 0;
    
    for (const userSymptom of symptomsLower) {
      for (const issueSymptom of issueSymptoms) {
        const similarity = this.calculateStringSimilarity(userSymptom, issueSymptom);
        if (similarity > 0.6) {
          matches += similarity;
        }
        totalWeight += 1;
      }
    }
    
    return Math.min(matches / Math.max(totalWeight, 1), 1);
  }

  /**
   * Calculate string similarity using basic keyword matching
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    let commonWords = 0;
    for (const word1 of words1) {
      if (word1.length > 2 && words2.some(word2 => 
        word2.includes(word1) || word1.includes(word2)
      )) {
        commonWords++;
      }
    }
    
    return commonWords / Math.max(words1.length, words2.length);
  }

  /**
   * Select the best solution based on user context and difficulty
   */
  private selectBestSolution(issue: TroubleshootingIssue, userContext?: any): TroubleshootingSolution {
    // Default to easiest solution if no context
    if (!userContext) {
      return issue.solutions.find(s => s.difficulty === 'easy') || issue.solutions[0];
    }
    
    // Consider user's technical level if available
    const userLevel = userContext.technicalLevel || 'beginner';
    
    if (userLevel === 'advanced') {
      return issue.solutions.find(s => s.difficulty === 'advanced') || 
             issue.solutions.find(s => s.difficulty === 'medium') || 
             issue.solutions[0];
    } else if (userLevel === 'intermediate') {
      return issue.solutions.find(s => s.difficulty === 'medium') || 
             issue.solutions.find(s => s.difficulty === 'easy') || 
             issue.solutions[0];
    } else {
      return issue.solutions.find(s => s.difficulty === 'easy') || issue.solutions[0];
    }
  }

  /**
   * Generate additional context and guidance
   */
  private generateAdditionalContext(
    issue: TroubleshootingIssue, 
    symptoms: string[], 
    confidence: number
  ): string {
    let context = '';
    
    if (confidence > 0.8) {
      context = `High confidence match. This issue commonly occurs with the symptoms you described.`;
    } else if (confidence > 0.6) {
      context = `Good match for your symptoms. This is a likely cause of the issue.`;
    } else if (confidence > 0.4) {
      context = `Possible match. Consider this if other solutions don't work.`;
    } else {
      context = `Lower confidence match, but worth considering if symptoms align.`;
    }
    
    if (issue.severity === 'critical') {
      context += ` This is a critical issue that should be resolved immediately.`;
    } else if (issue.severity === 'high') {
      context += ` This is a high-priority issue that may significantly impact your workflow.`;
    }
    
    return context;
  }

  /**
   * Generate step-by-step troubleshooting guide
   */
  generateTroubleshootingGuide(issue: TroubleshootingIssue, solution: TroubleshootingSolution): string {
    let guide = `# ${issue.title}\n\n`;
    guide += `**Issue Description:** ${issue.description}\n\n`;
    guide += `**Difficulty:** ${solution.difficulty.toUpperCase()} (${solution.estimatedTime})\n\n`;
    
    guide += `## Steps to Resolve:\n\n`;
    for (const step of solution.steps) {
      guide += `### Step ${step.step}: ${step.action}\n`;
      guide += `${step.details}\n\n`;
      guide += `**Expected Result:** ${step.expectedResult}\n`;
      if (step.troubleshootingTip) {
        guide += `💡 **Tip:** ${step.troubleshootingTip}\n`;
      }
      guide += `\n`;
    }
    
    guide += `## Success Criteria:\n`;
    for (const criteria of solution.successCriteria) {
      guide += `- ${criteria}\n`;
    }
    
    if (solution.fallbackOptions.length > 0) {
      guide += `\n## If This Doesn't Work:\n`;
      for (const option of solution.fallbackOptions) {
        guide += `- ${option}\n`;
      }
    }
    
    if (issue.preventionTips.length > 0) {
      guide += `\n## Prevention Tips:\n`;
      for (const tip of issue.preventionTips) {
        guide += `- ${tip}\n`;
      }
    }
    
    return guide;
  }
}

// Export the diagnostic engine instance
export const troubleshootingDiagnostic = new TroubleshootingDiagnostic();

// Quick diagnostic helpers
export const quickDiagnose = (symptoms: string[]) => 
  troubleshootingDiagnostic.diagnoseIssue(symptoms);

export const findIssueById = (id: string) => 
  TROUBLESHOOTING_DATABASE.find(issue => issue.id === id);

export const getIssuesByCategory = (category: TroubleshootingIssue['category']) =>
  TROUBLESHOOTING_DATABASE.filter(issue => issue.category === category);

export const getIssuesBySeverity = (severity: TroubleshootingIssue['severity']) =>
  TROUBLESHOOTING_DATABASE.filter(issue => issue.severity === severity);
