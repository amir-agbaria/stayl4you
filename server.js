const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const expressEjsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')
const path = require('path')
require('dotenv').config();

// Express App Config
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: process.env.SESSION_PASS,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(morgan('dev'));
// Static files
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/css', express.static(path.resolve(__dirname, 'public/css')));
app.use('/fonts', express.static(path.resolve(__dirname, 'public/fonts')));
app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/lib', express.static(path.resolve(__dirname, 'public/lib')));
// Telnetting Engine
app.use(expressEjsLayouts);
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)
app.set("layout extractMetas", true)

// Routes
const itemRouter = require('./routes/item.js');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login.js');
const signupRouter = require('./routes/signup.js');
const logoutRouter = require('./routes/logout.js');
const storeRouter = require('./routes/store.js');
const cartRouter = require('./routes/cart.js');
const orderRouter = require('./routes/order.js');
const profileRouter = require('./routes/profile.js');
const historyRouter = require('./routes/historyOrders.js');
app.use('', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/store', storeRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/item', itemRouter);
app.use('/profile', profileRouter);
app.use('/history', historyRouter);

// Start server running
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on: ' + port)
});

// Connecting to database
const { DB_USER, DB_PASS } = process.env;
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.yorr0.mongodb.net/style4you?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DB connected');
});

