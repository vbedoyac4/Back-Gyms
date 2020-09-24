const express = require('express');
const router = express.Router();
const pool = require('../database');
const multer = require("multer");
const path = require('path');


router.get('/proveedor/:id_u', (req, res) => {

    console.log("Seleccionar proveedor por id_u: " + req.params.id_u)
    const id_u = req.params.id_u

    const queryString = "SELECT u.id_u AS id_u, u.imageUrl AS imageUrl, u.nombre AS nombre, u.tipo, sum(r.calificacion)/count(r.calificacion) AS calificacion FROM users AS u INNER JOIN review as r on u.id_u = r.id_gym WHERE u.id_u = ?  GROUP BY r.id_gym ;"
    pool.query(queryString, [id_u], (err, rows, fields) => {
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

router.get('/all_proveedores', (req, res) => {

    console.log("Seleccionar todos: ")

    const queryString = "SELECT * FROM users WHERE TRIM(IFNULL(tipo,'')) <> '' ;"
    pool.query(queryString, (err, rows, fields) => {
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

///////PRACTICAS////////
router.get('/practicas', (req, res) => {

    console.log("Seleccionar todos: ")

    const queryString = "SELECT * FROM practicas ORDER BY practica ASC;"
    pool.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("No hay practicas " + err)
            res.json({ status: 500 })
            res.end()
            return
        }
        console.log("Practicas Seleccionados")
        res.json(rows)
    })
});

////////////////////////

//////////////////////////RESERVAS//////////////////////
router.get('/reservas/:correo', (req, res) => {
    console.log("Seleccionar review con id: "+ req.params.correo)

    const correo= req.params.correo
    const queryString = "SELECT p.nombre AS nombre, DATE_FORMAT(e.fecha, '%M %d %Y') AS fecha, e.hora AS hora FROM users AS p INNER JOIN entrenamiento AS e ON p.id_u = e.id_u INNER JOIN agendado AS a ON a.id_e = e.id_e WHERE a.id_usuario = (SELECT id_u FROM users WHERE correo = ?) ORDER BY id_a DESC;"
    pool.query(queryString, [correo],(err, rows, fields) => {
        if(err){
            console.log("No existe reservas " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Reservas Seleccionada")
        res.json(rows)
    })
});

router.post('/addreserva', (req, res) =>{

    console.log("Tratando de agregar reserva..")
    console.log("id_u: " + req.body.fecha)
   
    const Id_u = req.body.id_u

    const queryString = "INSERT INTO compra (id_u, puntos_c) VALUES ((SELECT id_u FROM users WHERE nombre = ?), 35);"
    pool.query(queryString, [Id_u], (err, results, fields) =>{
        if (err){
            console.log("Error, el pago: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego pago con id: ", results.insertId);
        res.end() 
        
    } )
});
///////////////////////////////////////////////////////

/////////////////////////PAGO MEMBRESIA//////////////////////////////
router.post('/addpago', (req, res) =>{

    console.log("Tratando de agregar pago..")
    console.log("id_u: " + req.body.fecha)
   
    const Id_u = req.body.id_u

    const queryString = "INSERT INTO compra (id_u, puntos_c) VALUES ((SELECT id_u FROM users WHERE nombre = ?), 35);"
    pool.query(queryString, [Id_u], (err, results, fields) =>{
        if (err){
            console.log("Error, el pago: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego pago con id: ", results.insertId);
        res.end() 
        
    } )
});
///////////////////////////////////////////////////////

///////////////////////ENTRENAMIENTOS/////////////////////////////
router.get('/entrenamientos/:nombre', (req, res) => {
    console.log("Seleccionar review con id: "+ req.params.nombre)

    const nombre= req.params.nombre
    const queryString = "SELECT DATE_FORMAT(fecha, '%M %d %Y') AS fecha ,hora, cupos FROM entrenamiento WHERE id_u = (SELECT id_u FROM users WHERE nombre = ?) ;"
    pool.query(queryString, [nombre],(err, rows, fields) => {
        if(err){
            console.log("No existen entrenamientos " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Entrenamientos Seleccionada")
        res.json(rows)
    })
});

////////////////////////AGENDAR ENTRENAMIENTO////////////////

router.post('/addentrenamientos', (req, res) =>{

    console.log("Tratando de agregar pago..")
    console.log("fecha: " + req.body.fecha)
    console.log("hora: " + req.body.hora)
    console.log("nombre: " + req.body.nombre)
    console.log("id_u: " + req.body.id_u)
   
   
    const fecha = req.body.fecha
    const hora = req.body.hora
    const nombre= req.body.nombre
    const id_u = req.body.id_u
    const cupo = 1

    const queryString = "INSERT INTO agendado (id_e, id_usuario, cupo, id_prov) VALUES ((SELECT id_e FROM entrenamiento WHERE fecha = ? AND hora = ? AND id_u = (SELECT id_u FROM users WHERE nombre = ?)), (SELECT id_u FROM users WHERE correo = ?), ?, (SELECT id_u FROM users WHERE nombre = ?));"
    pool.query(queryString, [fecha, hora, nombre, id_u, cupo, nombre], (err, results, fields) =>{
        if (err){
            console.log("Error, el pago: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego pago con id: ", results.insertId);
        res.end() 
        
    } )
});
///////////////////////////////////////////////////////

////////////////PUNTOS////////////////////////////////
router.get('/puntos/:correo', (req, res) => {
    console.log("Seleccionar puntos del usuario con correo: "+ req.params.correo)

    const correo = req.params.correo
    const queryString = "SELECT SUM(puntos_c) - (SELECT SUM(cupo)*3 FROM agendado WHERE id_usuario = (SELECT id_u FROM users WHERE correo = ?)) AS puntos FROM compra WHERE id_u = (SELECT id_u FROM users WHERE correo = ?);"
    pool.query(queryString, [correo, correo],(err, rows, fields) => {
        if(err){
            console.log("No tiene puntos " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Puntos Seleccionada")
        res.json(rows)
        res.status(200)
    })
});
/////////////////////////////////////////////////////

///////////////ACTUALIZAR CUPOS/////////////////////////////
router.put('/update/:nombre/:fecha/:hora', (req, res) => {
    //Conexion
    console.log("Tratando de editar un registro..")
    console.log("nombre = "+ req.params.nombre)
    console.log("fecha = "+ req.params.fecha)
    console.log("hora = "+ req.params.hora)


    const nombre = req.params.nombre
    const fecha = req.params.fecha
    const hora = req.params.hora

        const queryString2 = "UPDATE entrenamiento SET cupos = (cupos-1) WHERE id_u = (SELECT id_u FROM users WHERE nombre = ?) AND fecha = ? AND hora = ?"
        pool.query(queryString2, [nombre, fecha, hora], (err, results, fields) => {
            if (err) {
                console.log("Error al editar un Registro: " + err)
                res.sendStatus(400)
                return
            }
            res.status(200).json({
                ok: true,
                respuesta: results.affectedRows
            });
            res.end()
        })

    })

///////////////////////////////////////////////////////////

module.exports = router;