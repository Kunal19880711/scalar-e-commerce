const payloadSanityMiddleware = (req, res, next) => {
  try {
    console.log("Sanity check");
    const user = req.body;
    const isEmpty = Object.keys(user).length === 0;
    if (isEmpty) {
      res.status(400).json({
        message: "User data is missing",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.payloadSanityMiddleware = payloadSanityMiddleware;
