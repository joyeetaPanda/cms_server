const express = require('express');
var router = express.Router();

router.post('/', (req,res) =>{
    res.send(`Hello ${req.body.name}. You have won a ${req.body.prize}.`)
});


module.exports = router;