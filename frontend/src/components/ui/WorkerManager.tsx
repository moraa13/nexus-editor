import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from './SimpleToast';
import type { DialogueTree } from '../../types/discoElysium';

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

interface WorkerContextType {
  isSupported: boolean;
  isProcessing: boolean;
  processDialogue: (tree: DialogueTree) => Promise<any>;
  validateTree: (tree: DialogueTree) => Promise<any>;
  calculatePaths: (tree: DialogueTree) => Promise<any>;
  generatePreview: (tree: DialogueTree, maxDepth?: number) => Promise<any>;
}

const WorkerContext = createContext<WorkerContextType | null>(null);

export function useWorker() {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within WorkerProvider');
  }
  return context;
}

interface WorkerProviderProps {
  children: React.ReactNode;
}

export default function WorkerProvider({ children }: WorkerProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, { resolve: Function; reject: Function }>>(new Map());

  // Check if Web Workers are supported
  useEffect(() => {
    setIsSupported(typeof Worker !== 'undefined');
  }, []);

  // Initialize worker
  useEffect(() => {
    if (!isSupported) return;

    try {
      // Create worker
      workerRef.current = new Worker(
        new URL('../../workers/dialogueProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Handle worker messages
      workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { type, payload, id } = event.data;
        const pendingRequest = pendingRequests.current.get(id);

        if (pendingRequest) {
          pendingRequests.current.delete(id);

          if (type === 'RESULT') {
            pendingRequest.resolve(payload);
          } else if (type === 'ERROR') {
            pendingRequest.reject(new Error(payload.message));
          }
        }

        // Check if all requests are complete
        if (pendingRequests.current.size === 0) {
          setIsProcessing(false);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        toast.error('Background processing failed');
        setIsProcessing(false);
      };

      console.log('✅ Web Worker initialized');

    } catch (error) {
      console.error('❌ Failed to initialize Web Worker:', error);
      setIsSupported(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [isSupported]);

  // Send message to worker
  const sendMessage = (message: WorkerMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not available'));
        return;
      }

      const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store pending request
      pendingRequests.current.set(id, { resolve, reject });
      
      // Set processing state
      if (!isProcessing) {
        setIsProcessing(true);
      }

      // Send message
      workerRef.current.postMessage({ ...message, id });

      // Timeout after 30 seconds
      setTimeout(() => {
        const pendingRequest = pendingRequests.current.get(id);
        if (pendingRequest) {
          pendingRequests.current.delete(id);
          pendingRequest.reject(new Error('Worker timeout'));
          
          if (pendingRequests.current.size === 0) {
            setIsProcessing(false);
          }
        }
      }, 30000);
    });
  };

  // Process dialogue tree
  const processDialogue = async (tree: DialogueTree): Promise<any> => {
    try {
      const result = await sendMessage({
        type: 'PROCESS_DIALOGUE',
        payload: { tree },
        id: ''
      });
      
      toast.success('Dialogue processed successfully');
      return result;
    } catch (error) {
      toast.error('Failed to process dialogue');
      throw error;
    }
  };

  // Validate dialogue tree
  const validateTree = async (tree: DialogueTree): Promise<any> => {
    try {
      const result = await sendMessage({
        type: 'VALIDATE_TREE',
        payload: { tree },
        id: ''
      });
      
      return result;
    } catch (error) {
      toast.error('Failed to validate dialogue tree');
      throw error;
    }
  };

  // Calculate dialogue paths
  const calculatePaths = async (tree: DialogueTree): Promise<any> => {
    try {
      const result = await sendMessage({
        type: 'CALCULATE_PATHS',
        payload: { tree },
        id: ''
      });
      
      return result;
    } catch (error) {
      toast.error('Failed to calculate dialogue paths');
      throw error;
    }
  };

  // Generate dialogue preview
  const generatePreview = async (tree: DialogueTree, maxDepth: number = 5): Promise<any> => {
    try {
      const result = await sendMessage({
        type: 'GENERATE_PREVIEW',
        payload: { tree, maxDepth },
        id: ''
      });
      
      return result;
    } catch (error) {
      toast.error('Failed to generate dialogue preview');
      throw error;
    }
  };

  const contextValue: WorkerContextType = {
    isSupported,
    isProcessing,
    processDialogue,
    validateTree,
    calculatePaths,
    generatePreview
  };

  return (
    <WorkerContext.Provider value={contextValue}>
      {children}
      
      {/* Processing indicator */}
      {isProcessing && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </WorkerContext.Provider>
  );
}

// Hook for dialogue processing with loading states
export function useDialogueProcessor() {
  const worker = useWorker();
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const process = async (tree: DialogueTree) => {
    try {
      setError(null);
      const result = await worker.processDialogue(tree);
      setResults(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const validate = async (tree: DialogueTree) => {
    try {
      setError(null);
      const result = await worker.validateTree(tree);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const calculatePaths = async (tree: DialogueTree) => {
    try {
      setError(null);
      const result = await worker.calculatePaths(tree);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const generatePreview = async (tree: DialogueTree, maxDepth?: number) => {
    try {
      setError(null);
      const result = await worker.generatePreview(tree, maxDepth);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    isSupported: worker.isSupported,
    isProcessing: worker.isProcessing,
    results,
    error,
    process,
    validate,
    calculatePaths,
    generatePreview
  };
}
