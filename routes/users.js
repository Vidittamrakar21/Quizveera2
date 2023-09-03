const express = require('express');
const userrouter = express.Router();
const usercontrol = require('../controller/user');

userrouter
// .get('/' ,usercontrol.getuser)

// .post('/', usercontrol.createuser)

// .put('/', usercontrol.changeuser)

// .patch('/',usercontrol.updateuser)

// .delete('/', usercontrol.deleteuser);

exports.router = userrouter;