import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// EmailOctopus configuration
const EMAILOCTOPUS_API_KEY =
  "eo_bd71e368a57da881edc1129945859046e4eeeac7c68743b2dea1e5714b573bbb";
const EMAILOCTOPUS_LIST_ID = "8a609ad8-5451-11f0-adb5-6daeb04650fb";
const EMAILOCTOPUS_BASE_URL = "https://emailoctopus.com/api/1.6";

interface EmailSubscriptionData {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

/**
 * Subscribe user to EmailOctopus list for thumbnail studio notifications
 */
export const subscribeToThumbnailNotifications = onCall(
  { cors: true },
  async (request) => {
    try {
      const { email, firstName, lastName } =
        request.data as EmailSubscriptionData;

      // Validate email
      if (!email || typeof email !== "string") {
        throw new Error("Valid email address is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Prepare subscription data for EmailOctopus
      const subscriptionData = {
        api_key: EMAILOCTOPUS_API_KEY,
        email_address: email,
        fields: {
          FirstName: firstName || "",
          LastName: lastName || "",
        },
        tags: ["thumbnail-studio-notification"],
        status: "SUBSCRIBED",
      };

      // Subscribe to EmailOctopus
      const response = await fetch(
        `${EMAILOCTOPUS_BASE_URL}/lists/${EMAILOCTOPUS_LIST_ID}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle specific EmailOctopus errors
        if (
          result.error &&
          result.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS"
        ) {
          logger.info(
            `Email ${email} already subscribed to thumbnail notifications`,
          );
          return {
            success: true,
            message: "You're already subscribed to notifications!",
            alreadySubscribed: true,
          };
        }

        logger.error("EmailOctopus API error:", result);
        throw new Error(
          result.error?.message || "Failed to subscribe to notifications",
        );
      }

      logger.info(
        `Successfully subscribed ${email} to thumbnail notifications`,
        {
          contactId: result.id,
        },
      );

      return {
        success: true,
        message: "Successfully subscribed to thumbnail studio notifications!",
        contactId: result.id,
      };
    } catch (error) {
      logger.error("Error subscribing to thumbnail notifications:", error);

      // Return user-friendly error messages
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  },
);

/**
 * Unsubscribe user from EmailOctopus list
 */
export const unsubscribeFromThumbnailNotifications = onCall(
  { cors: true },
  async (request) => {
    try {
      const { email } = request.data as { email: string };

      if (!email || typeof email !== "string") {
        throw new Error("Valid email address is required");
      }

      // Get contact by email first
      const getContactResponse = await fetch(
        `${EMAILOCTOPUS_BASE_URL}/lists/${EMAILOCTOPUS_LIST_ID}/contacts?api_key=${EMAILOCTOPUS_API_KEY}&email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        },
      );

      if (!getContactResponse.ok) {
        throw new Error("Email not found in subscription list");
      }

      const contacts = await getContactResponse.json();
      if (!contacts.data || contacts.data.length === 0) {
        throw new Error("Email not found in subscription list");
      }

      const contactId = contacts.data[0].id;

      // Unsubscribe the contact
      const unsubscribeResponse = await fetch(
        `${EMAILOCTOPUS_BASE_URL}/lists/${EMAILOCTOPUS_LIST_ID}/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: EMAILOCTOPUS_API_KEY,
            status: "UNSUBSCRIBED",
          }),
        },
      );

      if (!unsubscribeResponse.ok) {
        const error = await unsubscribeResponse.json();
        throw new Error(error.error?.message || "Failed to unsubscribe");
      }

      logger.info(
        `Successfully unsubscribed ${email} from thumbnail notifications`,
      );

      return {
        success: true,
        message:
          "Successfully unsubscribed from thumbnail studio notifications",
      };
    } catch (error) {
      logger.error("Error unsubscribing from thumbnail notifications:", error);

      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  },
);
