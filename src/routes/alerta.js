const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.post('/add_alerta', (req, res) =>{

    console.log("Tratando de agregar alerta..")
    console.log("Mensaje: " + req.body.Mensaje)
    console.log("IdCaso: " + req.body.IdCaso)
    console.log("IdComentario: " + req.body.IdComentario)
    console.log("IdUser: " + req.body.IdUser)


    const Mensaje = req.body.Mensaje
    const IdCaso =  req.body.IdCaso
    const IdComentario = req.body.IdComentario
    const IdUser = req.body.IdUser

    const queryString = "INSERT INTO alerta (Mensaje, IdCaso, IdComentario, IdUser)  VALUES  (?, (SELECT IdCaso FROM casos WHERE caso = ?), (SELECT IdComentario FROM comentarios WHERE comentario = ?), (SELECT Id FROM users WHERE username = ?))"
    pool.query(queryString, [Mensaje, IdCaso, IdComentario, IdUser], (err, results, fields) =>{
        if (err){
            console.log("Error, el alerta: "+ err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
        console.log("Se agrego alerta con id: ", results.insertId);
        res.end() 
        
    } )
});

router.put('/edit_alerta/:id', (req, res) =>{

    //Conexion 
    console.log("Tratando de editar alerta..")
    console.log("Mensaje: " + req.body.Mensaje)
    console.log("IdCaso: " + req.body.IdCaso)
    console.log("IdComentario: " + req.body.IdComentario)
    console.log("IdUser: " + req.body.IdUser)
   
    const IdAlerta = req.params.id
    const Mensaje = req.body.Mensaje
    const IdCaso =  req.body.IdCaso
    const IdComentario = req.body.IdComentario
    const IdUser = req.body.IdUser
    
    console.log(IdAlerta)
    const queryString = "UPDATE alerta SET Mensaje = ?, IdCaso = (SELECT IdCaso FROM casos WHERE caso = ?), IdComentario = (SELECT IdComentario FROM comentarios WHERE comentario = ?), IdUser = (SELECT Id FROM users WHERE username = ?) WHERE IdAlerta = ?"
    pool.query(queryString, [Mensaje, IdCaso, IdComentario, IdUser, IdAlerta], (err, results, fields) =>{
        if (err){
            console.log("Error al editar alerta: "+ err)
            res.sendStatus(400)
            return
        }

        console.log("Se edito alerta con id: ", results.affectedRows);
        res.end() 
        
    })
});

router.delete('/delete_alerta/:id', (req, res) => {
    console.log("Eliminar alerta con id: "+ req.params.id)

    const IdAlerta = req.params.id
    const queryString = "DELETE FROM alerta WHERE IdAlerta = ?"
    pool.query(queryString, [IdAlerta],(err, rows, fields) => {
        if(err){
            console.log("No existe el alerta " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("alerta Eliminado")
        res.json(rows)
    })
});

router.get('/alerta/:id', (req, res) => {
    console.log("Seleccionar alerta con id: "+ req.params.id)

    const IdAlerta= req.params.id
    const queryString = "SELECT a.Mensaje, u.username As Usuario, c.Caso as Caso, co.Comentario AS Comentario FROM alerta as a INNER JOIN users as u ON a.IdUser = u.id INNER JOIN casos AS c ON a.IdCaso = c.IdCaso INNER JOIN comentarios as co ON a.IdComentario = co.IdComentario WHERE IdAlerta = ?"
    pool.query(queryString, [IdAlerta],(err, rows, fields) => {
        if(err){
            console.log("No existe el alerta " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("alerta Seleccionada")
        res.json(rows)
    })
});

router.get('/alertas', (req, res) => {
    console.log("Seleccionar todos los alertas")

    const queryString = "SELECT a.Mensaje, u.username As Usuario, c.Caso as Caso, co.Comentario AS Comentario FROM alerta as a INNER JOIN users as u ON a.IdUser = u.id INNER JOIN casos AS c ON a.IdCaso = c.IdCaso INNER JOIN comentarios as co ON a.IdComentario = co.IdComentario"
    pool.query(queryString,(err, rows, fields) => {
        if(err){
            console.log("No hay alertas " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("alertas Seleccionados")
        res.json(rows)
    })
});

module.exports = router;

