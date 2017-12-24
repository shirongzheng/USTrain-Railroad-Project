let router = require('express').Router();
let db = require('../database/connect');

router.get('/make_reservation', (req, res) =>
{
    if
    (
        req.session === undefined ||
        req.session.date === undefined ||
        req.session.schedule === undefined ||
        req.session.from_station === undefined ||
        req.session.to_station === undefined ||
        req.session.base_fare === undefined ||
        req.session.distance === undefined ||
        req.session.train_id === undefined ||
        req.session.is_first_class_seats_free === undefined
    )
    {
        return res.redirect(301, '/');
    }

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

router.post('/make_reservation', (req, res) =>
{
    req.session.train_id = req.body.train_id;
    req.session.arrival_time = req.body.arrival_time;
    req.session.is_first_class_seats_free = req.body.is_first_class_seats_free;
    res.redirect(301, '/make_reservation');
});

module.exports = router;