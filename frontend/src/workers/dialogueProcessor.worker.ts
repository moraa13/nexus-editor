// Web Worker for heavy dialogue processing
import type { DialogueTree, DialogueNode, SkillCheck } from '../types/discoElysium';

// Message types
interface WorkerMessage {
  type: 'PROCESS_DIALOGUE' | 'VALIDATE_TREE' | 'CALCULATE_PATHS' | 'GENERATE_PREVIEW';
  payload: any;
  id: string;
}

interface WorkerResponse {
  type: 'RESULT' | 'ERROR' | 'PROGRESS';
  payload: any;
  id: string;
}

// Process dialogue tree for validation and optimization
function processDialogueTree(tree: DialogueTree): any {
  const startTime = performance.now();
  
  try {
    // Validate tree structure
    const validation = validateDialogueTree(tree);
    
    // Calculate all possible paths
    const paths = calculateAllPaths(tree);
    
    // Generate statistics
    const stats = generateTreeStatistics(tree);
    
    // Optimize tree structure
    const optimized = optimizeTreeStructure(tree);
    
    const processingTime = performance.now() - startTime;
    
    return {
      validation,
      paths,
      stats,
      optimized,
      processingTime,
      timestamp: Date.now()
    };
  } catch (error) {
    throw new Error(`Dialogue processing failed: ${error.message}`);
  }
}

