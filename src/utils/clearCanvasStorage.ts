// Utility to clear canvas localStorage and restore demo items
export const clearCanvasStorage = () => {
  const keysToRemove = [
    'socialContentAIStudio_canvasItems_v11',
    'socialContentAIStudio_canvasHistory_v4',
    'socialContentAIStudio_canvasView_v4',
    'socialContentAIStudio_canvasSnapshots_v2'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Cleared: ${key}`);
  });
  
  console.log('Canvas localStorage cleared. Refresh page to see demo items.');
  
  // Auto-refresh the page
  window.location.reload();
};

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).clearCanvasStorage = clearCanvasStorage;
}

export default clearCanvasStorage;
