import express from "express";
import cors from "cors";
import createError from "http-errors";
import logger from "morgan";
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import interestsRouter from "./routes/interests.js";
import matchsRouter from "./routes/matchs.js";
import messagesRouter from "./routes/messages.js";
import imagesRouter from "./routes/images.js";
import db from './config/db.js';


const app = express();

app.use(cors());

const openApiDocument = yaml.load(fs.readFileSync('./openapi.yml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/interests", interestsRouter);
app.use("/matchs", matchsRouter);
app.use("/messages", messagesRouter);
app.use("/images", imagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
