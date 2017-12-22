let router = require('express').Router();
let db = require('../database/connect');

router.get('/', (req, res) =>
{
    db.query('SELECT * FROM station')
    .then((result) =>
    {
        res.render('root', { stations : result });
    })
    .catch((err) =>
    {
        res.json(err);
    })
});

router.get('/book/:train_id/:arrival_time/:date/:from_station/:to_station', (req, res) =>
{    
    //NEEDS TO BE DONE ->GET AMOUNT OF FREE SEATS + PRICE OF SEAT
    db.query(`SELECT * FROM station WHERE id =${req.params.from_station} LIMIT 1`)
    .then((from_station) =>{
        db.query(`SELECT * FROM station WHERE id =${req.params.to_station} LIMIT 1`)
        .then((to_station) =>{
            res.render('book', {train: req.params.train_id, departureDate : req.params.date, departureTime:req.params.arrival_time, departureStation: from_station[0].name, arrivalStation:to_station[0].name});
        }).catch((err) =>{
            res.json(err);
        });
    }).catch((err) =>{
        res.json(err);
    });
    
});

router.post('/', (req, res) =>
{
    console.log(req.body);
    res.send('to be implemented');
});

module.exports = router;