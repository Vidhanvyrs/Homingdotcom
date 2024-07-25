import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

//going to use the function from the controllers
router.get("/", getUsers);
// router.get("/:id", verifyToken, getUser);//this is an conflict here as profilePosts is also a getUser and displaying the same data and we are eventually getting the user from the auth.route.js
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);

export default router;
