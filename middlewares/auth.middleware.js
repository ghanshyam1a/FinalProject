import jwt from "jsonwebtoken";

const isAdmin = (req, res, next) => {
  try {
    console.log(req.cookies);
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid request. Authtoken missing",
      });
    }

    const userDetails = jwt.verify(authToken, process.env.JWT_SECRET);

    const { role } = userDetails;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this information",
      });
    }

    req.user = userDetails;
    next();
  } catch (err) {
    return res.status(500).json({
      success:false,
      message:"Server Error",
      err:err.message,
    });
  }
};

export default isAdmin;