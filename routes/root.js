let router = require('express').Router();
let db = require('../database/connect');

router.get('/', (req, res) =>
{
    db.any('select * from station')
    .then((data) =>
    {
        res.json(data);
    })
    .catch((err) =>
    {
        res.send('There was an error trying to retrive data fro station table');
    })
    // will render from template: ../views/root.ejs
    // res.render('root', { example_data : 'Hello from router!' });
});

module.exports = router;
