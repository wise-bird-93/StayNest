
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const process = require('process');

const multer = require('multer');
const express = require('express');
const app = express();
app.set('view engine','ejs');
app.set('views','views');

const path = require('path');

const {storeRouter} = require('./routes/storeRoute');
const {hostRouter} = require('./routes/hostRoute');
const {authRoute} = require('./routes/authRoute');
const routePath = require('./utils/pathUtil');
const {errorRoute} = require('./controllers/error');
const { default: mongoose } = require("mongoose");

const session = require('express-session');

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage, fileFilter
}
app.use(express.static(path.join(routePath,'public')));
app.use("/uploads",express.static(path.join(routePath,'uploads')));
app.use("/host/uploads", express.static(path.join(routePath, 'uploads')))
app.use(express.urlencoded());

const upload = multer(multerOptions);
app.use(upload.fields([{name:'photo',maxCount:1},{name:'rules',maxCount:1}]))

const MongoStore = require('connect-mongo').default;
const db_path = "mongodb+srv://chatappuser:yuvi1290@cluster0.jsv13mb.mongodb.net/airbnb?appName=Cluster0";
const store = MongoStore.create({
    mongoUrl: db_path,
    collectionName: "sessions"
});

app.use(session ({
  secret: "yuvraj",
  resave: false,
  saveUninitialized: false,
  store
}))

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(storeRouter);
app.use(hostRouter);
app.use(authRoute);
app.use(errorRoute);

app.use("/", (req,res,next) => {
  if(req.isLoggedIn){
    next();
  }
  else {
    res.redirect("/login");
  }
})

const PORT = 3000;

mongoose.connect(process.env.db_path).then(() => {
  console.log('Connected to Mongoose');
  app.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to mongoose',err);
});

