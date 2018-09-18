const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/api/user');
const blogpost = require('./routes/api/blogpost');
const posts = require('./routes/api/posts');
const passport = require('passport');
const ProfileDb = require('././models/Profile');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

mongoose.Promise = global.Promise;
// DataBase configure
const db = require('./config/keys').mongoURI;

//Connect server to MongoDB
mongoose
	.connect(db)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


//use Routes
app.use('/api/user', user);
app.use('/api/blogpost', blogpost);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("server running port", port);
});
