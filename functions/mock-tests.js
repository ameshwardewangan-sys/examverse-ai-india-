/**
 * ==========================================
 * ExamVerse AI
 * Mock Test Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   Mock Test Status
========================================== */

exports.mockStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse Mock Tests",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Create Mock Test
========================================== */

exports.createMockTest = onRequest(async (req, res) => {

  try {

    const {

      title,

      exam,

      questions

    } = req.body;

    const docRef = await db.collection("mock_tests").add({

      title,

      exam,

      questions,

      totalQuestions: questions ? questions.length : 0,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      testId: docRef.id

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get Mock Tests
========================================== */

exports.getMockTests = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("mock_tests")

      .orderBy("createdAt", "desc")

      .limit(50)

      .get();

    const tests = [];

    snapshot.forEach(doc => {

      tests.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      tests

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Submit Mock Test
========================================== */

exports.submitMockTest = onRequest(async (req, res) => {

  try {

    const {

      userId,

      testId,

      answers,

      score

    } = req.body;

    const resultRef = await db.collection("mock_results").add({

      userId,

      testId,

      answers: answers || [],

      score: score || 0,

      submittedAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      resultId: resultRef.id,

      score: score || 0

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Result History
========================================== */

exports.getMockResults = onRequest(async (req, res) => {

  try {

    const { userId } = req.query;

    const snapshot = await db

      .collection("mock_results")

      .where("userId", "==", userId)

      .orderBy("submittedAt", "desc")

      .limit(100)

      .get();

    const results = [];

    snapshot.forEach(doc => {

      results.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      results

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Leaderboard
========================================== */

exports.getLeaderboard = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("mock_results")

      .orderBy("score", "desc")

      .limit(50)

      .get();

    const leaderboard = [];

    snapshot.forEach(doc => {

      leaderboard.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      leaderboard

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});

