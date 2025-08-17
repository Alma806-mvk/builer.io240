import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export interface FeedbackSubmission {
  type: "bug" | "suggestion" | "question" | "other";
  message: string;
  email?: string;
  userAgent: string;
  url: string;
  timestamp: any;
  userId?: string;
}

export class FeedbackService {
  static async submitFeedback(
    feedback: Omit<FeedbackSubmission, "timestamp" | "userAgent" | "url">,
  ) {
    try {
      const feedbackData: FeedbackSubmission = {
        ...feedback,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const docRef = await addDoc(collection(db, "feedback"), feedbackData);

      console.log("Feedback submitted successfully with ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return { success: false, error: error };
    }
  }

  static async submitBugReport(
    message: string,
    email?: string,
    userId?: string,
  ) {
    return this.submitFeedback({
      type: "bug",
      message,
      email,
      userId,
    });
  }

  static async submitFeatureRequest(
    message: string,
    email?: string,
    userId?: string,
  ) {
    return this.submitFeedback({
      type: "suggestion",
      message,
      email,
      userId,
    });
  }

  static async submitQuestion(
    message: string,
    email?: string,
    userId?: string,
  ) {
    return this.submitFeedback({
      type: "question",
      message,
      email,
      userId,
    });
  }
}
