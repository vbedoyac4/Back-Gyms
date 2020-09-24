const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.post('/add', (req, res) =>{

    console.log("Tratando de agregar review..")
    console.log("Fecha: " + req.body.fecha)
    console.log("Review: " + req.body.review)
    console.log("Calificacion: " + req.body.calificacion)
    console.log("Id_uer: " + req.body.id_user)
    console.log("Id_gym: " + req.body.id_gym)



    const Fecha = req.body.fecha
    const Review =  req.body.review
    const Calificacion = req.body.calificacion
    const Id_User = req.body.id_user
    const Id_Gym = req.body.id_gym

    const queryString = "INSERT INTO review (fecha, review, calificacion, id_user, id_gym)  VALUES  (?, ?, ?, ?, ?)"
    pool.query(queryString, [Fecha, Review, Calificacion, Id_User, Id_Gym], (err, results, fields) =>{
        if (err){
            console.log("Error, el review: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego review con id: ", results.insertId);
        res.end() 
        
    } )
});

router.delete('/delete/:id', (req, res) => {
    console.log("Eliminar review con id: "+ req.params.id)

    const Idreview = req.params.id
    const queryString = "DELETE FROM review WHERE id_e = ?"
    pool.query(queryString, [Idreview],(err, rows, fields) => {
        if(err){
            console.log("No existe review " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("review Eliminado")
        res.json(rows)
    })
});



module.exports = router;

