const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { callbackify } = require('util');
const PORT = process.env.PORT || 3500;

//Custom middleware (logger)
app.use(logger);

app.use(cors(corsOptions));

//Built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
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




