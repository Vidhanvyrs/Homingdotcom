import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();
const app = express();
// const port = process.env.PORT || 8800;

//adding cors because api cannot be used directly from the client
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
// console.log("CLIENT_URL:", process.env.CLIENT_URL);

app.use(express.json());
app.use(cookieParser());

//using authentication route here
app.use("/api/auth", authRoute);

//using for users and their updation
app.use("/api/users", userRoute);

//go to /api/posts/test
//gonna start making this work
app.use("/api/posts", postRoute);

//using this for testing routes
app.use("/api/test", testRoute);

//using this for chat
app.use("/api/chats", chatRoute);

//using this for message
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
