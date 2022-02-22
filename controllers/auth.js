
const { response } = require('express');

const crearUsuario = (req, res = response) => {
    // console.log(req.body);
    const {email, name, password} = req.body;

    return res.json({
        ok: true,
        msg: 'Crear usuario /new'
    });

}

const loginUsuario = (req, res) => {
    // console.log(req.body);
    const {email, password} = req.body;

    return res.json({
        ok: true,
        msg: 'Login de usuario /'
    });

}

const revalidarToken = (req, res) => {

    return res.json({
        ok: true,
        msg: 'renew'
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}