import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Got a response from the users route");
});

router.post("/", (req, res, next) => {
  console.log(req.body);
});

export default router;