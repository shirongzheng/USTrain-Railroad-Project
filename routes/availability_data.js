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

    let additional_query = '';

    if(req.body.time === 'morning')
    {
        additional_query =
        `AND s.arrival_time >= TIME '04:00' AND s.arrival_time < TIME '12:00'`;
    }
    else if(req.body.time === 'afternoon')
    {
        additional_query =
        `AND s.arrival_time >= TIME'12:00' AND s.arrival_time < TIME '20:00'`;
    }
    else if(req.body.time === 'evening')
    {
        additional_query =
        `AND (s.arrival_time >= TIME '20:00' OR ` +
        `(s.arrival_time >= TIME '0:0' AND s.arrival_time < TIME '4:00'))`
    }


    let query2 =
    `
    SELECT train_id, arrival_time, departure_time
    FROM
    train AS t INNER JOIN stops_at AS s
    on
    (
        t.id = s.train_id AND
        t.start_station
            ${req.body.from_station > req.body.to_station? '>' : '<'}
        t.end_station AND
        s.station_id = ${req.body.from_station} AND
        t.days like '${schedule}'
        ${additional_query}
    );
    `;

    let query1 =
    `
    SELECT id, distance, base_fare FROM segment
    WHERE
        start_station >= ${Math.min
            (
                Number(req.body.from_station),
                Number(req.body.to_station)
            )} AND
        end_station <= ${Math.max
            (
                Number(req.body.from_station), Number(req.body.to_station)
            )};
    `;


    let segments;
    let query_2_result;
    let seats_free;
    let base_fare = 0;
    let distance = 0;

    db.query(query1)
    .then((result) =>
    {
        segments = result;
        for(let i = 0 ; i < result.length; ++i)
        {
            base_fare += Number(result[i].base_fare);
            distance += Number(result[i].distance);
        }

        return db.query(query2);
    })
    .then((result) =>
    {
        query_2_result = result;
        let ensure_seats_free_set_p = [];
        for(let i = 0; i < result.length; ++i)
        {
            for(let k = 0; k < segments.length; ++k)
            {
                ensure_seats_free_set_p.push
                (
                    db.any
                    (
                        `
                        SELECT ensure_seats_free_set
                        (
                            ${result[i].train_id},
                            ${segments[k].id},
                            '${req.body.date}'
                        );
                        `
                    )
                );
            }
        }

        return Promise.all(ensure_seats_free_set_p);
    })
    .then(() =>
    {
        let seats_free_p = [];
        for(let i = 0; i < query_2_result.length; ++i)
        {
            for(let k = 0; k < segments.length; ++k)
            {
                seats_free_p.push
                (
                    db.one
                    (
                        `
                        SELECT train_id, num_of_free_seats FROM seats_free
                        WHERE
                            train_id=${query_2_result[i].train_id} AND
                            segment_id=${segments[k].id} AND
                            of_date='${req.body.date}'
                        `
                    )
                );
            }
        }

        return Promise.all(seats_free_p);
    })
    .then((result) =>
    {
        seats_free = result;
        let s_f_i = 0; // seats_free index
        for(let i = 0; i < query_2_result.length; ++i)
        {
            let is_seats_free = true;
            for(let m = 0; m < segments.length; ++m)
                if(seats_free[s_f_i++].num_of_free_seats <= 0) is_seats_free = false;
            query_2_result[i].is_seats_free = is_seats_free;
        }
    })
    .then(() =>
    {
        query_2_result = query_2_result.filter((val) =>
        {
            if(val.is_seats_free === true) return val;
        });

        let obj = {};
        obj.trains = query_2_result;
        obj.base_fare = base_fare;
        obj.distance = distance;

        res.json(obj);
    })
    .catch((err) =>
    {
        console.log('ERROR:\n', err);
        res.json({ error : err });
    });
});

module.exports = router;
