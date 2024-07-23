import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const query = req.query;
  // console.log(query);
  //getting the query request and using it to find the posts from the db
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.tpe || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// export const getPost = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//       //for individual post i need to get the post detail data
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     //adding functionality for checking whether the post is saved by the loggedin user
//     let userId;
//     const token = req.cookies?.token;

//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id, //id comes from req.params
//                 userId: payload.id,
//               },
//             },
//           });
//           //if it is saved then we gonna get saved equals to true
//           res.status(200).json({ ...post, isSaved: saved ? true : false });
//         }
//       });
//     }
//     res.status(200).json({ ...post, isSaved: false });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to get post" });
//   }
// };
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      // for individual post i need to get the post detail data
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // adding functionality for checking whether the post is saved by the logged-in user
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        }

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id, // id comes from req.params
              userId: payload.id,
            },
          },
        });

        // if it is saved then we gonna get saved equals to true
        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not AUthorized!" });
    }
    //if the checking is cleared then deleted the post
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Post Succcessfully Delted!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
