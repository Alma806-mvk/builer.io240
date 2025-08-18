/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Export Stripe functions
export {
  createCheckoutSession,
  createPortalSession,
  stripeWebhook,
} from "./stripe";

// Export EmailOctopus functions
export {
  subscribeToThumbnailNotifications,
  unsubscribeFromThumbnailNotifications,
} from "./emailOctopus";

// Export YouTube Channel Pulse functions
export {
  dailyYouTubeAnalyticsSync,
  triggerYouTubeAnalyticsSync,
  getYouTubePulseData,
  getYouTubeHistoricalData,
} from "./youtubeChannelPulse";

// Export YouTube OAuth functions
export {
  getAuthUrl,
  oauthCallback,
} from "./youtubeOAuth";

// Export Daily Trends functions
export {
  fetchDailyTrends,
  triggerDailyTrends,
} from "./dailyTrends";

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
