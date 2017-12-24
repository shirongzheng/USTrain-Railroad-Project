let router = require('express').Router();
let db = require('../database/connect');

router.post('/checkout', (req, res) =>
{
    if
    (
        req.session !== undefined &&
        req.session.date !== undefined &&
        req.session.schedule !== undefined &&
        req.session.from_station !== undefined &&
        req.session.to_station !== undefined &&
        req.session.base_fare !== undefined &&
        req.session.distance !== undefined &&
        req.session.train_id !== undefined &&
        req.session.is_first_class_seats_free !== undefined &&
        req.session.user_id !== undefined &&
        req.session.name !== undefined &&
        req.session.address !== undefined &&
        req.session.email !== undefined &&
        req.session.phone !== undefined &&
        req.session.is_first_class !== undefined &&
        req.session.is_bringing_pet !== undefined &&
        req.session.passenger_type !== undefined &&
        req.session.payment_type !== undefined &&
        req.session.is_first_class !== undefined &&
        req.session.is_bringing_pet !== undefined &&
        req.session.passenger_type !== undefined &&
        req.session.price !== undefined
    )
    {
        db.one
        (
            `
            INSERT INTO reservation
            (
                passenger_id,
                on_date,
                total_fare,
                payment_type
            )
            VALUES
            (
                '${req.session.user_id}',
                NOW(),
                ${req.session.price},
                ${req.session.payment_type}
            )
            RETURNING id;
            `
        )
        .then((result) =>
        {
            return db.one
            (
                `
                INSERT INTO trip
                (
                    passenger_id,
                    start_station,
                    end_station,
                    reservation_id,
                    train_id,
                    on_date
                )
                VALUES
                (
                    ${req.session.user_id},
                    ${req.session.from_station},
                    ${req.session.to_station},
                    ${result.id},
                    ${req.session.train_id},
                    '${req.session.date}'
                )
                RETURNING id
                `
            );

        })
        .then((result) =>
        {
            req.session.trip_id = result.id;

            return db.query
            (
                `
                SELECT id FROM segment
                WHERE
                    start_station >= ${Math.min
                        (
                            Number(req.session.from_station),
                            Number(req.session.to_station)
                        )} AND
                    end_station <= ${Math.max
                        (
                            Number(req.session.from_station),
                            Number(req.session.to_station)
                        )};
                `
            );
        })
        .then((result) =>
        {
            // TODO ensure seats free doesn't become negative elsewhere
            let update_seats_free_p = [];
            for(let i = 0; i < result.length; ++i)
            {
                update_seats_free_p.push
                (
                    db.none
                    (
                        `
                        UPDATE seats_free
                        SET
                            num_of_free_seats = num_of_free_seats - 1
                            ${req.session.is_first_class === 'on' ?
                            ', first_class_seats = first_class_seats - 1' : ' '}
                        WHERE
                            train_id = ${req.session.train_id} AND
                            segment_id = ${result[i].id} AND
                            of_date = '${req.session.date}'
                        `
                    )
                );
            }

            return Promise.all(update_seats_free_p);
        })
        .then(() =>
        {
            res.render('checkout', req.session);
            req.session.destroy();
        })
        .catch((err) =>
        {
            console.log('Error:\n', err);
            res.status(500).send('Unknown error');
        });
    }
    else
    {
        res.status(404).send('404 NOT FOUND');
    }
});

router.get('/checkout', (req, res) =>
{
    res.status(404).status('404 NOT FOUND');
});


module.exports = router;