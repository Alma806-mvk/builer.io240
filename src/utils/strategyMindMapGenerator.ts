import { ContentStrategyPlanOutput, ContentStrategyPillar } from '../types';

export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  mindMapNodeType: "central" | "primary" | "secondary";
  mindMapLevel: number;
  mindMapShape: "circle" | "rectangle" | "ellipse";
  mindMapTheme: string;
  mindMapConnections: string[];
  mindMapConnectionStyle: "solid" | "curved";
  mindMapPriority: "low" | "medium" | "high" | "critical";
  mindMapIcon?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  category?: string; // "niche" | "pillar" | "keyword" | "content-type"
  parentId?: string; // For strict hierarchy
}

export interface MindMapStructure {
  nodes: MindMapNode[];
  centerNode: MindMapNode;
  connections: Array<{ from: string; to: string; style: string }>;
}

/**
 * Strict hierarchical parsing - identifies distinct sections
 */
interface ParsedStrategyData {
  niche: string;
  pillars: Array<{
    name: string;
    description: string;
    keywords: string[];
    contentTypes: string[];
  }>;
}

function parseStrategyContent(strategyContent: string, strategyPlan?: ContentStrategyPlanOutput): ParsedStrategyData {
  console.log('🔍 Starting strict hierarchical parsing...');
  
  // 1. Extract Niche/Industry (Central Node)
  let niche = "Content Strategy";
  if (strategyPlan?.targetAudienceOverview) {
    const audienceText = strategyPlan.targetAudienceOverview;
    const nicheMatch = audienceText.match(/(?:targeting|for|serving)\s+([^,.!\n]{10,50})/i);
    if (nicheMatch) {
      niche = nicheMatch[1].trim();
    } else {
      // Extract first meaningful sentence
      const firstSentence = audienceText.split(/[.!]/)[0].trim();
      if (firstSentence.length >= 10 && firstSentence.length <= 50) {
        niche = firstSentence;
      }
    }
  }

  // 2. Extract Content Pillars (Primary Nodes)
  const pillars: ParsedStrategyData['pillars'] = [];
  
  if (strategyPlan?.contentPillars?.length) {
    // Use structured data
    strategyPlan.contentPillars.forEach(pillar => {
      pillars.push({
        name: pillar.pillarName,
        description: pillar.description || '',
        keywords: pillar.keywords || [],
        contentTypes: pillar.contentTypes || []
      });
    });
  } else {
    // Parse from raw content
    const pillarMatches = strategyContent.matchAll(/##?\s*(?:Pillar\s*\d+[:\s]*)?([^#\n]+)/gi);
    for (const match of pillarMatches) {
      const pillarName = match[1].trim().replace(/[*#]/g, '');
      if (pillarName && pillarName.length > 3) {
        // Find content for this pillar
        const pillarSection = strategyContent.substring(match.index || 0, 
          strategyContent.indexOf('##', (match.index || 0) + 1) || strategyContent.length);
        
        // Extract keywords
        const keywordMatch = pillarSection.match(/(?:keywords?|tags?)[:\s]*([^.\n]+)/i);
        const keywords = keywordMatch ? 
          keywordMatch[1].split(/[,;]/).map(k => k.trim()).filter(k => k.length > 2) : [];
        
        // Extract content types
        const contentTypeMatch = pillarSection.match(/(?:content\s*types?|formats?)[:\s]*([^.\n]+)/i);
        const contentTypes = contentTypeMatch ? 
          contentTypeMatch[1].split(/[,;]/).map(c => c.trim()).filter(c => c.length > 2) : [];
        
        pillars.push({
          name: pillarName,
          description: '',
          keywords: keywords.slice(0, 3), // Limit for clean layout
          contentTypes: contentTypes.slice(0, 3) // Limit for clean layout
        });
      }
    }
  }

  // Limit to 4 pillars maximum for clean layout
  const limitedPillars = pillars.slice(0, 4);

  console.log('✅ Parsed strategy data:', {
    niche,
    pillarCount: limitedPillars.length,
    totalKeywords: limitedPillars.reduce((sum, p) => sum + p.keywords.length, 0),
    totalContentTypes: limitedPillars.reduce((sum, p) => sum + p.contentTypes.length, 0)
  });

  return { niche, pillars: limitedPillars };
}

/**
 * Calculate optimal font size based on text length and node type for better readability
 */
function calculateOptimalFontSize(text: string, nodeType: "central" | "primary" | "secondary", nodeWidth: number): string {
  const textLength = text.length;
  let baseFontSize = 0;

  switch (nodeType) {
    case "central":
      baseFontSize = Math.max(20, Math.min(26, 300 / Math.max(textLength, 8)));
      break;
    case "primary":
      baseFontSize = Math.max(16, Math.min(20, 200 / Math.max(textLength, 6)));
      break;
    case "secondary":
      baseFontSize = Math.max(14, Math.min(16, 150 / Math.max(textLength, 4)));
      break;
  }

  return `${Math.round(baseFontSize)}px`;
}

/**
 * Automatic text sizing for nodes
 */
function calculateNodeSize(text: string, nodeType: "central" | "primary" | "secondary"): { width: number; height: number } {
  const textLength = text.length;
  let baseWidth = 0;
  let baseHeight = 0;

  switch (nodeType) {
    case "central":
      baseWidth = Math.max(300, Math.min(400, textLength * 12 + 60));
      baseHeight = 120;
      break;
    case "primary":
      baseWidth = Math.max(200, Math.min(280, textLength * 10 + 40));
      baseHeight = 100;
      break;
    case "secondary":
      baseWidth = Math.max(120, Math.min(200, textLength * 8 + 30));
      baseHeight = 70;
      break;
  }

  return { width: baseWidth, height: baseHeight };
}

/**
 * Enhanced radial tree layout algorithm with strict spacing and hierarchy
 */
function calculateRadialTreeLayout(
  centerX: number,
  centerY: number,
  itemCount: number,
  baseRadius: number,
  startAngle: number = -Math.PI / 2,
  nodeType: 'primary' | 'secondary' = 'primary'
): Array<{ x: number; y: number; angle: number }> {
  const positions: Array<{ x: number; y: number; angle: number }> = [];

  if (itemCount === 0) return positions;

  // Calculate minimum spacing to prevent overlap
  const minSpacing = nodeType === 'primary' ? 400 : 280; // Increased spacing
  const circumference = 2 * Math.PI * baseRadius;
  const requiredSpacing = itemCount * minSpacing;

  // Adjust radius if needed to maintain minimum spacing
  const adjustedRadius = Math.max(baseRadius, requiredSpacing / (2 * Math.PI));
  const angleStep = (2 * Math.PI) / itemCount;

  for (let i = 0; i < itemCount; i++) {
    const angle = startAngle + (i * angleStep);
    const x = centerX + Math.cos(angle) * adjustedRadius;
    const y = centerY + Math.sin(angle) * adjustedRadius;

    positions.push({ x, y, angle });
  }

  return positions;
}

/**
 * Advanced spacing enforcement with strict minimum distances
 */
function enforceMinimumSpacing(nodes: MindMapNode[]): void {
  const minDistances = {
    'central-primary': 480,
    'central-secondary': 600,
    'primary-primary': 420,
    'primary-secondary': 320,
    'secondary-secondary': 250
  };

  const maxIterations = 50;
  const dampening = 0.8;

  for (let iter = 0; iter < maxIterations; iter++) {
    let hasAdjustments = false;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        const dx = node2.x + node2.width/2 - (node1.x + node1.width/2);
        const dy = node2.y + node2.height/2 - (node1.y + node1.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Determine required minimum distance based on node types
        const key1 = `${node1.mindMapNodeType}-${node2.mindMapNodeType}` as keyof typeof minDistances;
        const key2 = `${node2.mindMapNodeType}-${node1.mindMapNodeType}` as keyof typeof minDistances;
        const minDistance = minDistances[key1] || minDistances[key2] || 300;

        // Add node size consideration
        const nodeSpacing = (Math.max(node1.width, node1.height) + Math.max(node2.width, node2.height)) / 2;
        const totalMinDistance = minDistance + nodeSpacing;

        if (distance < totalMinDistance && distance > 0) {
          hasAdjustments = true;

          // Calculate push force
          const pushDistance = (totalMinDistance - distance) / 2;
          const pushX = (dx / distance) * pushDistance * dampening;
          const pushY = (dy / distance) * pushDistance * dampening;

          // Don't move central node
          if (node1.mindMapNodeType !== 'central') {
            node1.x -= pushX;
            node1.y -= pushY;
          }
          if (node2.mindMapNodeType !== 'central') {
            node2.x += pushX;
            node2.y += pushY;
          }
        }
      }
    }

    if (!hasAdjustments) {
      console.log(`✅ Spacing converged after ${iter + 1} iterations`);
      break;
    }
  }
}

/**
 * Main generation function with strict hierarchy and clean layout
 */
export function generateStrategyMindMap(
  strategyContent: string,
  strategyPlan?: ContentStrategyPlanOutput,
  canvasWidth: number = 1200,
  canvasHeight: number = 800
): MindMapStructure {
  console.log('🧠 Starting strategy mind map generation with strict hierarchy...');
  
  // 1. Strict Hierarchical Parsing
  const parsedData = parseStrategyContent(strategyContent, strategyPlan);
  
  const nodes: MindMapNode[] = [];
  const connections: Array<{ from: string; to: string; style: string }> = [];
  
  // 2. Create Central Node (Niche/Industry) - Visually Distinct
  const centerSize = calculateNodeSize(parsedData.niche, "central");
  const centerNode: MindMapNode = {
    id: `central-${Date.now()}`,
    text: parsedData.niche,
    x: canvasWidth / 2 - centerSize.width / 2,
    y: canvasHeight / 2 - centerSize.height / 2,
    width: centerSize.width,
    height: centerSize.height,
    mindMapNodeType: "central",
    mindMapLevel: 0,
    mindMapShape: "ellipse",
    mindMapTheme: "strategy",
    mindMapConnections: [],
    mindMapConnectionStyle: "solid",
    mindMapPriority: "critical",
    mindMapIcon: "🎯",
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
    borderColor: "#3b82f6",
    category: "niche"
  };
  
  nodes.push(centerNode);
  
  // 3. Create Primary Nodes (Content Pillars) with Radial Tree Layout
  const pillarPositions = calculateRadialTreeLayout(
    centerNode.x + centerNode.width / 2,
    centerNode.y + centerNode.height / 2,
    parsedData.pillars.length,
    450, // Larger base radius for proper spacing
    -Math.PI / 2, // Start from top
    'primary'
  );
  
  const pillarColors = [
    { bg: "#059669", border: "#10b981", icon: "📈" }, // Green
    { bg: "#7c3aed", border: "#8b5cf6", icon: "🚀" }, // Purple  
    { bg: "#dc2626", border: "#ef4444", icon: "💎" }, // Red
    { bg: "#ea580c", border: "#f97316", icon: "🔥" }  // Orange
  ];
  
  const primaryNodes: MindMapNode[] = [];
  
  parsedData.pillars.forEach((pillar, index) => {
    const position = pillarPositions[index];
    const size = calculateNodeSize(pillar.name, "primary");
    const colorSet = pillarColors[index % pillarColors.length];
    
    const pillarNode: MindMapNode = {
      id: `primary-${index}-${Date.now()}`,
      text: pillar.name,
      x: position.x - size.width / 2,
      y: position.y - size.height / 2,
      width: size.width,
      height: size.height,
      mindMapNodeType: "primary",
      mindMapLevel: 1,
      mindMapShape: "rectangle",
      mindMapTheme: "strategy",
      mindMapConnections: [centerNode.id],
      mindMapConnectionStyle: "solid",
      mindMapPriority: "high",
      mindMapIcon: colorSet.icon,
      backgroundColor: colorSet.bg,
      textColor: "#ffffff",
      borderColor: colorSet.border,
      category: "pillar",
      parentId: centerNode.id
    };
    
    primaryNodes.push(pillarNode);
    nodes.push(pillarNode);
    centerNode.mindMapConnections.push(pillarNode.id);
    
    // Add connection
    connections.push({
      from: centerNode.id,
      to: pillarNode.id,
      style: "solid"
    });
    
    // 4. Create Secondary Nodes (Keywords and Content Types)
    const allSecondaryItems = [
      ...pillar.keywords.map(k => ({ text: k, category: "keyword" })),
      ...pillar.contentTypes.map(c => ({ text: c, category: "content-type" }))
    ];
    
    if (allSecondaryItems.length > 0) {
      const secondaryPositions = calculateRadialTreeLayout(
        pillarNode.x + pillarNode.width / 2,
        pillarNode.y + pillarNode.height / 2,
        allSecondaryItems.length,
        280, // Larger radius for proper spacing
        position.angle + Math.PI, // Opposite side from center
        'secondary'
      );
      
      allSecondaryItems.forEach((item, secIndex) => {
        const secPosition = secondaryPositions[secIndex];
        const secSize = calculateNodeSize(item.text, "secondary");
        
        const secondaryNode: MindMapNode = {
          id: `secondary-${index}-${secIndex}-${Date.now()}`,
          text: item.text,
          x: secPosition.x - secSize.width / 2,
          y: secPosition.y - secSize.height / 2,
          width: secSize.width,
          height: secSize.height,
          mindMapNodeType: "secondary",
          mindMapLevel: 2,
          mindMapShape: "ellipse",
          mindMapTheme: "strategy",
          mindMapConnections: [pillarNode.id],
          mindMapConnectionStyle: "solid",
          mindMapPriority: "medium",
          mindMapIcon: item.category === "keyword" ? "🔍" : "📝",
          backgroundColor: item.category === "keyword" ? "#6366f1" : "#8b5cf6",
          textColor: "#ffffff",
          borderColor: item.category === "keyword" ? "#818cf8" : "#a78bfa",
          category: item.category,
          parentId: pillarNode.id
        };
        
        nodes.push(secondaryNode);
        pillarNode.mindMapConnections.push(secondaryNode.id);
        
        // Add connection (Secondary to Primary only)
        connections.push({
          from: pillarNode.id,
          to: secondaryNode.id,
          style: "solid"
        });
      });
    }
  });
  
  // 5. Enforce Strict Minimum Spacing
  console.log('🔧 Enforcing minimum spacing requirements...');
  enforceMinimumSpacing(nodes);
  
  console.log('✅ Mind map generation complete:', {
    totalNodes: nodes.length,
    connections: connections.length,
    hierarchy: {
      central: nodes.filter(n => n.mindMapNodeType === "central").length,
      primary: nodes.filter(n => n.mindMapNodeType === "primary").length,
      secondary: nodes.filter(n => n.mindMapNodeType === "secondary").length
    }
  });
  
  return { nodes, centerNode, connections };
}

/**
 * Enhanced canvas conversion with proper connections
 */
export function convertMindMapToCanvasItems(mindMapStructure: MindMapStructure) {
  const canvasItems: any[] = [];
  
  console.log('🎨 Converting hierarchical mind map to canvas items...');
  
  // Add all nodes
  mindMapStructure.nodes.forEach((node) => {
    const canvasItem = {
      id: node.id,
      type: "mindMapNode",
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      text: node.text,
      content: node.text,
      mindMapNodeType: node.mindMapNodeType,
      mindMapLevel: node.mindMapLevel,
      mindMapShape: node.mindMapShape,
      mindMapTheme: node.mindMapTheme,
      mindMapConnections: node.mindMapConnections,
      mindMapConnectionStyle: node.mindMapConnectionStyle,
      mindMapPriority: node.mindMapPriority,
      mindMapIcon: node.mindMapIcon,
      backgroundColor: node.backgroundColor,
      textColor: node.textColor,
      borderColor: node.borderColor,
      category: node.category,
      parentId: node.parentId,
      // Optimized dynamic font sizing for better readability
      fontFamily: "Inter, -apple-system, sans-serif",
      fontSize: calculateOptimalFontSize(node.text, node.mindMapNodeType, node.width),
      fontWeight: node.mindMapNodeType === "central" ? "700" :
                 node.mindMapNodeType === "primary" ? "600" : "500",
      lineHeight: node.mindMapNodeType === "central" ? "1.2" : "1.3",
      borderWidth: "2px",
      borderStyle: "solid",
      borderRadius: node.mindMapShape === "ellipse" ? "50%" : "8px",
      boxShadow: node.mindMapNodeType === "central" ? 
        "0 8px 20px rgba(0, 0, 0, 0.15)" : 
        "0 4px 10px rgba(0, 0, 0, 0.1)",
      // Text alignment and padding
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "8px 12px"
    };
    
    canvasItems.push(canvasItem);
  });
  
  // Add enhanced edge-to-edge curved connection lines
  mindMapStructure.connections.forEach((connection, index) => {
    const fromNode = mindMapStructure.nodes.find(n => n.id === connection.from);
    const toNode = mindMapStructure.nodes.find(n => n.id === connection.to);

    if (fromNode && toNode) {
      const connectionItem = {
        id: `connection-${index}-${Date.now()}`,
        type: "connectorElement",
        startNodeId: connection.from,
        endNodeId: connection.to,
        // Edge-to-edge connection will be calculated dynamically by MindMapConnectorElement
        startX: fromNode.x + fromNode.width / 2,
        startY: fromNode.y + fromNode.height / 2,
        endX: toNode.x + toNode.width / 2,
        endY: toNode.y + toNode.height / 2,
        // Enhanced styling based on hierarchy
        strokeColor: fromNode.mindMapNodeType === "central" ? "#3b82f6" :
                    fromNode.mindMapNodeType === "primary" ? "#059669" : "#64748b",
        strokeWidth: fromNode.mindMapNodeType === "central" ? 4 :
                    fromNode.mindMapNodeType === "primary" ? 3 : 2,
        strokeStyle: "solid",
        lineType: "bezierCurve",
        curvature: 0.25, // Subtle curve for elegance
        arrowEnd: true,
        arrowSize: fromNode.mindMapNodeType === "central" ? 12 : 8,
        opacity: 0.9,
        zIndex: 0, // Keep connections behind nodes
        // Enhanced visual properties
        connectorType: "curved",
        connectorAnimation: "none", // Can be enabled for presentations
        connectorShowPoints: false
      };

      canvasItems.push(connectionItem);
    }
  });
  
  console.log('✅ Canvas conversion complete:', {
    nodes: mindMapStructure.nodes.length,
    connections: mindMapStructure.connections.length,
    totalItems: canvasItems.length
  });
  
  return canvasItems;
}

/**
 * Utility function to extract niche from strategy content (for backward compatibility)
 */
export function extractNicheFromStrategy(strategyContent: string, strategyPlan?: ContentStrategyPlanOutput): string {
  const parsedData = parseStrategyContent(strategyContent, strategyPlan);
  return parsedData.niche;
}

/**
 * Utility function to extract pillars from strategy content (for backward compatibility)
 */
export function extractPillarsFromStrategy(strategyContent: string, strategyPlan?: ContentStrategyPlanOutput): ContentStrategyPillar[] {
  const parsedData = parseStrategyContent(strategyContent, strategyPlan);
  return parsedData.pillars.map(p => ({
    pillarName: p.name,
    description: p.description,
    keywords: p.keywords,
    contentTypes: p.contentTypes,
    postingFrequency: '',
    engagementStrategy: ''
  }));
}
