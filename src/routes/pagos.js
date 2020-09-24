const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');



router.post('/add', (req, res) =>{

    console.log("Tratando de agregar pago..")
    console.log("id_a: " + req.body.id_a)
    console.log("id_c: " + req.body.id_c)

    const id_a = req.body.id_a
    const id_c = req.body.id_c

    const queryString = "INSERT INTO pago (id_a, id_c)  VALUES  (?, ?)"
    pool.query(queryString, [id_a, id_c ], (err, results, fields) =>{
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

router.delete('/delete/:id', (req, res) => {
    console.log("Eliminar pago con id: "+ req.params.id)

    const Idpago = req.params.id
    const queryString = "DELETE FROM pago WHERE id_e = ?"
    pool.query(queryString, [Idpago],(err, rows, fields) => {
        if(err){
            console.log("No existe pago " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("pago Eliminado")
        res.json(rows)
    })
});

router.get('/bygym/:id', (req, res) => {
    console.log("Seleccionar pago con id: "+ req.params.id)

    const Idpago= req.params.id
    const queryString = "SELECT DATE_FORMAT(p.fecha, '%M %d %Y') as fecha, u.nombre, e.puntos FROM pago AS p INNER JOIN agendado AS a ON p.id_a = a.id_a INNER JOIN users AS u ON a.id_usuario = u.id_u INNER JOIN entrenamiento AS e ON a.id_e = e.id_e WHERE e.id_u = ? "
    pool.query(queryString, [Idpago],(err, rows, fields) => {
        if(err){
            console.log("No existe el pago " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("pago Seleccionada")
        res.json(rows)
    })
});

router.get('/bydates/:id/:fecha_i/:fecha_f', (req, res) => {
    console.log("Seleccionar pago con id: "+ req.params.id)
    console.log("Seleccionar pago con fecha_i: "+ req.params.fecha_i)
    console.log("Seleccionar pago con fecha_f: "+ req.params.fecha_f)

    const Idpago= req.params.id
    const fecha_i = req.params.fecha_i
    const fecha_f = req.params.fecha_f
    const queryString = "SELECT SUM(e.puntos) AS puntos FROM pago AS p INNER JOIN agendado AS a ON p.id_a = a.id_a INNER JOIN users AS u ON a.id_usuario = u.id_u INNER JOIN entrenamiento AS e ON a.id_e = e.id_e WHERE e.id_u = ? AND (p.fecha BETWEEN ? AND ?) "
    pool.query(queryString, [Idpago, fecha_i, fecha_f],(err, rows, fields) => {
        if(err){
            console.log("No existe el pago " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("pago Seleccionada")
        res.json(rows)
    })
});

/////////////////////////// PUNTOS ACUMULADOS ///////////////////////////////////
router.get('/acumulado/:correo', (req, res) => {
    console.log("Seleccionar los puntos acumulados")
    console.log("Puntos de: "+ req.params.correo)
    const id_u = req.params.correo

    const queryString = "SELECT COUNT(id_prov)*(SELECT puntos FROM entrenamiento WHERE id_u = (SELECT id_u FROM users WHERE correo = ? group by id_u) group by id_u) as id_prov FROM agendado WHERE id_prov = (SELECT id_u FROM users WHERE correo = ?);"
    pool.query(queryString, [id_u, id_u], (err, rows, fields) => {
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

/////////////////////////// ACUULADO A PAGAR ///////////////////////////////////
router.get('/a_pagar/:correo', (req, res) => {
    console.log("Seleccionar los puntos acumulados")
    console.log("Puntos de: "+ req.params.correo)
    const id_u = req.params.correo

    const queryString = "SELECT COUNT(id_prov)*(SELECT puntos FROM entrenamiento WHERE id_u = (SELECT id_u FROM users WHERE correo = ? group by id_u) group by id_u) * 14 as id_e FROM agendado WHERE id_prov = (SELECT id_u FROM users WHERE correo = ?);"
    pool.query(queryString, [id_u, id_u], (err, rows, fields) => {
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
module.exports = router;

