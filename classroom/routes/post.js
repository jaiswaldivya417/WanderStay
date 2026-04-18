const express = require('express');
const router = express.Router();

//Index posts
router.get('/', (req, res) => {
    res.send('get for posts');
});

// Show-posts
router.get('/:id', (req, res) => {
    res.send('show post with id ' + req.params.id);
});

// post posts
router.post('/', (req, res) => {
    res.send('post for posts');
});

//delete posts
router.delete('/:id', (req, res) => {
    res.send('delete post with id ' + req.params.id);
});

module.exports = router;