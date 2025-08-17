import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin if not already initialized
try {
  initializeApp();
} catch (e) {
  // App already initialized
}

const db = getFirestore();

// Environment variables for YouTube OAuth
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Generate the Google OAuth authorization URL for YouTube access
 */
export const getAuthUrl = onRequest(
  {
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (request, response) => {
    logger.info("YouTube OAuth URL generation requested");

    try {
      // Validate required environment variables
      if (!YOUTUBE_CLIENT_ID) {
        logger.error("YOUTUBE_CLIENT_ID environment variable not set");
        response.status(500).json({
          error: "YouTube client ID not configured",
        });
        return;
      }

      // Get the user ID from the request (should be passed from frontend)
      const {uid} = request.body;
      if (!uid) {
        response.status(400).json({
          error: "User ID is required",
        });
        return;
      }

      // Construct the OAuth callback URL
      const baseUrl = request.get("origin") ||
        "https://us-central1-final-c054b.cloudfunctions.net";
      const redirectUri = `${baseUrl}/oauthCallback`;

      // Generate a secure state parameter to prevent CSRF attacks
      const state = Buffer.from(JSON.stringify({
        uid,
        timestamp: Date.now(),
      })).toString("base64");

      // Construct the Google OAuth URL
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append("client_id", YOUTUBE_CLIENT_ID);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("scope",
        "https://www.googleapis.com/auth/youtube.readonly " +
        "https://www.googleapis.com/auth/yt-analytics.readonly");
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");
      authUrl.searchParams.append("state", state);

      logger.info(`Generated OAuth URL for user ${uid}`);

      response.json({
        authUrl: authUrl.toString(),
        redirectUri,
      });
    } catch (error) {
      logger.error("Error generating OAuth URL:", error);
      response.status(500).json({
        error: "Failed to generate authorization URL",
      });
    }
  }
);

/**
 * Handle the OAuth callback from Google after user grants consent
 */
export const oauthCallback = onRequest(
  {
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (request, response) => {
    logger.info("YouTube OAuth callback received");

    try {
      // Validate required environment variables
      if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
        logger.error("YouTube OAuth credentials not configured");
        response.status(500).send(`
          <html>
            <body>
              <h1>Configuration Error</h1>
              <p>YouTube OAuth is not properly configured.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      // Extract parameters from the callback
      const {code, state, error} = request.query;

      // Check for OAuth errors
      if (error) {
        logger.error("OAuth error:", error);
        response.status(400).send(`
          <html>
            <body>
              <h1>Authorization Failed</h1>
              <p>Error: ${error}</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        logger.error("Missing required OAuth parameters");
        response.status(400).send(`
          <html>
            <body>
              <h1>Invalid Request</h1>
              <p>Missing authorization code or state parameter.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      // Decode and validate the state parameter
      let stateData;
      try {
        stateData = JSON.parse(
          Buffer.from(state as string, "base64").toString()
        );
      } catch (err) {
        logger.error("Invalid state parameter:", err);
        response.status(400).send(`
          <html>
            <body>
              <h1>Invalid State</h1>
              <p>The state parameter is invalid or corrupted.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      const {uid, timestamp} = stateData;

      // Check state timestamp (should be within 10 minutes for security)
      const now = Date.now();
      const maxAge = 10 * 60 * 1000; // 10 minutes
      if (now - timestamp > maxAge) {
        logger.error("OAuth state parameter has expired");
        response.status(400).send(`
          <html>
            <body>
              <h1>Session Expired</h1>
              <p>The authorization session has expired. Please try again.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      // Exchange authorization code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: YOUTUBE_CLIENT_ID,
          client_secret: YOUTUBE_CLIENT_SECRET,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: `${request.get("origin") ||
            "https://us-central1-final-c054b.cloudfunctions.net"
          }/oauthCallback`,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        logger.error("Failed to exchange authorization code:", errorText);
        response.status(500).send(`
          <html>
            <body>
              <h1>Token Exchange Failed</h1>
              <p>Failed to exchange authorization code for tokens.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      const tokens: OAuthTokenResponse = await tokenResponse.json();

      // Validate that we received a refresh token
      if (!tokens.refresh_token) {
        logger.error("No refresh token received from Google");
        response.status(500).send(`
          <html>
            <body>
              <h1>Authorization Incomplete</h1>
              <p>No refresh token received. Please try again and ensure you
              grant all requested permissions.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        return;
      }

      // Save the refresh token to the user's Firestore document
      await db.collection("users").doc(uid).update({
        youtube_refresh_token: tokens.refresh_token,
        youtube_connected_at: new Date(),
        youtube_scopes: tokens.scope,
      });

      logger.info(`Successfully saved YouTube refresh token for user ${uid}`);

      // Send success response with auto-close script
      response.send(`
        <html>
          <head>
            <title>YouTube Connected</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                  Roboto, sans-serif;
                text-align: center;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 400px;
              }
              h1 {
                margin: 0 0 20px 0;
                font-size: 2em;
              }
              p {
                font-size: 1.1em;
                line-height: 1.5;
                margin: 0;
              }
              .success-icon {
                font-size: 4em;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">✅</div>
              <h1>YouTube Connected!</h1>
              <p>Your YouTube channel has been successfully connected.
              This window will close automatically.</p>
            </div>
            <script>
              // Send success message to parent window if opened in popup
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'YOUTUBE_OAUTH_SUCCESS',
                  uid: '${uid}'
                }, '*');
              }
              
              // Close window after 3 seconds
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      logger.error("Error in OAuth callback:", error);
      response.status(500).send(`
        <html>
          <body>
            <h1>Error</h1>
            <p>An unexpected error occurred during authorization.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `);
    }
  }
);
