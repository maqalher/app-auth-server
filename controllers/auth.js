
const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
// const { validationResult } = require('express-validator');

const crearUsuario = async(req, res = response) => {
    
    // const errors = validationResult(req); 
    // // console.log(errors);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

    // console.log(req.body);
    const {email, name, password} = req.body;

    try {

        // Verificar el mail
        const usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        // Has password
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // Generar JWT
        const token = await generarJWT(dbUser.id, name);

        // Crear usuario de BD
        await dbUser.save();

        // Generar respeusta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const loginUsuario = async(req, res = response) => {

    // console.log(req.body);
    const {email, password} = req.body;

    try {

        const dbUser = await Usuario.findOne({email});

        if(!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        // confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            })
        }

        // Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        // Respuesta
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const revalidarToken = async(req, res = response) => {

    // const token = req.header('x-token');

    // if(!token) {
    //     return res.status(401).json({
    //         ok: false,
    //         msg: 'error en el token'
    //     })
    // }

    // viende del middlewear validar-jwt
    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid, 
        name,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}