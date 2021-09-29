const express = require('express');
const router = express.Router();
const dataConection = require('../dataConection').pool;

//Lista as lembranças 
router.get('/consultar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {
        const FK_id_user = req.body.FK_id_user;

        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM memories WHERE FK_id_user = ?',
            [
                FK_id_user
            ],
            (error, result, field) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }
                return res.status(201).send({
                    memory_of_this_id: result
                })}
        )
    })
});

router.post('/cadastrar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {
        const {title_memory, desc_memory, dt_memory, horary, user_create} = req.body;

        if (title_memory.length > 20){
            return res.status(401).send({
                msg: 'Título muito grande.'
            })}

        if (error) {
            return res.status(500).send({
                error: error
            })}

        conn.query(
            'INSERT INTO memories(title_memory, desc_memory, dt_memory, horary, FK_id_user) VALUES(?, ?, ?, ?, ?)',
            [
                title_memory,
                desc_memory, 
                dt_memory, 
                horary, 
                user_create
            ],
            (error, result, field) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }
                return res.status(201).send({
                    msg: 'Lembrança criada com sucesso. '
                })}
        )
    })
});

router.put('/alterar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {
        const {title_memory, desc_memory, dt_memory, horary, id_memory} = req.body;

        if (title_memory.length > 20){
            return res.status(401).send({
                msg: 'Título muito grande.'
            })}

        if (error) {
            return res.status(500).send({
                error: error
            })}
        
        conn.query(
            `UPDATE memories
              SET title_memory   = ?,
                 desc_memory     = ?,
                 dt_memory       = ?,
                 horary          = ?
                 WHERE id_memory = ?`,
            [
                title_memory,
                desc_memory, 
                dt_memory,
                horary,
                id_memory
            ],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })}

                res.status(201).send({
                    msg: 'Lembrança alterada com sucesso.'
                })}
        )
    })
});

router.delete('/desativar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {
        const id_memory = req.body.id_memory;

        if (error) {
            return res.status(500).send({
                error: error
            })}
        
        conn.query(
            `UPDATE memories
              SET memory_status = "D"
              WHERE id_memory = ?`,
            [
                id_memory
            ],
            (error, result, fiel) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                res.status(201).send({
                    msg: 'Lembrança excluida'
                })}
        )
    })
})

module.exports = router;