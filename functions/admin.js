/**
 * ==========================================
 * ExamVerse AI
 * Admin Backend System
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();


/* ==========================================
   Admin Status
========================================== */

exports.adminStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "Admin System",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Create Admin User Role
========================================== */

exports.createAdmin = onRequest(async (req, res) => {

  try {

    const {

      userId,

      role

    } = req.body;

    if (!userId || !role) {

      return res.status(400).json({

        success: false,

        message: "userId and role required"

      });

    }

    await db.collection("admins").doc(userId).set({

      role,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "Admin created successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get Admin Role
========================================== */

exports.getAdminRole = onRequest(async (req, res) => {

  try {

    const { userId } = req.query;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "userId required"

      });

    }

    const doc = await db.collection("admins").doc(userId).get();

    if (!doc.exists) {

      return res.json({

        success: true,

        role: "user"

      });

    }

    res.json({

      success: true,

      role: doc.data().role

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Ban / Unban User
========================================== */

exports.toggleUserBan = onRequest(async (req, res) => {

  try {

    const { userId, ban } = req.body;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "userId required"

      });

    }

    await db.collection("users").doc(userId).update({

      banned: ban === true

    });

    res.json({

      success: true,

      message: ban ? "User banned" : "User unbanned"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Delete Any Collection Data (Admin Control)
========================================== */

exports.deleteContent = onRequest(async (req, res) => {

  try {

    const { collection, docId } = req.body;

    if (!collection || !docId) {

      return res.status(400).json({

        success: false,

        message: "collection and docId required"

      });

    }

    await db.collection(collection).doc(docId).delete();

    res.json({

      success: true,

      message: "Content deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   System Logs
========================================== */

exports.getSystemLogs = onRequest(async (req, res) => {

  try {

    const snapshot = await db.collection("system_logs")

      .orderBy("createdAt", "desc")

      .limit(100)

      .get();

    const logs = [];

    snapshot.forEach(doc => {

      logs.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      logs

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Add System Log
========================================== */

exports.addSystemLog = onRequest(async (req, res) => {

  try {

    const { action, detail } = req.body;

    await db.collection("system_logs").add({

      action,

      detail,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "Log added"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
