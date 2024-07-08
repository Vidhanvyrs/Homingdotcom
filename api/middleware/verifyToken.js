import jwt from "jsonwebtoken";
//we are using the verification of token code again n again to prevent this we are here to
//create a middleware for it

export const verifyToken = (req, res, next) => {
  //verfication of our token for confirming our login state
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    req.userId = payload.id;

    next();
  });
};
