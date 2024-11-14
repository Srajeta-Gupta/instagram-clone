import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddleWare = async (req, res, next) => {

  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token)
    if (token) {
      // const decoded = jwt.verify(token, secret);
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
        }
        // console.log(decoded)
        req.body._id = decoded?.id;
        next();
      })
    }
  } catch (error) {
    console.log("Token Expired - " + error);
  }
};

export default authMiddleWare;