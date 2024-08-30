const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
// const uploadRoutes = require('./routes/upload');

dotenv.config();
const app = express();

// Set security-related HTTP headers
app.use(helmet());

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//   secret: process.env.JWT_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));
app.use(connectFlash());

// CSRF protection
// app.use(csrf({ cookie: true }));

// Static files
app.use('/views', express.static(path.join(__dirname, 'views')));

// Routes
app.use('/', authRoutes);
// app.use('/', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
