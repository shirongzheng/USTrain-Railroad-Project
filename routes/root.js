let router = require('express').Router();
let db = require('../database/connect');

router.get('/', (req, res) =>
{
    db.query('SELECT * FROM station')
    .then((result) =>
    {
        res.render('root', { stations : result });
    })
    .catch((err) =>
    {
        res.json(err);
    })
});

router.get('/book', (req, res) =>
{
    db.query('SELECT * FROM station')
    .then((result) =>
    {
        res.render('book', { stations : result});
    })
    .catch((err) =>
    {
        res.json(err);
    })
});

router.post('/', (req, res) =>
{
    console.log(req.body);
    res.send('to be implemented');
});

module.exports = router;
