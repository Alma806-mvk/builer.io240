import { firebaseIntegratedGenerationService } from '../services/firebaseIntegratedGenerationService';
import { generationStorageService } from '../services/generationStorageService';
import { auth } from '../config/firebase';
import { ContentType, Platform } from '../types';

/**
 * Test Firebase saving functionality
 */
export const testFirebaseSaving = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('🧪 Starting Firebase saving test...');

    // Check authentication first
    if (!auth.currentUser) {
      return {
        success: false,
        message: 'User not authenticated. Please sign in first.',
      };
    }

    console.log('🔑 User authenticated:', auth.currentUser.email);

    // Test 1: Generate content and save to Firebase
    console.log('📝 Testing content generation and saving...');
    
    const testOptions = {
      userInput: 'Test content generation for Firebase saving verification',
      platform: Platform.YouTube,
      contentType: ContentType.Title,
      saveToFirebase: true,
    };

    const result = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage(testOptions);

    if (!result.savedToFirebase) {
      return {
        success: false,
        message: 'Content was generated but not saved to Firebase',
        details: {
          generationId: result.generationId,
          savedToFirebase: result.savedToFirebase,
        },
      };
    }

    console.log('✅ Content generated and saved to Firebase:', result.generationId);

    // Test 2: Retrieve the saved content
    console.log('📖 Testing content retrieval...');
    
    if (result.generationId) {
      const retrievedGeneration = await generationStorageService.getGeneration(result.generationId);
      
      if (!retrievedGeneration) {
        return {
          success: false,
          message: 'Content was saved but could not be retrieved',
          details: {
            generationId: result.generationId,
          },
        };
      }

      console.log('✅ Content retrieved successfully:', retrievedGeneration.id);

      // Test 3: Test feedback saving (rating system)
      console.log('👍 Testing feedback saving...');
      
      const testRating: 1 = 1; // Test positive rating
      await firebaseIntegratedGenerationService.saveFeedback(result.generationId, {
        rating: testRating,
        comment: 'Test feedback comment',
      });

      // Retrieve updated record to verify feedback was saved
      const updatedGeneration = await generationStorageService.getGeneration(result.generationId);
      
      if (!updatedGeneration?.userFeedback || updatedGeneration.userFeedback.rating !== testRating) {
        return {
          success: false,
          message: 'Feedback was not saved correctly',
          details: {
            generationId: result.generationId,
            savedFeedback: updatedGeneration?.userFeedback,
            expectedRating: testRating,
          },
        };
      }

      console.log('✅ Feedback saved and verified successfully');

      return {
        success: true,
        message: 'All Firebase saving tests passed successfully!',
        details: {
          generationId: result.generationId,
          contentSaved: true,
          feedbackSaved: true,
          rating: updatedGeneration.userFeedback.rating,
          comment: updatedGeneration.userFeedback.comment,
        },
      };
    }

    return {
      success: false,
      message: 'No generation ID returned from save operation',
    };

  } catch (error: any) {
    console.error('❌ Firebase saving test failed:', error);
    return {
      success: false,
      message: `Test failed with error: ${error.message}`,
      details: {
        error: error.message,
        stack: error.stack,
      },
    };
  }
};

/**
 * Test numerical rating system specifically
 */
export const testNumericalRatings = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        message: 'User not authenticated. Please sign in first.',
      };
    }

    console.log('🧪 Testing numerical rating system...');

    // Generate a test piece of content first
    const testOptions = {
      userInput: 'Test content for numerical rating system',
      platform: Platform.YouTube,
      contentType: ContentType.Title,
      saveToFirebase: true,
    };

    const result = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage(testOptions);

    if (!result.savedToFirebase || !result.generationId) {
      return {
        success: false,
        message: 'Could not generate content for rating test',
      };
    }

    const ratings: Array<-1 | 0 | 1> = [-1, 0, 1];
    const testResults: any[] = [];

    // Test each rating value
    for (const rating of ratings) {
      await firebaseIntegratedGenerationService.saveFeedback(result.generationId, {
        rating,
        comment: `Test comment for rating ${rating}`,
      });

      const updatedGeneration = await generationStorageService.getGeneration(result.generationId);
      
      testResults.push({
        rating,
        saved: updatedGeneration?.userFeedback?.rating === rating,
        actualValue: updatedGeneration?.userFeedback?.rating,
        type: typeof updatedGeneration?.userFeedback?.rating,
      });
    }

    const allPassed = testResults.every(r => r.saved);

    return {
      success: allPassed,
      message: allPassed 
        ? 'All numerical rating tests passed!' 
        : 'Some numerical rating tests failed',
      details: {
        testResults,
        generationId: result.generationId,
      },
    };

  } catch (error: any) {
    console.error('❌ Numerical rating test failed:', error);
    return {
      success: false,
      message: `Rating test failed: ${error.message}`,
      details: { error: error.message },
    };
  }
};

// Helper function to log test results nicely
export const logTestResults = (results: { success: boolean; message: string; details?: any }) => {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 FIREBASE SAVING TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Status: ${results.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Message: ${results.message}`);
  
  if (results.details) {
    console.log('\nDetails:');
    console.log(JSON.stringify(results.details, null, 2));
  }
  console.log('='.repeat(50) + '\n');
};
