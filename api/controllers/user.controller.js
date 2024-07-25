import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  console.log("it works");
  //we gonna fetch the user data from the database
  try {
    //using prisma to find my user as we are using prisma as our ORM
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const getUser = async (req, res) => {
  //getting the unique id that we added in our user.route.js
  const id = req.params.id;
  try {
    //gonna find an unique user
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const updateUser = async (req, res) => {
  //again getting the id through params
  const id = req.params.id;
  //here one extra check is done by verifying the tokenuserid with the id inorder to do the updation
  const tokenUserId = req.userId; //go check in verifyToken.js
  const { password, avatar, ...inputs } = req.body; //we are getting body inorder to change it and send it back to the db
  if (id !== tokenUserId) {
    //this is the check
    return res.status(403).json({ message: "Not Authorized!!" });
  }
  let updatedPassword = null;
  try {
    //hashing the passkey
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    //this is how we gonna do the updation
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }), //this is how you can write in a condition using spread operator
        ...(avatar && { avatar }), //same thing can be done for avatar if new avatar is there then add it else not
      },
    });
    const { password: userPassword, ...rest } = updatedUser;
    // res.status(200).json(updatedUser);//no need to send the whole data as we do not want to send those which are not updated
    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!!" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  //we are going to take the post id and user id from the body
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  try {
    //gonna check whether the post is already saved or not
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });
    //if the post is already saved then delete it
    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post Unsaved!" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed!" });
  }
};

export const profilePosts = async (req, res) => {
  //getting the userid from the url
  const tokenUserId = req.params.id;
  try {
    //fetching the posts from the database {myList}
    const userPosts = await prisma.post.findMany({
      where: {
        userId: tokenUserId,
      },
    });
    const saved = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
      },
      include: {
        post: true,
      },
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update profile posts!" });
  }
};
