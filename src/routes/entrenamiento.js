const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.post('/add', (req, res) =>{

    console.log("Tratando de agregar entrenamiento..")
    console.log("Fecha: " + req.body.fecha)
    console.log("Hora: " + req.body.hora)
    console.log("Cupos_d: " + req.body.cupos)
    console.log("Id_u: " + req.body.id_u)
    console.log("Puntos: " + req.body.puntos)

    const Fecha = req.body.fecha
    const Hora =  req.body.hora
    const Cupos = req.body.cupos
    const Id_u = req.body.id_u
    const Puntos = req.body.puntos

    const queryString = "INSERT INTO entrenamiento (fecha, hora, cupos, id_u, puntos)  VALUES  (?, ?, ?, (SELECT id_u FROM users WHERE correo = ?), 2)"
    pool.query(queryString, [Fecha, Hora, Cupos,Id_u, Puntos], (err, results, fields) =>{
        if (err){
            console.log("Error, el entrenamiento: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego entrenamiento con id: ", results.insertId);
        res.end() 
        
    } )
});

router.post('/update/:correo/:fecha:/:hora', (req, res) =>{

    console.log("Tratando de editar entrenamiento..")
    console.log("Fecha: " + req.params.fecha)
    console.log("Hora: " + req.params.hora)
    console.log("correo: " + req.params.correo)

    const Fecha = req.params.fecha
    const Hora =  req.params.hora
    const correo = req.params.correo
   
    const queryString = "UPDATE entrenamiento SET cupos = (cupos-1) WHERE id_u = (SELECT id_u FROM users WHERE correo = ?) AND fecha = ? AND hora = ?;"
    pool.query(queryString, [correo, Fecha, Hora], (err, results, fields) =>{
        if (err){
            console.log("Error, el entrenamiento: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se edito entrenamiento con id: ", results.insertId);
        res.end() 
        
    } )
});

router.get('/all', (req, res) => {
    console.log("Seleccionar todos los entrenamientos")

    const queryString = "SELECT *  FROM entrenamiento "
    pool.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("No hay entrenamientos " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Entrenamientos Seleccionados")
        res.json(rows)
    })
});

/////////////////////////// PUNTOS ///////////////////////////////////
router.get('/allpuntos/:correo', (req, res) => {
    console.log("Seleccionar los puntos acumulados")
    console.log("Puntos de: "+ req.params.correo)
    const id_u = req.params.correo

    const queryString = "SELECT sum(calificacion)/count(calificacion) as calificacion  FROM review WHERE id_gym = (SELECT id_u FROM users WHERE correo = ?); "
    pool.query(queryString, [id_u], (err, rows, fields) => {
        if (err) {
            console.log("No tiene puntos " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Entrenamientos Seleccionados")
        res.json(rows)
    })
});
//////////////////////////////////////////////////////////////////////

/////////////////////////// VISITAS///////////////////////////////////
router.get('/visitas/:correo', (req, res) => {
    console.log("Seleccionar total de visitas recibidas")
    console.log("Puntos de: "+ req.params.correo)
    const id_u = req.params.correo

    const queryString = "SELECT COUNT(id_e) as id_e FROM agendado WHERE id_prov = (SELECT id_u FROM users WHERE correo ='?'); "
    pool.query(queryString, [id_u], (err, rows, fields) => {
        if (err) {
            console.log("No tiene puntos " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Entrenamientos Seleccionados")
        res.json(rows)
    })
});
//////////////////////////////////////////////////////////////////////

router.get('/allbygym/:correo', (req, res) => {
    console.log("Seleccionar todos los entrenamientos")
    const correo = req.params.correo

    const queryString = "SELECT DATE_FORMAT(fecha, '%M %d %Y') AS fecha, hora, cupos  FROM entrenamiento WHERE id_u = (SELECT id_u FROM users WHERE correo = ?) "
    pool.query(queryString,[correo], (err, rows, fields) => {
        if (err) {
            console.log("No hay entrenamientos " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Entrenamientos Seleccionados")
        res.json(rows)
    })
});

router.delete('/delete/:id', (req, res) => {
    console.log("Eliminar entrenamiento con id: "+ req.params.id)

    const Identrenamiento = req.params.id
    const queryString = "DELETE FROM entrenamiento WHERE id_e = ?"
    pool.query(queryString, [Identrenamiento],(err, rows, fields) => {
        if(err){
            console.log("No existe entrenamiento " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Entrenamiento Eliminado")
        res.json(rows)
    })
});

router.get('/gym/:correo', (req, res) => {
    console.log("Seleccionar entrenamiento con id: "+ req.params.correo)

    const Identrenamiento= req.params.correo
    const queryString = "SELECT e.id_e, DATE_FORMAT(e.fecha, '%M %d %Y') AS fecha, e.hora, e.cupos, u.nombre, (e.cupos - SUM(a.cupo)) AS cuporeal, e.puntos FROM entrenamiento AS e INNER JOIN users AS u ON e.id_u = u.id_u INNER JOIN agendado AS a ON e.id_e = a.id_e  WHERE e.id_u = (SELECT id_u FROM users WHERE correo = ?)"
    pool.query(queryString, [Identrenamiento],(err, rows, fields) => {
        if(err){
            console.log("No existe el entrenamiento " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("entrenamiento Seleccionada")
        res.json(rows)
    })
});

router.get('/byhour/:id/:fecha/:hora', (req, res) => {
    console.log("Seleccionar entrenamiento con id: "+ req.params.id)
    console.log("Seleccionar entrenamiento con fecha: "+ req.params.fecha)
    console.log("Seleccionar entrenamiento con hora: "+ req.params.hora)

    const Identrenamiento= req.params.id
    const fecha = req.params.fecha
    const hora = req.params.hora
    const IdUsuario= req.params.correo

    const queryString = "SELECT a.id_a, DATE_FORMAT(e.fecha, '%M %d %Y') AS fecha, e.hora, u.nombre, e.puntos FROM gyms_project.agendado AS a INNER JOIN gyms_project.users AS u ON u.id_u = a.id_usuario INNER JOIN gyms_project.entrenamiento AS e ON e.id_e = a.id_e  WHERE e.id_u = (SELECT id_u FROM gyms_project.users WHERE correo = ?) AND e.fecha = ? AND e.hora = ?;"
    pool.query(queryString, [Identrenamiento, fecha, hora, IdUsuario],(err, rows, fields) => {
        if(err){
            console.log("No existe el entrenamiento " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("entrenamiento Seleccionada")
        res.json(rows)
    })
});


router.get('/byuser/:correo/:nombre', (req, res) => {
    console.log("Seleccionar entrenamiento con id: "+ req.params.correo)
    console.log("Seleccionar entrenamiento con usuario: "+ req.params.nombre)

    const Identrenamiento= req.params.correo
    const IdUsuario= req.params.nombre

    const queryString = "SELECT a.id_a, DATE_FORMAT(e.fecha, '%M %d %Y') AS fecha, e.hora, u.nombre, e.puntos FROM agendado AS a INNER JOIN users AS u ON u.id_u = a.id_usuario INNER JOIN entrenamiento AS e ON e.id_e = a.id_e  WHERE e.id_u = (SELECT id_u FROM users WHERE correo =?) AND a.id_usuario = (SELECT id_u FROM users WHERE nombre = ?)"
    pool.query(queryString, [Identrenamiento, IdUsuario],(err, rows, fields) => {
        if(err){
            console.log("No existe el entrenamiento " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("entrenamiento Seleccionada")
        res.json(rows)
    })
});

router.get('/agendados/:correo', (req, res) => {
    console.log("Seleccionar entrenamiento agendados con id: "+ req.params.correo)

    const Identrenamiento= req.params.correo
    const queryString = "SELECT DATE_FORMAT(e.fecha, '%M %d %Y') AS fecha, e.hora, u.nombre FROM agendado AS a INNER JOIN users AS u ON u.id_u = a.id_usuario INNER JOIN entrenamiento AS e ON e.id_e = a.id_e  WHERE e.id_u = (SELECT id_u FROM users WHERE correo =?)"
    pool.query(queryString, [Identrenamiento],(err, rows, fields) => {
        if(err){
            console.log("No existe el entrenamiento " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("entrenamiento Seleccionada")
        res.json(rows)
    })
});

module.exports = router;

