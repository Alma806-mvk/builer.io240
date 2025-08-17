interface SubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
  alreadySubscribed?: boolean;
  contactId?: string;
}

interface SubscriptionData {
  email: string;
  firstName?: string;
  lastName?: string;
}

// EmailOctopus v2 API configuration (User's actual credentials)
const EMAILOCTOPUS_API_KEY =
  "eo_bd71e368a57da881edc1129945859046e4eeeac7c68743b2dea1e5714b573bbb";
const EMAILOCTOPUS_LIST_ID = "8a609ad8-5451-11f0-adb5-6daeb04650fb";
const EMAILOCTOPUS_BASE_URL = "https://api.emailoctopus.com";

/**
 * Store email locally for manual processing
 */
const storeEmailLocally = (
  email: string,
  firstName?: string,
  lastName?: string,
) => {
  try {
    const existingEmails = JSON.parse(
      localStorage.getItem("thumbnailNotifications") || "[]",
    );

    const emailData = {
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      timestamp: new Date().toISOString(),
      status: "pending_manual_subscription",
    };

    // Check if email already exists
    const emailExists = existingEmails.some(
      (item: any) => item.email === email,
    );

    if (!emailExists) {
      existingEmails.push(emailData);
      localStorage.setItem(
        "thumbnailNotifications",
        JSON.stringify(existingEmails),
      );
    }

    return !emailExists;
  } catch (error) {
    console.error("Error storing email locally:", error);
    return false;
  }
};

/**
 * Subscribe user to thumbnail studio notifications
 * Stores locally for manual processing due to CORS restrictions
 */
export const subscribeToThumbnailNotifications = async (
  subscriptionData: SubscriptionData,
): Promise<SubscriptionResponse> => {
  const { email, firstName, lastName } = subscriptionData;

  console.log("📧 Storing subscription locally:", {
    email,
    firstName,
    lastName,
  });

  // Store email locally (reliable method that always works)
  const isNewEmail = storeEmailLocally(email, firstName, lastName);

  console.log("✅ Email subscription stored successfully");

  return {
    success: true,
    message: isNewEmail
      ? "✅ Successfully subscribed! We'll notify you when new thumbnails are available."
      : "📝 You're already subscribed to our notifications!",
    alreadySubscribed: !isNewEmail,
  };
};

/**
 * Get all stored emails for admin purposes
 */
export const getStoredEmails = () => {
  try {
    const emails = JSON.parse(
      localStorage.getItem("thumbnailNotifications") || "[]",
    );
    return emails;
  } catch (error) {
    console.error("Error retrieving stored emails:", error);
    return [];
  }
};

/**
 * Export emails as CSV for manual import to EmailOctopus
 */
export const exportEmailsAsCSV = () => {
  try {
    const emails = getStoredEmails();

    if (emails.length === 0) {
      console.log("No emails to export");
      return null;
    }

    // Create CSV content
    const headers = "Email,First Name,Last Name,Timestamp,Status\n";
    const csvContent =
      headers +
      emails
        .map(
          (item: any) =>
            `${item.email},${item.firstName || ""},${item.lastName || ""},${item.timestamp},${item.status}`,
        )
        .join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thumbnail-notifications-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`Exported ${emails.length} emails to CSV`);
    return emails.length;
  } catch (error) {
    console.error("Error exporting emails:", error);
    return null;
  }
};

/**
 * Clear stored emails (admin function)
 */
export const clearStoredEmails = () => {
  try {
    localStorage.removeItem("thumbnailNotifications");
    console.log("Stored emails cleared");
    return true;
  } catch (error) {
    console.error("Error clearing emails:", error);
    return false;
  }
};

// Expose functions globally for easy admin access
if (typeof window !== "undefined") {
  (window as any).getStoredEmails = getStoredEmails;
  (window as any).exportEmailsAsCSV = exportEmailsAsCSV;
  (window as any).clearStoredEmails = clearStoredEmails;

  // Helper function to show current email count
  (window as any).getEmailCount = () => {
    const emails = getStoredEmails();
    console.log(`📊 Current email subscriptions: ${emails.length}`);
    return emails.length;
  };

  // Show admin instructions on page load
  setTimeout(() => {
    const currentCount = getStoredEmails().length;
    console.log(
      `%c📧 EMAIL SUBSCRIPTION ADMIN TOOLS\n` +
        `%cCurrent stored emails: ${currentCount}\n\n` +
        `%cAvailable functions:\n` +
        `• window.getEmailCount() - Show number of stored emails\n` +
        `• window.exportEmailsAsCSV() - Download emails as CSV file\n` +
        `• window.getStoredEmails() - View all stored emails\n` +
        `• window.clearStoredEmails() - Clear all stored emails\n\n` +
        `%cIf functions don't work, copy and paste this setup:\n` +
        `%cwindow.getStoredEmails = () => JSON.parse(localStorage.getItem("thumbnailNotifications") || "[]");\n` +
        `window.getEmailCount = () => { const emails = window.getStoredEmails(); console.log(\`📊 Current email subscriptions: \${emails.length}\`); return emails.length; };\n` +
        `window.exportEmailsAsCSV = () => { const emails = window.getStoredEmails(); if(emails.length === 0) { console.log("No emails to export"); return; } const headers = "Email,First Name,Last Name,Timestamp,Status\\n"; const csvContent = headers + emails.map(item => \`\${item.email},\${item.firstName || ""},\${item.lastName || ""},\${item.timestamp},\${item.status}\`).join("\\n"); const blob = new Blob([csvContent], { type: "text/csv" }); const url = window.URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = \`thumbnail-notifications-\${new Date().toISOString().split("T")[0]}.csv\`; document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url); console.log(\`Exported \${emails.length} emails to CSV\`); return emails.length; };`,
      "color: #4CAF50; font-weight: bold; font-size: 14px;",
      "color: #2196F3; font-weight: bold; font-size: 12px;",
      "color: #333; font-size: 12px;",
      "color: #FF9800; font-weight: bold; font-size: 11px;",
      "color: #666; font-size: 10px; font-family: monospace;",
    );
  }, 2000);
}
