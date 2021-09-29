const express = require('express');
const router = express.Router();
const dataConection = require('../dataConection').pool;
const jwt = require('jsonwebtoken');

//Lista dados de um usuário específico
router.get('/consultar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {

        const user_name = req.body.user_name;

        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            'SELECT * FROM users WHERE user_name = ?',
            [
                user_name
            ],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ 
                        error: error
                    })
                }
                return res.status(200).send({
                    user_data: result
                })
            }
        )
    })
});

//Insire um usuario
router.post('/cadastrar', (req, res, next) => {
    
    dataConection.getConnection((error, conn) => {

        const {user_name, full_name, cpf, bth_date, gender, email, pass_wd, phone, type_user} = req.body;

        if (user_name === ''){
            return res.status(401).send({
                msg: 'Favor digitar o nome de usuário.'
            })
        }if (full_name === ''){
            return res.status(401).send({
                msg: 'Favor digitar o nome.'
            })
        }else if (cpf === ''){
            return res.status(401).send({
                msg: 'Favor digitar o seu CPF.'
            })
        }else if (cpf.length < 11){
            return res.status(401).send({
                msg: 'Favor digitar um CPF válido.'
            })
        }else if (bth_date === ''){
            return res.status(401).send({
                msg: 'Favor informar a sua data de nascimento.'
            })
        }else if (email === ''){
            return res.status(401).send({
                msg: 'Favor digitar o seu email.'
            })
        }else if (pass_wd === ''){
            return res.status(401).send({
                msg: 'Favor digitar uma senha.'
            })
        }else if (pass_wd.length < 6){
            return res.status(401).send({
                msg: 'A senha deve conter no mínimo 6 caractéres.'
            })
        }else {
        conn.query(
            'INSERT INTO users (user_name, full_name, cpf, bth_date, gender, email, pass_wd, phone, type_user, user_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "A")',
            [user_name, full_name, cpf, bth_date, gender, email, pass_wd, phone, type_user],
            (error, result, field) => {
                conn.release();

                if (error.sqlState === "23000") {
                    return res.status(422).send({
                        error: "Usuário já cadastrados."
                    });
                }else if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }else {
                
                res.status(201).send({
                    msg: 'Usuário: ' +user_name+ ' cadastrado com sucesso',
                    user_id: result.insertId
                });
            }})
        }
    })
});

// Alterar dados do usuário
router.put('/alterar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {

        const {user_name, full_name, cpf, bth_date, gender, email, pass_wd, phone, type_user} = req.body;

        if (error) {return res.status(500).send({ 
            erro: error
        })}
        
        conn.query(
            `UPDATE users
              SET   full_name = ?,
                    cpf       = ?,
                    bth_date  = ?,
                    gender    = ?,
                    email     = ?,
                    pass_wd   = ?,
                    phone     = ?,
                    type_user = ?
                    WHERE    user_name = ?`,
            [
                full_name,
                cpf,
                bth_date,
                gender,
                email,
                pass_wd,
                phone,
                type_user,
                user_name
            ],
            (error, result, field) => {
                conn.release();
                if (error) {return res.status(500).send({ erro: error}) }

                res.status(201).send({
                    msg: 'Usuário ' +user_name+ ' alterado com sucesso.'
                })})
    })
})

//Desativar usuário 
router.delete('/desativar', (req, res, next) => {
    dataConection.getConnection((error, conn) => {

        const user_name = req.body.user_name;

        if (error) {return res.status(500).send({
            error: error 
        })}

        conn.query(
            `UPDATE users
              SET user_status = "D"
              WHERE user_name = ?`,
            [
                user_name
            ],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({ 
                    erro: error
                })}
                
                res.status(201).send({
                    msg: 'Usuário ' +user_name+ ' desativado com sucesso.'
                })}
        )
    })
})

module.exports = router;