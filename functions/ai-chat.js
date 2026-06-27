const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * AI Chat Endpoint
 */
exports.chat = onRequest(async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required."
      });
    }

    logger.info("AI Chat Request", {
      userId: userId || "anonymous"
    });

    // Placeholder response
    res.status(200).json({
      success: true,
      reply: "AI Chat backend is ready. Connect your AI provider here.",
      timestamp: Date.now()
    });

  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
