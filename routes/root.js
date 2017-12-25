let router = require('express').Router();
let db = require('../database/connect');

router.get('/', (req, res) =>
{
    db.query('SELECT * FROM station')
    .then((result) =>
    {
        let remember = {};
        if(req.session.date !== undefined)
            remember.date = req.session.date;
        if(req.session.from_station !== undefined)
            remember.from_station = req.session.from_station;
        if(req.session.to_station !== undefined)
            remember.to_station = req.session.to_station;
        res.render('root', { stations : result, remember : remember });
    })
    .catch((err) =>
    {
        res.json(err);
    })
});

module.exports = router;
