let router = require('express').Router();
let db = require('../database/connect');

router.get('/review_reservation', (req, res) =>
{
    req.session.destroy();
    res.render('review_reservation');
});

router.post('/review_reservation', (req, res) =>
{
    req.session.trip_id = req.body.trip_id;
    delete req.session.error;

    db.one
    (
        `
        SELECT
            name,
            address,
            email,
            phone,
            re.on_date as reservation_on_date,
            total_fare,
            payment_type,
            tr.start_station,
            tr.end_station,
            tr.train_id,
            tr.passenger_id,
            tr.reservation_id,
            tr.on_date as trip_on_date,
            is_first_class
        FROM
        trip AS tr
        INNER JOIN
        reservation as re
        ON
            tr.id = ${req.session.trip_id} AND
            tr.reservation_id = re.id
        INNER JOIN
        passenger as pa
        ON
            tr.passenger_id = pa.id
        `
    )
    .then((result) =>
    {
        req.session.info = result;
        return db.many
        (
            `
            SELECT name FROM station WHERE
                id = ${result.start_station} OR
                id = ${result.end_station}
            `
        );
    })
    .then((result) =>
    {
        req.session.info.start_station_name = result[0].name;
        req.session.info.end_station_name = result[1].name;

        return db.many
        (
            `
            SELECT arrival_time FROM stops_at
            WHERE
                    train_id = ${req.session.info.train_id} AND
                    (
                        station_id = ${req.session.info.start_station} OR
                        station_id = ${req.session.info.end_station}
                    )
            `
        );
    })
    .then((result) =>
    {
        req.session.info.arrival_time = result[0].arrival_time;
        req.session.info.final_departure_time = result[1].arrival_time;
    })
    .then((result) =>
    {
        res.render('review_reservation', req.session.info);
    })
    .catch((err) =>
    {
        console.log('Error:\n', err);

        if(err.received === 0)
            req.session.error = 'No trip with the given ID was found in database';
        else
            req.session.error = 'Unexpected error, retry or contact admin';

        res.render('review_reservation', req.session);
    });

});

module.exports = router;