import { generateTextContent, generateImage } from '../../services/geminiService';
import { firebaseStorageService } from './firebaseStorageService';
import { generationStorageService, GenerationRecord } from './generationStorageService';
import { 
  GeneratedTextOutput, 
  GeneratedImageOutput, 
  ContentType, 
  Platform, 
  Language, 
  AiPersona,
  HistoryItem
} from '../types';
import { auth } from '../config/firebase';

export interface GenerationOptions {
  // Core generation parameters
  userInput: string;
  platform: Platform;
  contentType: ContentType;
  targetAudience?: string;
  batchVariations?: number;
  
  // Advanced configuration
  aiPersona?: AiPersona;
  aiPersonaId?: string;
  targetLanguage?: Language;
  videoLength?: string;
  customVideoLength?: string;
  
  // SEO settings
  seoKeywords?: string;
  seoMode?: string;
  seoIntensity?: string;
  
  // Image generation settings
  aspectRatioGuidance?: string;
  selectedImageStyles?: string[];
  selectedImageMoods?: string[];
  negativeImagePrompt?: string;
  
  // Storage options
  saveToFirebase?: boolean;
  generateThumbnail?: boolean;
}

export interface FirebaseGenerationResult {
  // Core generation results
  textOutput?: GeneratedTextOutput;
  imageOutput?: GeneratedImageOutput;

  // Firebase storage information
  generationId?: string;
  storageUrls?: {
    textContent?: string;
    imageContent?: string;
    thumbnailContent?: string;
  };

  // Enhanced HistoryItem with Firebase integration
  historyItem: HistoryItem;

  // Generation metadata
  generationDuration: number;
  savedToFirebase: boolean;
}

// Legacy format result for App.tsx compatibility
export interface LegacyGenerationResult {
  text: string;
  sources?: any[];
  responseMimeType?: string;
}

export class FirebaseIntegratedGenerationService {
  private static instance: FirebaseIntegratedGenerationService;

  static getInstance(): FirebaseIntegratedGenerationService {
    if (!FirebaseIntegratedGenerationService.instance) {
      FirebaseIntegratedGenerationService.instance = new FirebaseIntegratedGenerationService();
    }
    return FirebaseIntegratedGenerationService.instance;
  }

