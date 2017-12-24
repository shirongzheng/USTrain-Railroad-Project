let router = require('express').Router();
let db = require('../database/connect');

router.post('/make_reservation', (req, res) =>
{
    req.session.train_id = req.body.train_id;
    req.session.arrival_time = req.body.arrival_time;
    req.session.is_first_class_seats_free = req.body.is_first_class_seats_free;

    db.query
    (
        `
        SELECT name FROM station WHERE
            id = ${req.session.from_station} OR
            id = ${req.session.to_station}
        `
    )
    .then((result) =>
    {
        req.session.from_station_name = result[0].name;
        req.session.to_station_name = result[1].name;
        res.render('reservation', req.session);
    })
    .catch((err) =>
    {
        console.log('Error:\n', err);
        res.render('reservation', req.session);
    });
});

module.exports = router;