export const validationCreateQuestionData = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Please insert Title",
    });
  }
  if (!req.body.description) {
    return res.status(400).json({
      message: "Please insert Description",
    });
  }
  next();
};