  /**
   * Generate content and automatically save to Firebase if user is authenticated
   */
  async generateContentWithFirebaseStorage(options: GenerationOptions): Promise<FirebaseGenerationResult> {
    const startTime = Date.now();
    const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🚀 Starting Firebase-integrated generation:', {
      contentType: options.contentType,
      platform: options.platform,
      saveToFirebase: options.saveToFirebase,
      generationId
    });

    try {
      // Step 1: Generate content using existing geminiService
      const generationResults = await this.generateContent(options);
      
      // Step 2: Create base HistoryItem
      const historyItem = this.createHistoryItem(options, generationResults, generationId);
      
      // Step 3: Save to Firebase if enabled and user is authenticated
      let savedToFirebase = false;
      let storageUrls: any = {};

      // Enhanced debugging for Firebase save process
      console.log('🔍 Firebase Save Debug Info:', {
        saveToFirebase: options.saveToFirebase,
        userAuthenticated: !!auth.currentUser,
        userEmail: auth.currentUser?.email,
        offlineMode: localStorage.getItem("firebase_offline_mode"),
        generationId: generationId
      });

      if (options.saveToFirebase !== false && auth.currentUser) {
        try {
          console.log('🚀 Attempting to save to Firebase...');
          const firebaseResult = await this.saveToFirebase(
            generationResults,
            options,
            generationId
          );
          savedToFirebase = true;
          storageUrls = firebaseResult.storageUrls;

          // Update HistoryItem with Firebase information
          historyItem.firebase = {
            generationId: firebaseResult.generationId,
            storageUrls: firebaseResult.storageUrls,
            storagePaths: firebaseResult.storagePaths,
            savedToFirebase: true,
            lastSyncedAt: Date.now()
          };

          console.log('✅ Content saved to Firebase successfully:', {
            generationId: firebaseResult.generationId,
            storageUrls: firebaseResult.storageUrls
          });
        } catch (firebaseError) {
          console.error('❌ Firebase save failed with error:', firebaseError);
          console.warn('⚠️ Firebase save failed, continuing with local storage:', firebaseError);
          // Don't throw - generation succeeded even if Firebase save failed
        }
      } else {
        if (!auth.currentUser) {
          console.log('⏭️ Skipping Firebase save - User not authenticated');
        } else if (options.saveToFirebase === false) {
          console.log('⏭️ Skipping Firebase save - Disabled by options');
        } else {
          console.log('⏭️ Skipping Firebase save - Unknown reason');
        }
      }

      const generationDuration = Date.now() - startTime;

      return {
        textOutput: generationResults.textOutput,
        imageOutput: generationResults.imageOutput,
        generationId,
        storageUrls,
        historyItem,
        generationDuration,
        savedToFirebase
      };

    } catch (error) {
      console.error('❌ Generation failed:', error);
      throw error;
    }
  }

  /**
   * Simple wrapper that calls original generateTextContent and saves to Firebase in background
   * This preserves 100% compatibility with existing code while adding Firebase storage
   */
  async generateTextContentWithFirebaseBackgroundSave(textGenOptions: any): Promise<LegacyGenerationResult> {
    console.log('🔥 Generating text content (Firebase save will happen after output is processed)');

    try {
      // Call original generateTextContent function - this ensures 100% compatibility
      const result = await generateTextContent(textGenOptions);

      // Note: Firebase saving is now deferred until output is fully processed
      // This will be handled by calling saveCompletedGeneration() after the output is ready
      console.log('✅ Text generation completed, Firebase save will happen after output processing');

      // Return original result unchanged
      return result;

    } catch (error) {
      console.error('❌ Firebase background generation failed:', error);
      throw error;
    }
  }

  /**
   * Save a completed generation with full output to Firebase
   * This should be called AFTER the output is generated and processed
   */
  async saveCompletedGeneration(
    textGenOptions: any,
    generatedOutput: any,
    generationDuration: number = 0
  ): Promise<string> {
    if (!auth.currentUser) {
      console.log('⏭️ Skipping Firebase save - User not authenticated');
      return '';
    }

    try {
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('💾 Saving completed generation to Firebase:', {
        generationId,
        contentType: textGenOptions.contentType,
        hasOutput: !!generatedOutput
      });

      // Create complete generation record with actual output
      const generationRecord = {
        prompt: textGenOptions.userInput,
        platform: textGenOptions.platform,
        contentType: textGenOptions.contentType,
        targetAudience: textGenOptions.targetAudience,
        batchVariations: textGenOptions.batchVariations,
        aiPersonaId: textGenOptions.aiPersonaId,
        targetLanguage: textGenOptions.targetLanguage,
        videoLength: textGenOptions.videoLength,
        seoKeywords: textGenOptions.seoKeywords,
        seoMode: textGenOptions.seoMode,
        aspectRatioGuidance: textGenOptions.aspectRatioGuidance,

        // Store the actual generated output
        generatedOutput: generatedOutput,
        outputText: typeof generatedOutput === 'object' && generatedOutput.content
          ? generatedOutput.content
          : typeof generatedOutput === 'string'
            ? generatedOutput
            : JSON.stringify(generatedOutput),

        storageUrls: {},
        storagePaths: {},
        generationDuration,
        outputSize: JSON.stringify(generatedOutput).length,

        // Add metadata
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      // Save to Firestore
      await generationStorageService.saveGeneration(generationRecord, generationId);
      console.log('✅ Completed generation saved to Firebase:', generationId);

      return generationId;
    } catch (error) {
      console.error('❌ Failed to save completed generation:', error);
      return '';
    }
  }

  /**
   * Save user feedback for a generation
   */
  async saveFeedback(
    generationId: string,
    feedback: {
      rating: -1 | 0 | 1; // -1 = negative, 0 = neutral/no rating, 1 = positive
      comment?: string;
    }
  ): Promise<void> {
    if (!auth.currentUser) {
      console.warn('User not authenticated - feedback will not be saved');
      return;
    }

    try {
      await generationStorageService.updateFeedback(generationId, feedback);
      console.log('✅ Feedback saved:', { generationId, rating: feedback.rating });
    } catch (error) {
      console.error('❌ Failed to save feedback:', error);
      throw error;
    }
  }

  /**
   * Get user's generation history from Firebase
   */
  async getGenerationHistory(limit: number = 50): Promise<GenerationRecord[]> {
    if (!auth.currentUser) {
      return [];
    }

    try {
      return await generationStorageService.getUserGenerations(limit);
    } catch (error) {
      console.error('❌ Failed to fetch generation history:', error);
      return [];
    }
  }

  /**
   * Mark a generation as favorite
   */
  async toggleFavorite(generationId: string, isFavorite: boolean): Promise<void> {
    if (!auth.currentUser) {
      console.warn('User not authenticated - favorite status will not be saved');
      return;
    }

    try {
      await generationStorageService.updateGenerationMetadata(generationId, { isFavorite });
      console.log('✅ Favorite status updated:', { generationId, isFavorite });
    } catch (error) {
      console.error('❌ Failed to update favorite status:', error);
      throw error;
    }
  }

  /**
   * Private method: Generate content using existing geminiService
   */
  private async generateContent(options: GenerationOptions): Promise<{
    textOutput?: GeneratedTextOutput;
    imageOutput?: GeneratedImageOutput;
  }> {
    const results: any = {};

    // Determine what type of content to generate
    const needsTextGeneration = [
      'Script', 'Content Idea', 'Title/Headline', 'Video Hook', 
      'Content Brief', 'Polls & Quizzes', 'Micro-Video Script',
      'Content Strategy Plan', 'Hashtags', 'Snippets'
    ].includes(options.contentType);

    const needsImageGeneration = [
      'Generate Image', 'Image Prompt (for AI)', 'Thumbnail Concept (Visuals & Text)'
    ].includes(options.contentType);

    // Generate text content
    if (needsTextGeneration) {
      console.log('🤖 Generating text content...');
      const textResult = await generateTextContent({
        userInput: options.userInput,
        platform: options.platform,
        contentType: options.contentType,
        targetAudience: options.targetAudience,
        batchVariations: options.batchVariations,
        aiPersonaDef: options.aiPersona,
        aiPersonaId: options.aiPersonaId,
        targetLanguage: options.targetLanguage,
        videoLength: options.videoLength,
        customVideoLength: options.customVideoLength,
        seoKeywords: options.seoKeywords,
        seoMode: options.seoMode,
        seoIntensity: options.seoIntensity
      });

      // Convert to GeneratedTextOutput format
      results.textOutput = {
        type: "text",
        content: textResult.text,
        groundingSources: textResult.sources,
      } as GeneratedTextOutput;

      // Also keep the raw result for App.tsx compatibility
      results.rawTextResult = textResult;
    }

    // Generate image content
    if (needsImageGeneration) {
      console.log('🎨 Generating image content...');
      const imageResult = await generateImage(
        options.userInput,
        options.negativeImagePrompt,
        options.aspectRatioGuidance,
      );

      results.imageOutput = {
        type: "image",
        base64Data: imageResult.base64Data,
        mimeType: imageResult.mimeType,
      } as GeneratedImageOutput;

      // Also keep the raw result for App.tsx compatibility
      results.rawImageResult = imageResult;
    }

    return results;
  }

  /**
   * Private method: Create HistoryItem from generation results
   */
  private createHistoryItem(
    options: GenerationOptions, 
    results: any, 
    generationId: string
  ): HistoryItem {
    return {
      id: generationId,
      timestamp: Date.now(),
      contentType: options.contentType as any,
      userInput: options.userInput,
      output: results.textOutput || results.imageOutput,
      targetAudience: options.targetAudience,
      batchVariations: options.batchVariations,
      aiPersona: options.aiPersona,
      aiPersonaId: options.aiPersonaId,
      targetLanguage: options.targetLanguage,
      videoLength: options.videoLength,
      customVideoLength: options.customVideoLength,
      isFavorite: false
    };
  }

  /**
   * Private method: Save generated content to Firebase
   */
  private async saveToFirebase(
    results: any, 
    options: GenerationOptions, 
    generationId: string
  ): Promise<{
    generationId: string;
    storageUrls: any;
    storagePaths: any;
  }> {
    const storageUrls: any = {};
    const storagePaths: any = {};

    // Upload text content if available
    if (results.textOutput) {
      const textUploadResult = await firebaseStorageService.uploadGeneratedContent(
        JSON.stringify(results.textOutput, null, 2),
        {
          contentType: options.contentType,
          generationId,
          outputType: 'text'
        }
      );
      storageUrls.textContent = textUploadResult.url;
      storagePaths.textContent = textUploadResult.path;
    }

    // Upload image content if available
    if (results.imageOutput && results.imageOutput.base64Data) {
      const imageUploadResult = await firebaseStorageService.uploadGeneratedContent(
        results.imageOutput.base64Data,
        {
          contentType: options.contentType,
          generationId,
          outputType: 'image'
        }
      );
      storageUrls.imageContent = imageUploadResult.url;
      storagePaths.imageContent = imageUploadResult.path;
    }

    // Save generation record to Firestore
    console.log('💾 Saving generation record to Firestore...', {
      generationId,
      prompt: options.userInput?.substring(0, 50) + '...',
      contentType: options.contentType,
      platform: options.platform
    });

    await generationStorageService.saveGeneration({
      prompt: options.userInput,
      platform: options.platform,
      contentType: options.contentType,
      targetAudience: options.targetAudience,
      batchVariations: options.batchVariations,
      aiPersona: options.aiPersona,
      aiPersonaId: options.aiPersonaId,
      targetLanguage: options.targetLanguage,
      videoLength: options.videoLength,
      customVideoLength: options.customVideoLength,
      seoKeywords: options.seoKeywords,
      seoMode: options.seoMode,
      seoIntensity: options.seoIntensity,
      aspectRatioGuidance: options.aspectRatioGuidance,
      selectedImageStyles: options.selectedImageStyles,
      selectedImageMoods: options.selectedImageMoods,
      negativeImagePrompt: options.negativeImagePrompt,
      storageUrls,
      storagePaths,
      generationDuration: 0, // Will be updated later
      outputSize: JSON.stringify(results).length
    }, generationId);

    console.log('✅ Generation record saved to Firestore successfully');

    return {
      generationId,
      storageUrls,
      storagePaths
    };
  }
}

export const firebaseIntegratedGenerationService = FirebaseIntegratedGenerationService.getInstance();
