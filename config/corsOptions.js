//Apply cors ASAP but after the logger
const whitelist = [
  //Remove unnecessary after development
  'https://www.yourdomain.com',
  'https://127.0.0.1:5500',
  'https://localhost:3500',
]
const corsOptions = {
  origin: (origin, callback) => {
    //|| !origin remove after development
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;