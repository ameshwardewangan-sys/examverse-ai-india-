/**
 * ==========================================
 * ExamVerse AI
 * Current Affairs Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();


/* ==========================================
   Current Affairs Status
========================================== */

exports.currentAffairsStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "Current Affairs Module",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Add Current Affair (Admin)
========================================== */

exports.addCurrentAffair = onRequest(async (req, res) => {

  try {

    const {

      title,

      description,

      category

    } = req.body;

    if (!title || !description) {

      return res.status(400).json({

        success: false,

        message: "Title and description required"

      });

    }

    const docRef = await db.collection("current_affairs").add({

      title,

      description,

      category: category || "general",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      id: docRef.id

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get Current Affairs
========================================== */

exports.getCurrentAffairs = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("current_affairs")

      .orderBy("createdAt", "desc")

      .limit(50)

      .get();

    const data = [];

    snapshot.forEach(doc => {

      data.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      data

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Delete Current Affair (Admin)
========================================== */

exports.deleteCurrentAffair = onRequest(async (req, res) => {

  try {

    const { id } = req.body;

    if (!id) {

      return res.status(400).json({

        success: false,

        message: "ID required"

      });

    }

    await db.collection("current_affairs").doc(id).delete();

    res.json({

      success: true,

      message: "Deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Filter by Category
========================================== */

exports.getByCategory = onRequest(async (req, res) => {

  try {

    const { category } = req.query;

    let ref = db.collection("current_affairs");

    if (category) {

      ref = ref.where("category", "==", category);

    }

    const snapshot = await ref.orderBy("createdAt", "desc").limit(50).get();

    const data = [];

    snapshot.forEach(doc => {

      data.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      data

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Search Current Affairs
========================================== */

exports.searchCurrentAffairs = onRequest(async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) {

      return res.status(400).json({

        success: false,

        message: "Search query required"

      });

    }

    const snapshot = await db.collection("current_affairs").get();

    const results = [];

    snapshot.forEach(doc => {

      const data = doc.data();

      if (

        data.title?.toLowerCase().includes(q.toLowerCase()) ||

        data.description?.toLowerCase().includes(q.toLowerCase())

      ) {

        results.push({

          id: doc.id,

          ...data

        });

      }

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
   Current Affairs Analytics
========================================== */

exports.currentAffairsAnalytics = onRequest(async (req, res) => {

  try {

    const snapshot = await db.collection("current_affairs").get();

    const categories = {};

    snapshot.forEach(doc => {

      const cat = doc.data().category || "general";

      categories[cat] = (categories[cat] || 0) + 1;

    });

    res.json({

      success: true,

      total: snapshot.size,

      categories

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
