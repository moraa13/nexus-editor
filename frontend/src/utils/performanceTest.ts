// Performance testing utilities for Nexus Adventure

export interface PerformanceTestResult {
  testName: string;
  duration: number;
  memoryUsage?: number;
  fps?: number;
  success: boolean;
  details?: string;
}

export class PerformanceTester {
  private results: PerformanceTestResult[] = [];

  async runTest(testName: string, testFn: () => Promise<void> | void): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize;

    try {
      await testFn();
      
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize;
      
      const result: PerformanceTestResult = {
        testName,
        duration: endTime - startTime,
        memoryUsage: endMemory ? endMemory - startMemory : undefined,
        success: true
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result: PerformanceTestResult = {
        testName,
        duration: performance.now() - startTime,
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      };

      this.results.push(result);
      return result;
    }
  }

  getResults(): PerformanceTestResult[] {
    return [...this.results];
  }

  clearResults(): void {
    this.results = [];
  }

  getAverageFPS(): number {
    // This would need to be implemented with actual FPS measurement
    return 60; // Placeholder
  }

  generateReport(): string {
    const results = this.getResults();
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    let report = `Performance Test Report\n`;
    report += `====================\n\n`;
    report += `Total Tests: ${results.length}\n`;
    report += `Successful: ${successful.length}\n`;
    report += `Failed: ${failed.length}\n\n`;

    if (successful.length > 0) {
      report += `Successful Tests:\n`;
      successful.forEach(result => {
        report += `- ${result.testName}: ${result.duration.toFixed(2)}ms`;
        if (result.memoryUsage) {
          report += ` (${result.memoryUsage} bytes)`;
        }
        report += `\n`;
      });
    }

    if (failed.length > 0) {
      report += `\nFailed Tests:\n`;
      failed.forEach(result => {
        report += `- ${result.testName}: ${result.details}\n`;
      });
    }

    return report;
  }
}

// Specific performance tests for Nexus Adventure
export const adventurePerformanceTests = {
  async testComponentRendering(): Promise<PerformanceTestResult> {
    const tester = new PerformanceTester();
    
    return await tester.runTest('Component Rendering', async () => {
      // Simulate rendering multiple components
      const startTime = performance.now();
      
      // This would be replaced with actual component rendering tests
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const duration = performance.now() - startTime;
      if (duration > 100) {
        throw new Error(`Rendering took too long: ${duration}ms`);
      }
    });
  },

  async testAnimationPerformance(): Promise<PerformanceTestResult> {
    const tester = new PerformanceTester();
    
    return await tester.runTest('Animation Performance', async () => {
      // Test animation smoothness
      const startTime = performance.now();
      
      // Simulate animation frame calculations
      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      
      const duration = performance.now() - startTime;
      const expectedDuration = 1000; // 60fps = ~1000ms
      
      if (duration > expectedDuration * 1.5) {
        throw new Error(`Animation performance poor: ${duration}ms for 60 frames`);
      }
    });
  },

  async testMemoryUsage(): Promise<PerformanceTestResult> {
    const tester = new PerformanceTester();
    
    return await tester.runTest('Memory Usage', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize;
      
      if (!initialMemory) {
        throw new Error('Memory API not available');
      }
      
      // Simulate memory-intensive operations
      const largeArray = new Array(10000).fill(0).map((_, i) => ({
        id: i,
        data: `item-${i}`,
        timestamp: Date.now()
      }));
      
      // Clean up
      largeArray.length = 0;
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      if (memoryIncrease > 10 * 1024 * 1024) { // 10MB threshold
        throw new Error(`Memory leak detected: ${memoryIncrease} bytes increase`);
      }
    });
  }
};

// Run all performance tests
export async function runAllPerformanceTests(): Promise<PerformanceTestResult[]> {
  const results: PerformanceTestResult[] = [];
  
  try {
    results.push(await adventurePerformanceTests.testComponentRendering());
    results.push(await adventurePerformanceTests.testAnimationPerformance());
    results.push(await adventurePerformanceTests.testMemoryUsage());
  } catch (error) {
    console.error('Performance tests failed:', error);
  }
  
  return results;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = { current: 0 };
  const lastRenderTime = { current: 0 };
  
  const startRender = () => {
    renderCount.current++;
    lastRenderTime.current = performance.now();
  };
  
  const endRender = () => {
    const renderTime = performance.now() - lastRenderTime.current;
    if (renderTime > 16) { // Log slow renders
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  };
  
  return { startRender, endRender, renderCount: renderCount.current };
}
