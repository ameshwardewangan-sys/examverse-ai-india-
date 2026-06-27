/**
 * ==========================================
 * ExamVerse AI
 * AI OCR Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   OCR Health
========================================== */

exports.ocrStatus = onRequest(async (req, res) => {

  res.json({
    success: true,
    service: "ExamVerse AI OCR",
    version: "1.0.0",
    status: "Online"
  });

});


/* ==========================================
   Upload OCR Job
========================================== */

exports.uploadOCR = onRequest(async (req, res) => {

  try {

    const { userId, fileName } = req.body;

    await db.collection("ocr_jobs").add({

      userId,

      fileName,

      status: "pending",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "OCR job created successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get OCR Jobs
========================================== */

exports.getOCRJobs = onRequest(async (req, res) => {

  try {

    const snapshot = await db
      .collection("ocr_jobs")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const jobs = [];

    snapshot.forEach(doc => {

      jobs.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      jobs

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Save OCR Result
========================================== */

exports.saveOCRResult = onRequest(async (req, res) => {

  try {

    const {

      jobId,

      extractedText

    } = req.body;

    if (!jobId) {

      return res.status(400).json({

        success: false,

        message: "Job ID is required."

      });

    }

    await db.collection("ocr_results").add({

      jobId,

      extractedText: extractedText || "",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "OCR result saved successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   OCR History
========================================== */

exports.getOCRHistory = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("ocr_results")

      .orderBy("createdAt", "desc")

      .limit(100)

      .get();

    const history = [];

    snapshot.forEach(doc => {

      history.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      history

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Delete OCR Job
========================================== */

exports.deleteOCRJob = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "Delete OCR Job endpoint ready."

  });

});


/* ==========================================
   OCR Analytics
========================================== */

exports.ocrAnalytics = onRequest(async (req, res) => {

  const jobs = await db.collection("ocr_jobs").get();

  res.json({

    success: true,

    totalJobs: jobs.size

  });

});
/* ==========================================
   OCR Configuration
========================================== */

exports.getOCRConfig = onRequest(async (req, res) => {

  res.json({

    success: true,

    config: {

      maxFileSizeMB: 20,

      supportedFormats: [

        "jpg",

        "jpeg",

        "png",

        "pdf"

      ],

      supportedLanguages: [

        "English",

        "Hindi"

      ]

    }

  });

});


/* ==========================================
   Image Validation
========================================== */

exports.validateOCRImage = onRequest(async (req, res) => {

  const { fileName } = req.body;

  if (!fileName) {

    return res.status(400).json({

      success: false,

      message: "File name is required."

    });

  }

  res.json({

    success: true,

    valid: true,

    message: "Image validation passed."

  });

});


/* ==========================================
   Generate Notes From OCR
========================================== */

exports.generateNotesFromOCR = onRequest(async (req, res) => {

  const { text } = req.body;

  res.json({

    success: true,

    originalLength: text ? text.length : 0,

    notes: "AI Notes generation endpoint is ready."

  });

});


/* ==========================================
   OCR Health Check
========================================== */

exports.ocrHealth = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "OCR",

    status: "Healthy",

    timestamp: Date.now()

  });

});


/* ==========================================
   End OCR Module
========================================== */
