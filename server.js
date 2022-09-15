const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/VerifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500;

//Custom middleware (logger)
app.use(logger);

//Handle options credentials check (BEFORE CORS) and fetch cookies credientials requirement.
app.use(credentials)

app.use(cors(corsOptions));

//Built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//Everything after this line will use the verifyJWT. So any route we don't want, should go above.
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

//catch all
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }
  else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));




