const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const {createHandler} = require('graphql-http/lib/use/express')
const graphalSchema = require('./graphql/schema')
const graphalResolver = require('./graphql/resolvers')

const cors = require('cors')

const expressPlayground = require("graphql-playground-middleware-express").default;



const MONGODB_URI =
  "mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/messages?w=majority";



const app = express();

/**
 * Set headers on any response that leaves the server (CORS)
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //allow access from any domain
  res.setHeader("Access-Control-Allow-Methods", "GET,POST, PUT, PATCH, DELETE"); //allow specific http methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //allow headers clients set
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

// app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()) //x-www-form-urlenncoded requests

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/graphql', createHandler({
  schema:graphalSchema,
  rootValue:graphalResolver,
  formatError(err){ //change error format
    if(!err.originalError){
      return err
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occured!';
    const status = err.originalError.code || 500;
    return {message, data, status}

  }
}))

app.get("/playground", expressPlayground({ endpoint: "/graphql" })); 

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    status,
    data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
   app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
