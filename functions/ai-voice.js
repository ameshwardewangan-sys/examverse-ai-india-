/**
 * ==========================================
 * ExamVerse AI
 * AI Voice Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   Voice Health
========================================== */

exports.voiceStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse AI Voice",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Speech To Text
========================================== */

exports.speechToText = onRequest(async (req, res) => {

  try {

    const {

      userId,

      audioFile

    } = req.body;

    await db.collection("voice_jobs").add({

      userId,

      audioFile,

      type: "speech_to_text",

      status: "pending",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "Speech-to-Text job created."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Text To Speech
========================================== */

exports.textToSpeech = onRequest(async (req, res) => {

  try {

    const {

      text

    } = req.body;

    res.json({

      success: true,

      text,

      audioUrl: "",

      message: "Text-to-Speech endpoint ready."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
