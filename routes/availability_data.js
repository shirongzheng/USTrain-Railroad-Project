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


    let query =
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

    console.log(query);

    db.query(query)
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
