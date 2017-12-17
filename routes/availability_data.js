let router = require('express').Router();
let db = require('../database/connect');

router.post('/availability_data', (req, res) =>
{
    let at = new Date(req.body.date).getDay();
    let schedule = '';
    for(let i = 0; i <= 6; ++i)
    {
        if(i == at) schedule += '1';
        else        schedule += '_';
    }

    // TODO
    db.query(`SELECT id FROM train WHERE days like '${schedule}'`)
    .then((result) =>
    {
        console.log(result);
        res.json(result);
    })
    .catch((err) =>
    {
        res.json({ error : err });
    });
});

module.exports = router;
