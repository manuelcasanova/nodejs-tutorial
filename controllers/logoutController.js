const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  //On front end, also delete the accessToken


  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204); //Successful. No content to send back
  const refreshToken = cookies.jwt;

  //See if refresh token is in db
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  //If we reach this point, we found the same refresh token in db
  //Delete the refresh token in db

  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //secure: true - only serves on https. We would add this on production
  res.sendStatus(204);
}

module.exports = { handleLogout }