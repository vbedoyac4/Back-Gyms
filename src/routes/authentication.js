const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const cors = require('cors');

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/agregado',
    //failureRedirect: '/error',
    failureFlash: 'Wlcome',
    failWithError: true
}));

router.post('/signin',cors(), (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/home/dashboard',
        //failureRedirect: '/notFound',
        succesFlash: 'welcome',
        failureFlash: '',
        failWithError: true
    }, )(req, res, next)
});

router.put('/update', (req, res, next) => {
    passport.authenticate('local.update', {
        successRedirect: '/updated',
        failureRedirect: '/error',
        failureFlash: true
    })(req, res, next);
});

router.post('/ingresar', (req, res) => {
    console.log("Seleccionar user con correo: " + req.body.correo)

    const correo = req.body.correo
    const password = req.body.password

    const queryString = `SELECT * FROM users WHERE correo = ? AND password = ?`;
    const respuesta = pool.query(queryString, [correo, password], (err, rows, fields) => {
        if (rows.length > 0) {
           res.json({ status: 200 })
        } else {
            res.json({ status: 500 })
        }
       res.end();
    })
});

router.get('/user/:correo', (req, res) => {
    console.log("Seleccionar user con correo: " + req.params.correo)

    const correo = req.params.correo

    const queryString = "SELECT nombre, correo  FROM users WHERE correo = ?"
    pool.query(queryString, [correo], (err, rows, fields) => {
        if (err) {
            console.log("No existe el user " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("User Seleccionado")
        res.json(rows)
    })
});

router.get('/proveedor/:correo', (req, res) => {
    console.log("Seleccionar proveedor con correo: " + req.params.correo)

    const correo = req.params.correo

    const queryString = "SELECT nombre, direccion, tipo, correo, telefono, password  FROM users WHERE correo = ?"
    pool.query(queryString, [correo], (err, rows) => {
        if (err) {
            console.log("No existe el user " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("User Seleccionado")
        res.status(200).json(rows)
    })
});



///////////////////////////////////////

/////////////////PROVEEDORES//////////////

router.get('/proveedores_tipo/:tipo', (req, res) => {

    console.log("Seleccionar proveedor por tipo: " + req.params.tipo)
    const tipo = req.params.tipo

    const queryString = "SELECT id_u, imageUrl, nombre, tipo, direccion FROM users WHERE tipo = ?;"
    pool.query(queryString, [tipo], (err, rows, fields) => {
        if (err) {
            console.log("No hay proveedores " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Proveedores Seleccionados")
        res.json(rows)
    })
});
/////////////////////////////////////////

//////////////////////////////////////


router.get('/DataUser/:id', (req, res) => {
    console.log("Seleccionar user con username: " + req.params.id)

    const username = req.params.id

    const queryString = "SELECT *  FROM users WHERE username = ?"
    pool.query(queryString, [username], (err, rows, fields) => {
        if (err) {
            console.log("No existe el user " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("User Seleccionada")
        res.json(rows)
    })
});

router.get('/users', (req, res) => {
    console.log("Seleccionar todos los users")

    const queryString = "SELECT correo, password from users"
    pool.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("No hay users " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("users Seleccionados")
        res.json(rows)
    })
});

router.get('/departamento/roles/:id', (req, res) => {
    console.log("Seleccionar roles con id: " + req.params.id)

    const id = req.params.id

    const queryString = "SELECT *  FROM roles WHERE deptoid = ?"
    pool.query(queryString, [id], (err, rows, fields) => {
        if (err) {
            console.log("No los roles " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Roles Seleccionados")
        res.json(rows)
    })
});

router.get('/departamento', (req, res) => {
    console.log("Seleccionar todos los departamentos")

    const queryString = "SELECT * FROM departamento"
    pool.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("No hay departamentos " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("departamentos Seleccionados")
        res.json(rows)
    })
});

router.get('/home/dashboard', (req, res) => {
    console.log("User Logueado");
    res.json({ status: 200 });
});

router.get('/agregado', (req, res) => {
    console.log("User Agregado");
    res.json({ status: 200 });
});

router.get('/signup', (req, res) => {
    console.log("User added");
    res.sendStatus(200)
});

router.get('/notFound', (req, res) => {
    console.log("notFound");
    res.json({ status: 404 });
});

router.get('/error', (req, res) => {
    console.log("Error");
    res.json({ status: 500 });
});


router.put('/updated', (req, res) => {
    console.log("Password Updated ");
    res.json({ status: 200 });
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('signin');
    res.sendStatus(200)
   
    console.log("Logged out");
});

module.exports = router;