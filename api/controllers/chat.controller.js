import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });
    //for getting the data of our users
    // for (const chat of chats) {
    //   const receiverId = chat.userIDs.find((id) => id !== tokenUserId); //getting other user by conditionally checking for our id which should not be there

    //   const receiver = await prisma.user.findUnique({
    //     //fetching other user information
    //     where: {
    //       id: receiverId,
    //     },
    //     select: {
    //       id: true,
    //       username: true, //getting username
    //       avatar: true, //getting avatar
    //     },
    //   });
    //   chat.receiver = receiver;
    // }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id, //getting the id of the chat happened
        userIDs: {
          hasSome: [tokenUserId], //only accessed by user with userId
        },
      },
      //once we open up our message box we need to show the recent messages and
      //seenby too
      //we gonna see the latest messages that is why we used ascending order
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        usrIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat" });
  }
};
