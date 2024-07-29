import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

//going to use the function from the controllers
router.get("/", verifyToken, getChats); // for all chats
router.get("/:id", verifyToken, getChat); // for a single chat
router.post("/", verifyToken, addChat); //posting my chat
router.put("/read/:id", verifyToken, readChat); //automtically running when we open our chats
//we put put request here because its an automatic update so any new chat happened must be fetched 

export default router;
