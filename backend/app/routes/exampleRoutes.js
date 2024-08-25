const express = require("express");
const router = express.Router();
const { verifyStaticToken, verifyUserId, checkRole } = require("../middleware/exampleMiddleware");
const exampleController = require("../controllers/exampleController");

// Middleware untuk semua rute
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Endpoint yang bisa diakses dengan token statis
router.get("/", verifyStaticToken, verifyUserId, (req, res) => {
  res.json({ message: "Hello" });
});

router.post("/refactoreMe2", verifyStaticToken, verifyUserId, exampleController.refactoreMe2);

// Endpoint yang memerlukan token statis dan role admin
router.get("/refactoreMe1", verifyStaticToken, verifyUserId, checkRole(['admin']), exampleController.refactoreMe1);
router.get("/getData", verifyStaticToken, verifyUserId, checkRole(['admin']), exampleController.getData);

module.exports = router;