const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController.js");

router.get("/",commentController.getAllComments);
router.post("/",commentController.postComment);
router.get("/:id",commentController.getComment);
router.put("/:id",commentController.updateComment);
router.delete("/:id",commentController.deleteComment);

module.exports = router;