// Canvas Worker for offloading heavy calculations
// This worker handles force-directed layout algorithms and Bezier curve calculations

export interface WorkerMessage {
  type: string;
  payload: any;
  id: string;
}

export interface LayoutCalculationRequest {
  items: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  connections: Array<{
    from: string;
    to: string;
  }>;
  canvasWidth: number;
  canvasHeight: number;
  iterations?: number;
}

export interface BezierCalculationRequest {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlPoints?: Array<{ x: number; y: number }>;
  segments?: number;
}

class CanvasWorker {
  // Helper method to identify node clusters based on connection patterns
  private identifyNodeCluster(item: any, connections: any[]) {
    // Find all nodes connected to this item
    const connectedNodeIds = new Set<string>();
    connections.forEach(conn => {
      if (conn.from === item.id) connectedNodeIds.add(conn.to);
      if (conn.to === item.id) connectedNodeIds.add(conn.from);
    });

    // Use the first connected node ID as cluster identifier, or the item's own ID
    const sortedConnectedIds = Array.from(connectedNodeIds).sort();
    return sortedConnectedIds.length > 0 ? sortedConnectedIds[0] : item.id;
  }

  // Helper method to determine node type (root, branch, leaf)
  private getNodeType(item: any, connections: any[]) {
    const incomingConnections = connections.filter(conn => conn.to === item.id).length;
    const outgoingConnections = connections.filter(conn => conn.from === item.id).length;

    if (incomingConnections === 0 && outgoingConnections > 0) return 'root';
    if (outgoingConnections === 0 && incomingConnections > 0) return 'leaf';
    return 'branch';
  }

  // Apply cluster cohesion forces to keep related nodes together
  private applyClusterForces(nodes: any[], clusterForce: number, clusterSeparation: number) {
    const clusters = new Map<string, any[]>();

    // Group nodes by cluster
    nodes.forEach(node => {
      const clusterNodes = clusters.get(node.cluster) || [];
      clusterNodes.push(node);
      clusters.set(node.cluster, clusterNodes);
    });

    // Apply forces within each cluster
    clusters.forEach((clusterNodes, clusterId) => {
      if (clusterNodes.length < 2) return;

      // Calculate cluster centroid
      const centroidX = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
      const centroidY = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;

      // Apply gentle attraction to cluster center
      clusterNodes.forEach(node => {
        const dx = centroidX - node.x;
        const dy = centroidY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = clusterForce * distance * 0.1;
        node.fx += (dx / distance) * force;
        node.fy += (dy / distance) * force;
      });
    });
  }

  // Calculate smart connector points (edge-to-edge instead of center-to-center)
  private calculateSmartConnector(sourceNode: any, targetNode: any) {
    const sourceRect = {
      x: sourceNode.x,
      y: sourceNode.y,
      width: sourceNode.width || 200,
      height: sourceNode.height || 100,
    };

    const targetRect = {
      x: targetNode.x,
      y: targetNode.y,
      width: targetNode.width || 200,
      height: targetNode.height || 100,
    };

    // Calculate centers
    const sourceCenterX = sourceRect.x + sourceRect.width / 2;
    const sourceCenterY = sourceRect.y + sourceRect.height / 2;
    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;

    // Calculate direction vector
    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Find intersection points with rectangle edges
    const sourceEdge = this.getRectangleIntersection(sourceRect, dirX, dirY, true);
    const targetEdge = this.getRectangleIntersection(targetRect, -dirX, -dirY, false);

    return {
      startX: sourceEdge.x,
      startY: sourceEdge.y,
      endX: targetEdge.x,
      endY: targetEdge.y,
      controlX: (sourceEdge.x + targetEdge.x) / 2,
      controlY: (sourceEdge.y + targetEdge.y) / 2 - Math.abs(dx) * 0.2,
    };
  }

