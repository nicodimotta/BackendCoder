const express = require('express');
const router = express.Router();

module.exports = (passport) => {
  // Ruta de registro
  router.get('/register', (req, res) => {
    res.render('register'); // Asegúrate de tener una vista 'register.handlebars'
  });

  router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/products', // Redirige a la vista de productos si el registro es exitoso
    failureRedirect: '/auth/register', // Redirige al formulario de registro si falla el registro
    failureFlash: true,
  }));

  // Ruta de login
  router.get('/login', (req, res) => {
    res.render('login'); // Asegúrate de tener una vista 'login.handlebars'
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/products', // Redirige a la vista de productos si el login es exitoso
    failureRedirect: '/auth/login', // Redirige al formulario de login si falla el login
    failureFlash: true,
  }));

  // Ruta de logout
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};

