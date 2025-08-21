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
      
      if (options.saveToFirebase !== false && auth.currentUser) {
        try {
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
          
          console.log('✅ Content saved to Firebase:', firebaseResult.generationId);
        } catch (firebaseError) {
          console.warn('⚠️ Firebase save failed, continuing with local storage:', firebaseError);
          // Don't throw - generation succeeded even if Firebase save failed
        }
      } else {
        console.log('⏭️ Skipping Firebase save (disabled or user not authenticated)');
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
   * Save user feedback for a generation
   */
  async saveFeedback(
    generationId: string, 
    feedback: {
      rating: 'positive' | 'negative';
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
      results.textOutput = await generateTextContent({
        userInput: options.userInput,
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
        seoIntensity: options.seoIntensity
      });
    }

    // Generate image content
    if (needsImageGeneration) {
      console.log('🎨 Generating image content...');
      results.imageOutput = await generateImage({
        userInput: options.userInput,
        platform: options.platform,
        contentType: options.contentType,
        aspectRatioGuidance: options.aspectRatioGuidance,
        selectedImageStyles: options.selectedImageStyles,
        selectedImageMoods: options.selectedImageMoods,
        negativeImagePrompt: options.negativeImagePrompt
      });
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
    });

    return {
      generationId,
      storageUrls,
      storagePaths
    };
  }
}

export const firebaseIntegratedGenerationService = FirebaseIntegratedGenerationService.getInstance();
