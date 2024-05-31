const settings = require("../fs/settings.js");
const client = require("./createTables.js");


const verifyCallback = (username='admin', password='admin', done) => {
  User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
          return done(null, false, { message: 'Неправильное имя пользователя' });
      }
      if (!user.validPassword(password)) {
          return done(null, false, { message: 'Неверный пароль' });
      }
      return done(null, user);
  });
};


module.exports = {verifyCallback};