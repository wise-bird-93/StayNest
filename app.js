require("dotenv").config();
const express = require('express');
const app = express();
app.set('view engine','ejs');
app.set('views','views');

const path = require('path');

const {storeRouter} = require('./routes/storeRoute');
const {hostRouter} = require('./routes/hostRoute');
const routePath = require('./utils/pathUtil');
const {errorRoute} = require('./controllers/error');



app.use(express.static(path.join(routePath,'public')));

app.use(express.urlencoded({extended:true}));
app.use(storeRouter);
app.use(hostRouter);

app.use(errorRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT , () => {
  console.log(`server running on ${PORT}`);
});