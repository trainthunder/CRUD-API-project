import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validationCreateQuestionData } from "../middleware/question.validation.mjs";

const questionRouter = Router();

/** POST Questions Start */
questionRouter.post("/", [validationCreateQuestionData], async (req, res) => {
  let postQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    await connectionPool.query(
      `
        insert into questions (title, description, category)
        values($1, $2,$3)`,
      [postQuestion.title, postQuestion.description, postQuestion.category]
    );
    if (!postQuestion.title || !postQuestion.description) {
      return res.status(400).json({
        message: "Missing or invalid request data",
      });
    }
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection",
    });
  }
  return res.status(201).json({
    message: "Question created successfully",
    data: postQuestion,
  });
});
/** POST Questions End */

/** Get Questions Start */
questionRouter.get("/", async (req, res) => {
  let getQuestions;
  try {
    getQuestions = await connectionPool.query(`SELECT * FROM QUESTIONS`);
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection",
    });
  }
  return res.status(200).json({
    message: "Successfully retrieved the list of questions.",
    data: getQuestions.rows,
  });
});
/** GET Question End */

/** GET Question By ID Start */
questionRouter.get("/:id", async (req, res) => {
  let getQuestionByID;
  const questionIdFromClient = req.params.id;
  try {
    getQuestionByID = await connectionPool.query(
      `select * from questions
        where id = $1`,
      [questionIdFromClient]
    );
    if (!getQuestionByID.rows[0]) {
      return res.status(404).json({
        message: "Question not found",
      });
    }
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection",
    });
  }
  return res.status(200).json({
    message: "Successfully retrieved the question",
    data: getQuestionByID.rows,
  });
});
/** GET Question By ID End */

/** PUT Question By Id Start */
questionRouter.put("/:id", async (req, res) => {
  let getQuestionByID;
  const questionIdFromClient = req.params.id;
  const updatedQuestion = {
    ...req.body,
    updated_at: new Date(),
  };
  try {
    getQuestionByID = await connectionPool.query(
      `select * from questions
        where id = $1`,
      [questionIdFromClient]
    );
    if (!getQuestionByID.rows[0]) {
      return res.status(404).json({
        message: "Question not found",
      });
    }
    await connectionPool.query(
      `update questions
        set title = $2, description = $3, category = $4
        where id = $1`,
      [
        questionIdFromClient,
        updatedQuestion.title,
        updatedQuestion.description,
        updatedQuestion.category,
      ]
    );
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }
  return res.status(200).json({
    message: "Successfully updated the question",
    data: updatedQuestion,
  });
});
/** PUT Question By Id End */

/** DELETE Question By Id Start */
questionRouter.delete("/:id", async (req, res) => {
  let deleteQuestionByID;
  const questionIdFromClient = req.params.id;
  try {
    deleteQuestionByID = await connectionPool.query(
      `
        select * from questions
        where id = $1`,
      [questionIdFromClient]
    );
    if (!deleteQuestionByID.rows[0]) {
      return res.status(404).json({
        message: "Question not found",
      });
    }
    await connectionPool.query(`delete from questions where id = $1`, [
      questionIdFromClient,
    ]);
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection",
    });
  }
  return res.status(200).json({
    message: "Successfully deleted the question",
  });
});
/** DELETE Question By Id End */

export default questionRouter;
