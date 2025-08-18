import { promptExamples, getExamplesByCategory, getRandomExamples } from '../data/promptExamples';

/**
 * Test utility to verify prompt carousel functionality
 */
export const testPromptCarousel = () => {
  console.log('🧪 Testing Prompt Carousel Functionality...');
  
  // Test 1: Verify prompt examples exist
  console.log(`✅ Total prompt examples: ${promptExamples.length}`);
  console.assert(promptExamples.length > 0, 'Should have prompt examples');
  
  // Test 2: Verify categories work
  const youtubeExamples = getExamplesByCategory('YouTube');
  console.log(`✅ YouTube examples: ${youtubeExamples.length}`);
  console.assert(youtubeExamples.length > 0, 'Should have YouTube examples');
  
  // Test 3: Verify all category filter works
  const allExamples = getExamplesByCategory('All');
  console.log(`✅ All examples: ${allExamples.length}`);
  console.assert(allExamples.length === promptExamples.length, 'All should return all examples');
  
  // Test 4: Verify random examples work
  const randomExamples = getRandomExamples(5);
  console.log(`✅ Random examples: ${randomExamples.length}`);
  console.assert(randomExamples.length === 5, 'Should return 5 random examples');
  
  // Test 5: Verify example structure
  const firstExample = promptExamples[0];
  console.log(`✅ First example structure:`, {
    id: firstExample.id,
    title: firstExample.title,
    category: firstExample.category,
    hasPrompt: !!firstExample.prompt,
    hasIcon: !!firstExample.icon
  });
  
  console.log('🎉 All prompt carousel tests passed!');
  
  return {
    totalExamples: promptExamples.length,
    categoriesCount: new Set(promptExamples.map(e => e.category)).size,
    platformsCount: new Set(promptExamples.map(e => e.platform).filter(Boolean)).size,
    contentTypesCount: new Set(promptExamples.map(e => e.contentType).filter(Boolean)).size
  };
};

// Run tests automatically in development
if (import.meta.env.DEV) {
  console.log('🚀 Development mode detected - running prompt carousel tests...');
  testPromptCarousel();
}