  // Find intersection point of a ray with rectangle edge
  private getRectangleIntersection(rect: any, dirX: number, dirY: number, isSource: boolean) {
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    // Calculate intersections with all four edges
    const intersections = [];

    // Right edge
    if (dirX > 0) {
      const t = (rect.x + rect.width - centerX) / dirX;
      const y = centerY + t * dirY;
      if (y >= rect.y && y <= rect.y + rect.height) {
        intersections.push({ x: rect.x + rect.width, y, t });
      }
    }

    // Left edge
    if (dirX < 0) {
      const t = (rect.x - centerX) / dirX;
      const y = centerY + t * dirY;
      if (y >= rect.y && y <= rect.y + rect.height) {
        intersections.push({ x: rect.x, y, t });
      }
    }

    // Bottom edge
    if (dirY > 0) {
      const t = (rect.y + rect.height - centerY) / dirY;
      const x = centerX + t * dirX;
      if (x >= rect.x && x <= rect.x + rect.width) {
        intersections.push({ x, y: rect.y + rect.height, t });
      }
    }

    // Top edge
    if (dirY < 0) {
      const t = (rect.y - centerY) / dirY;
      const x = centerX + t * dirX;
      if (x >= rect.x && x <= rect.x + rect.width) {
        intersections.push({ x, y: rect.y, t });
      }
    }

    // Return the closest valid intersection
    const validIntersections = intersections.filter(i => i.t >= 0);
    if (validIntersections.length === 0) {
      return { x: centerX, y: centerY };
    }

    const closest = validIntersections.reduce((min, current) =>
      current.t < min.t ? current : min
    );

    return { x: closest.x, y: closest.y };
  }

  // Enhanced force-directed layout calculation with clustering and improved spacing
  private calculateForceDirectedLayout(data: LayoutCalculationRequest) {
    const { items, connections, canvasWidth, canvasHeight, iterations = 150 } = data;

    // Initialize physics simulation with enhanced node properties
    const nodes = items.map(item => ({
      ...item,
      vx: 0,
      vy: 0,
      fx: 0,
      fy: 0,
      cluster: this.identifyNodeCluster(item, connections),
      nodeType: this.getNodeType(item, connections),
    }));

    const links = connections.map(conn => ({
      source: nodes.find(n => n.id === conn.from)!,
      target: nodes.find(n => n.id === conn.to)!,
    })).filter(link => link.source && link.target);

    // Enhanced simulation parameters for better spacing and grouping
    const strength = 0.4;
    const linkDistance = 220; // Increased for more breathing room
    const centerForce = 0.008;
    const repelForce = 1200; // Significantly increased for more spacing
    const clusterForce = 0.15; // New: Force to keep clusters together
    const clusterSeparation = 300; // Distance between different clusters

    // Run simulation
    for (let i = 0; i < iterations; i++) {
      // Reset forces
      nodes.forEach(node => {
        node.fx = 0;
        node.fy = 0;
      });

      // Apply center force
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      nodes.forEach(node => {
        node.fx += (centerX - node.x) * centerForce;
        node.fy += (centerY - node.y) * centerForce;
      });

      // Apply enhanced repulsion between nodes with cluster awareness
      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const nodeA = nodes[j];
          const nodeB = nodes[k];

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          // Different repulsion based on cluster relationship
          const sameClusters = nodeA.cluster === nodeB.cluster;
          const baseRepelForce = sameClusters ? repelForce * 0.7 : repelForce * 1.3;

          // Stronger repulsion for cross-cluster nodes to create clear grouping
          const clusterMultiplier = sameClusters ? 1 : 1.8;
          const effectiveRepelForce = baseRepelForce * clusterMultiplier;

          const force = effectiveRepelForce / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          nodeA.fx -= fx;
          nodeA.fy -= fy;
          nodeB.fx += fx;
          nodeB.fy += fy;
        }
      }

      // Apply cluster cohesion forces
      this.applyClusterForces(nodes, clusterForce, clusterSeparation);