// Validate dialogue tree structure
function validateDialogueTree(tree: DialogueTree): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for orphaned nodes
  const nodeIds = new Set(tree.nodes.map(node => node.id));
  const referencedIds = new Set<string>();
  
  tree.nodes.forEach(node => {
    // Check choices
    if (node.choices) {
      node.choices.forEach(choice => {
        if (choice.nextNodeId && !nodeIds.has(choice.nextNodeId)) {
          errors.push(`Choice references non-existent node: ${choice.nextNodeId}`);
        }
        referencedIds.add(choice.nextNodeId);
      });
    }
  });
  
  // Check for unreachable nodes
  const reachableNodes = new Set<string>();
  function traverseFromNode(nodeId: string) {
    if (reachableNodes.has(nodeId)) return;
    reachableNodes.add(nodeId);
    
    const node = tree.nodes.find(n => n.id === nodeId);
    if (node && node.choices) {
      node.choices.forEach(choice => {
        if (choice.nextNodeId) {
          traverseFromNode(choice.nextNodeId);
        }
      });
    }
  }
  
  traverseFromNode(tree.startNodeId);
  
  tree.nodes.forEach(node => {
    if (!reachableNodes.has(node.id)) {
      warnings.push(`Unreachable node: ${node.id}`);
    }
  });
  
  // Check for circular references
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function detectCycles(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true; // Cycle detected
    }
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const node = tree.nodes.find(n => n.id === nodeId);
    if (node && node.choices) {
      for (const choice of node.choices) {
        if (choice.nextNodeId && detectCycles(choice.nextNodeId)) {
          return true;
        }
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  if (detectCycles(tree.startNodeId)) {
    errors.push('Circular reference detected in dialogue tree');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    nodeCount: tree.nodes.length,
    reachableNodes: reachableNodes.size
  };
}

// Calculate all possible dialogue paths
function calculateAllPaths(tree: DialogueTree): any {
  const paths: string[][] = [];
  const nodeMap = new Map(tree.nodes.map(node => [node.id, node]));
  
  function findPaths(currentPath: string[], currentNodeId: string) {
    const currentPathCopy = [...currentPath, currentNodeId];
    const node = nodeMap.get(currentNodeId);
    
    if (!node) return;
    
    // If node has no choices or all choices lead nowhere, it's an end node
    if (!node.choices || node.choices.length === 0) {
      paths.push(currentPathCopy);
      return;
    }
    
    // Follow each choice
    node.choices.forEach(choice => {
      if (choice.nextNodeId) {
        findPaths(currentPathCopy, choice.nextNodeId);
      } else {
        // Choice leads to end
        paths.push([...currentPathCopy]);
      }
    });
  }
  
  findPaths([], tree.startNodeId);
  
  return {
    totalPaths: paths.length,
    paths: paths.slice(0, 100), // Limit to first 100 paths for performance
    averagePathLength: paths.reduce((sum, path) => sum + path.length, 0) / paths.length,
    longestPath: Math.max(...paths.map(path => path.length)),
    shortestPath: Math.min(...paths.map(path => path.length))
  };
}

// Generate tree statistics
function generateTreeStatistics(tree: DialogueTree): any {
  const nodeTypes = new Map<string, number>();
  const skillChecks = tree.nodes.filter(node => node.skillCheck).length;
  const choices = tree.nodes.reduce((sum, node) => sum + (node.choices?.length || 0), 0);
  
  tree.nodes.forEach(node => {
    nodeTypes.set(node.type, (nodeTypes.get(node.type) || 0) + 1);
  });
  
  return {
    totalNodes: tree.nodes.length,
    nodeTypes: Object.fromEntries(nodeTypes),
    skillChecks,
    totalChoices: choices,
    averageChoicesPerNode: choices / tree.nodes.length,
    characters: [...new Set(tree.nodes.map(node => node.speaker).filter(Boolean))],
    estimatedPlayTime: estimatePlayTime(tree)
  };
}

// Estimate play time based on text length and complexity
function estimatePlayTime(tree: DialogueTree): number {
  let totalTextLength = 0;
  let complexityMultiplier = 1;
  
  tree.nodes.forEach(node => {
    totalTextLength += node.text.length;
    if (node.skillCheck) complexityMultiplier += 0.5;
    if (node.choices && node.choices.length > 2) complexityMultiplier += 0.2;
  });
  
  // Rough estimate: 200 words per minute reading speed
  const wordsPerMinute = 200;
  const words = totalTextLength / 5; // Approximate words
  const baseMinutes = words / wordsPerMinute;
  
  return Math.round(baseMinutes * complexityMultiplier);
}

// Optimize tree structure
function optimizeTreeStructure(tree: DialogueTree): any {
  const optimizations: string[] = [];
  
  // Remove duplicate nodes with identical content
  const contentMap = new Map<string, string>();
  const duplicates: string[] = [];
  
  tree.nodes.forEach(node => {
    const contentKey = `${node.text}-${node.speaker || ''}`;
    if (contentMap.has(contentKey)) {
      duplicates.push(node.id);
      optimizations.push(`Duplicate node detected: ${node.id} (same as ${contentMap.get(contentKey)})`);
    } else {
      contentMap.set(contentKey, node.id);
    }
  });
  
  // Suggest node consolidation
  const shortNodes = tree.nodes.filter(node => node.text.length < 20);
  if (shortNodes.length > 0) {
    optimizations.push(`${shortNodes.length} very short nodes could be consolidated`);
  }
  
  return {
    suggestions: optimizations,
    duplicateNodes: duplicates,
    optimizationScore: Math.max(0, 100 - optimizations.length * 10)
  };
}

// Generate preview of dialogue flow
function generatePreview(tree: DialogueTree, maxDepth: number = 5): any {
  const nodeMap = new Map(tree.nodes.map(node => [node.id, node]));
  const preview: any = {
    nodes: [],
    connections: []
  };
  
  function buildPreview(nodeId: string, depth: number, visited: Set<string>) {
    if (depth >= maxDepth || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return;
    
    preview.nodes.push({
      id: node.id,
      type: node.type,
      speaker: node.speaker,
      text: node.text.substring(0, 100) + (node.text.length > 100 ? '...' : ''),
      position: node.position
    });
    
    if (node.choices) {
      node.choices.forEach((choice, index) => {
        preview.connections.push({
          from: nodeId,
          to: choice.nextNodeId,
          label: choice.text.substring(0, 30) + (choice.text.length > 30 ? '...' : ''),
          choiceIndex: index
        });
        
        if (choice.nextNodeId) {
          buildPreview(choice.nextNodeId, depth + 1, visited);
        }
      });
    }
  }
  
  buildPreview(tree.startNodeId, 0, new Set());
  
  return preview;
}

// Handle worker messages
self.onmessage = function(event: MessageEvent<WorkerMessage>) {
  const { type, payload, id } = event.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'PROCESS_DIALOGUE':
        result = processDialogueTree(payload.tree);
        break;
        
      case 'VALIDATE_TREE':
        result = validateDialogueTree(payload.tree);
        break;
        
      case 'CALCULATE_PATHS':
        result = calculateAllPaths(payload.tree);
        break;
        
      case 'GENERATE_PREVIEW':
        result = generatePreview(payload.tree, payload.maxDepth);
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      type: 'RESULT',
      payload: result,
      id
    } as WorkerResponse);
    
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'ERROR',
      payload: {
        message: error.message,
        stack: error.stack
      },
      id
    } as WorkerResponse);
  }
};

// Export for TypeScript
export {};
