const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Asegúrate de importar el modelo de usuario

passport.use(
    'local-register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email });
  
          if (user) {
            return done(null, false, { message: 'El correo electrónico ya está registrado.' });
          }
  
          const newUser = new User({
            email,
            password: await User.hashPassword(password),
            // agregar otros campos del usuario aquí
          });
  
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