      // Apply enhanced link forces with cluster-aware spacing
      links.forEach(link => {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Adjust link distance based on node types and cluster relationship
        const sameClusters = link.source.cluster === link.target.cluster;
        const effectiveLinkDistance = sameClusters ? linkDistance * 0.8 : linkDistance * 1.2;

        const force = (distance - effectiveLinkDistance) * strength;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        link.source.fx += fx;
        link.source.fy += fy;
        link.target.fx -= fx;
        link.target.fy -= fy;
      });

      // Apply forces and update positions
      nodes.forEach(node => {
        node.vx = (node.vx + node.fx) * 0.9; // Damping
        node.vy = (node.vy + node.fy) * 0.9;
        
        node.x += node.vx;
        node.y += node.vy;
        
        // Keep nodes within bounds
        node.x = Math.max(50, Math.min(canvasWidth - 50, node.x));
        node.y = Math.max(50, Math.min(canvasHeight - 50, node.y));
      });
    }

    return nodes.map(node => ({
      id: node.id,
      x: node.x,
      y: node.y,
      cluster: node.cluster,
      nodeType: node.nodeType,
    }));
  }

  // Calculate smart connectors for node connections
  private calculateSmartConnectors(data: any) {
    const { nodes, connections } = data;

    return connections.map((conn: any) => {
      const sourceNode = nodes.find((n: any) => n.id === conn.from);
      const targetNode = nodes.find((n: any) => n.id === conn.to);

      if (!sourceNode || !targetNode) {
        return null;
      }

      const connector = this.calculateSmartConnector(sourceNode, targetNode);

      return {
        id: `${conn.from}-${conn.to}`,
        from: conn.from,
        to: conn.to,
        ...connector,
      };
    }).filter(Boolean);
  }

  // Bezier curve calculation with optimized segments
  private calculateBezierCurve(data: BezierCalculationRequest) {
    const { startX, startY, endX, endY, controlPoints, segments = 50 } = data;
    
    const points: Array<{ x: number; y: number }> = [];
    
    if (!controlPoints || controlPoints.length === 0) {
      // Simple quadratic curve
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const offsetY = Math.min(100, Math.abs(endX - startX) * 0.3);
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * (midY - offsetY) + t * t * endY;
        points.push({ x, y });
      }
    } else if (controlPoints.length === 1) {
      // Quadratic Bezier
      const cp = controlPoints[0];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cp.x + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cp.y + t * t * endY;
        points.push({ x, y });
      }
    } else {
      // Cubic Bezier
      const cp1 = controlPoints[0];
      const cp2 = controlPoints[1];
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = Math.pow(1 - t, 3) * startX + 
                  3 * Math.pow(1 - t, 2) * t * cp1.x + 
                  3 * (1 - t) * Math.pow(t, 2) * cp2.x + 
                  Math.pow(t, 3) * endX;
        const y = Math.pow(1 - t, 3) * startY + 
                  3 * Math.pow(1 - t, 2) * t * cp1.y + 
                  3 * (1 - t) * Math.pow(t, 2) * cp2.y + 
                  Math.pow(t, 3) * endY;
        points.push({ x, y });
      }
    }
    
    // Generate SVG path
    const path = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    
    return { points, path };
  }
}

// Worker message handler
const worker = new CanvasWorker();

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, payload, id } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'CALCULATE_LAYOUT':
        result = worker['calculateForceDirectedLayout'](payload);
        break;

      case 'CALCULATE_BEZIER':
        result = worker['calculateBezierCurve'](payload);
        break;

      case 'CALCULATE_SMART_CONNECTORS':
        result = worker['calculateSmartConnectors'](payload);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    self.postMessage({
      type: `${type}_RESULT`,
      payload: result,
      id,
    });
  } catch (error) {
    self.postMessage({
      type: `${type}_ERROR`,
      payload: { error: error instanceof Error ? error.message : 'Unknown error' },
      id,
    });
  }
};

export {};
