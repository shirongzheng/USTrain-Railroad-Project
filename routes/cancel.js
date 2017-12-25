let router = require('express').Router();
let db = require('../database/connect');

router.post('/cancel', (req, res) =>
{
    if
    (
        req.session === undefined ||
        req.session.trip_id === undefined ||
        req.session.info.reservation_id === undefined ||
        req.session.info.passenger_id === undefined ||
        req.session.info.train_id === undefined ||
        req.session.info.start_station === undefined ||
        req.session.info.end_station === undefined ||
        req.session.info.trip_on_date === undefined ||
        req.session.info.is_first_class === undefined
    )
    {
        return res.status(400).send('INVALID REQUEST');
    }

    let arrival_time = req.session.info.arrival_time;
    arrival_time = arrival_time.split(':');

    let trip_date =
        new Date(req.session.info.trip_on_date)
        .setHours
        (
            Number(arrival_time[0]),
            Number(arrival_time[1]),
            Number(arrival_time[2])
        );
    trip_date = new Date(trip_date).getTime();

    if(trip_date <= new Date().getTime())
    {
        res.render('cancel', { info : 'This trip is no longer cancelable'})
    }

    db.none(`DELETE FROM trip WHERE id = ${req.session.trip_id}`)
    .then(() =>
    {
        return db
        .none(`DELETE FROM reservation where id = ${req.session.info.reservation_id}`);
    })
    .then(() =>
    {
        return db.query
        (
            `
            SELECT id FROM segment
            WHERE
                start_station >= ${Math.min
                    (
                        Number(req.session.info.start_station),
                        Number(req.session.info.end_station)
                    )} AND
                end_station <= ${Math.max
                    (
                        Number(req.session.info.start_station),
                        Number(req.session.info.end_station)
                    )};
            `
        );
    })
    .then((result) =>
    {
        let seats_free_update_p = [];
        for(let i = 0; i < result.length; ++i)
        {
            seats_free_update_p.push
            (
                db.none
                (
                    `
                    UPDATE seats_free
                    SET
                        num_of_free_seats = num_of_free_seats + 1
                        ${req.session.info.is_first_class ?
                        ', first_class_seats = first_class_seats + 1' : ' '}
                    WHERE
                        train_id = ${req.session.info.train_id} AND
                        segment_id = ${result[i].id} AND
                        of_date = '${req.session.info.trip_on_date}'
                    `
                )
            );
        }

        return Promise.all(seats_free_update_p);
    })
    .then(() =>
    {
        req.session.destroy();
        res.render('cancel',
        { info : 'Trip cancallation was successful and your session has been closed'});
    })
    .catch((err) =>
    {
        console.log('Error:\n', err);
        res.render('cancel',
        { info : 'Trip Cancallation was unsuccessful for unexpected error'});
    })
});

module.exports = router;