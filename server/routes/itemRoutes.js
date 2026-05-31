import express from "express";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  getItem,        // ✅ import add kiya
} from "../controllers/itemController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getItems);
router.post("/", addItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/:id", getItem);   // ✅ "/items/:id" → "/:id"

export default router;