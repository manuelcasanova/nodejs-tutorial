const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

  //See if the username exists
  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); //401 Unauthorized
  //If founduser, evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //We would create here JWTs Token. To send to use with the other routes that we want protected in our API.
    res.json({'success': `user ${user} is logged in`});
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin };