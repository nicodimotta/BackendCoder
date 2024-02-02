const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Estrategia local para registro
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          email,
          password: hashedPassword,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: 'tu-client-id-de-GitHub',
      clientSecret: 'tu-client-secret-de-GitHub',
      callbackURL: 'http://localhost:8080/auth/github/callback', // Ajusta la URL de acuerdo a tu configuración
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          githubId: profile.id,
          email: profile.emails[0].value,
          // podes agregar más campos segun la info que desees obtener de GitHub
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


