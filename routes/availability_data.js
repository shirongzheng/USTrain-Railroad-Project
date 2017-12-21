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

    db.query
    (
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
        );
        `
    )
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
