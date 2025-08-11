//core modules
const path = require('path')

//External Modules
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer')
const DB_PATH = "mongodb+srv://root:root@ridham01.ogpjzk1.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Ridham01"


//local module
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter')
const authRouter = require('./routes/authRouter');

//Local module
const rootDir = require('./utility/pathUtil')

//Local module
const errorsController = require("./controllers/errors");

const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

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
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const multerOptions = {
    storage, fileFilter
};




app.use(express.urlencoded())
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads",express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))
app.use(session({ 
    secret: "Ridham Kakdadiya",
    resave: false,
    saveUninitialized: true,
    store: store,
    })
)

app.use((req,res ,next) => {
    // console.log("cookie: ", req.get('cookie'));
    req.isLoggedIn = req.session.isLoggedIn || false;
    next();
})

app.use(storeRouter);    
app.use(authRouter);
app.use("/host", (req, res, next) => {
    if (req.isLoggedIn) {
        next()
    }
    else {
        res.redirect('/login');
    }
});
app.use("/host", hostRouter);



app.use(errorsController.pageNotFound);

const port = 3002

mongoose.connect(DB_PATH).then(() => {
    console.log("Connected to the database successfully!");
    // console.log("Client:", client);
    app.listen(port, () => {
        console.log(`Running on http://localhost:${port}`)
    })
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});