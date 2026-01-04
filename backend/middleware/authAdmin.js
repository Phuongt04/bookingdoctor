import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is required" });
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
export default authAdmin;
