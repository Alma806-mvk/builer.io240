const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // You might need to install this: npm install node-fetch

const app = express();
const PORT = process.env.PORT || 3001;

// EmailOctopus configuration
const EMAILOCTOPUS_API_KEY =
  "eo_bd71e368a57da881edc1129945859046e4eeeac7c68743b2dea1e5714b573bbb";
const EMAILOCTOPUS_LIST_ID = "8a609ad8-5451-11f0-adb5-6daeb04650fb";
const EMAILOCTOPUS_BASE_URL = "https://emailoctopus.com/api/1.6";

app.use(cors());
app.use(express.json());

// EmailOctopus subscription endpoint
app.post("/subscribe", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email address is required",
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Prepare data for EmailOctopus
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

    console.log("Subscribing to EmailOctopus:", { email, firstName, lastName });

    // Call EmailOctopus API
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
        console.log(`Email ${email} already subscribed`);
        return res.json({
          success: true,
          message: "You're already subscribed to notifications!",
          alreadySubscribed: true,
        });
      }

      console.error("EmailOctopus API error:", result);
      return res.status(400).json({
        success: false,
        error: result.error?.message || "Failed to subscribe to notifications",
      });
    }

    console.log(`Successfully subscribed ${email} to EmailOctopus`, {
      contactId: result.id,
    });

    return res.json({
      success: true,
      message: "Successfully subscribed to thumbnail studio notifications!",
      contactId: result.id,
    });
  } catch (error) {
    console.error("Subscription error:", error);

    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again.",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`EmailOctopus server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Subscribe endpoint: http://localhost:${PORT}/subscribe`);
});
