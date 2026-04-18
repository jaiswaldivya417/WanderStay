const express = require('express');
const router = express.Router();

//Index users
router.get('/', (req, res) => {
    res.send('get for users');
});

// Show-users
router.get('/:id', (req, res) => {
    res.send('show user with id ' + req.params.id);
});

// post users
router.post('/', (req, res) => {
    res.send('post for users');
});

//delete users
router.delete('/:id', (req, res) => {
    res.send('delete user with id ' + req.params.id);
});

module.exports = router;