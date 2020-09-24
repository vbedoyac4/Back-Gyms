const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

//////////////////////////// CLIENTES ////////////////////////////////////////////////////////////////////

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, correo, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE correo= ?', [correo]);
    if (rows.length > 0) {
        const user = rows[0];
        console.log(user);
        const validPassword = await helpers.matchPassword(password, user.password)
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.nombre));
            //console.log("Logueado");
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
            //console.log("Password mal");
        }
    } else {
        return done(null, false, req.flash('message', 'The Username does not exists.'));
        //console.log("Usuario no existe");
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true,
}, async(req, correo, password, done) => {

    const { nombre } = req.body;
    const { telefono } = req.body;
    const { rol } = req.body;
    const { genero } = req.body;
    const { imageUrl } = 'assets/images/xfitmma.jpg';
    const { direccion } = req.body;
    const { tipo } = req.body;

    let newUser = {
        nombre,
        password,
        correo,
        telefono,
        rol,
        genero,
        imageUrl,
        direccion,
        tipo
    };

    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id_u = result.insertId;
    return done(null, newUser);
}));

passport.use('local.update', new LocalStrategy({
    correoField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, correo, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
    if (rows.length > 0) {
        const user = rows[0];
        console.log('users count :'+ user);
        password = await helpers.encryptPassword(password);
        const result = await pool.query('UPDATE users SET password = ? WHERE correo = ? ', [password, correo]);
        return done(null, user);
    }
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


passport.serializeUser((user, done) => {
    done(null, user.id_u);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id_u = ?', [id]);
    done(null, rows[0]);
});



    