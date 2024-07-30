//using this functions in routes

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    //CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);
    res.status(201).json({ message: "User created Successfully" });
    //   console.log(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "!User Already Exists!" });
  }
};

export const login = async (req, res) => {
  //db operations
  const { username, password } = req.body;
  try {
    //CHECK IF THE USER EXIST
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    //CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials" });

    //GENERATE COOKIE TOKEN AND SEND TO THE USER
    // res
    //   .setHeader("Set-Cookie", "test=" + "myValue")
    //   .json("Successfully Loggedin");

    const age = 1000 * 60 * 60 * 24 * 7; //maximum age of cookie is 1 week

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: age,
        sameSite: 'lax'
      })
      .status(200)
      .json(userInfo);
    //instead of sending message we need to send the user info ie (id,mail,username)
    // .json({ message: "Login Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  //db operations
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
