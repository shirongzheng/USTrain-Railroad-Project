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
        req.session.train_id === undefined
    )
    {
        return res.redirect(301, '/');
    }

    let obj = {};
    obj.date = req.session.date;
    obj.from_station = req.session.from_station;
    obj.to_station = req.session.to_station;
    obj.base_fare = req.session.base_fare;
    obj.distance = req.session.distance;
    obj.train_id = req.session.train_id;
    obj.base_fare = req.session.base_fare;
    obj.distance = req.session.distance;

    db.query
    (
        `
        SELECT name FROM station WHERE
            id = ${obj.from_station} OR
            id = ${obj.to_station}
        `
    )
    .then((result) =>
    {
        obj.from_station_name = result[0].name;
        obj.to_station_name = result[1].name;
        res.render('reservation', obj);
    })
    .catch((err) =>
    {
        console.log('Error:\n', err);
        res.render('reservation', obj);
    });
});

router.post('/make_reservation', (req, res) =>
{
    req.session.train_id = req.body.train_id;
    res.redirect(301, '/make_reservation');
});

module.exports = router;