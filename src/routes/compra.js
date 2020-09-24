const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.post('/add', (req, res) =>{

    console.log("Tratando de agregar compra..")
    console.log("Fecha_C: " + req.body.fecha_c)
    console.log("Puntos_c: " + req.body.puntos_c)
    console.log("Id_u: " + req.body.id_u)

    const Fecha_c = req.body.fecha_c
    const Puntos_c =  req.body.puntos_c
    const Id_u = req.body.id_u

    const queryString = "INSERT INTO compra (puntos_c, fecha_c, id_u)  VALUES  (?, ?, ?)"
    pool.query(queryString, [Puntos_c, Fecha_c, Id_u ], (err, results, fields) =>{
        if (err){
            console.log("Error, el compra: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego compra con id: ", results.insertId);
        res.end() 
        
    } )
});


router.get('/get/:id', (req, res) => {
    console.log("Seleccionar compra con id: "+ req.params.id)

    const Idcompra= req.params.id
    const queryString = "SELECT puntos_c, DATE_FORMAT(fecha_c, '%M %d %Y') AS fecha_c, DATE_FORMAT(fecha_v, '%M %d %Y') AS fecha_v FROM compra WHERE id_u = ? ORDER BY id_c DESC LIMIT 10"
    pool.query(queryString, [Idcompra],(err, rows, fields) => {
        if(err){
            console.log("No existe el compra " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("compra Seleccionada")
        res.json(rows)
    })
});

module.exports = router;

