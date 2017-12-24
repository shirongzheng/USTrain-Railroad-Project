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

router.get('/reservation/lookUp', (req, res) =>
{
    res.render('reservation/lookUp');
});

router.post('/reservation/lookUp', (req, res) =>{
    db.query(`SELECT * FROM passenger WHERE email='${req.body.email.toLowerCase()}' AND name = '${req.body.first_name.toLowerCase()+' '+req.body.last_name.toLowerCase()}'`)
    .then((passenger)=>{
        if(passenger[0] == undefined)
            res.render('reservation/show',{reservation : false, error: "Passenger Not Found. Wrong Name/Email."});
        else{
            db.query(`SELECT * FROM reservation WHERE id=${req.body.reservation_id} AND passenger_id=${passenger[0].id}`)
            .then((reservation)=>{
                if(reservation[0] == undefined)
                    res.render('reservation/show',{reservation : false, error: "Reservation Not Found. Wrong Reservation ID."});
                else
                    res.render('reservation/show',{reservation : reservation[0]});
            }).catch((err) =>{
            res.json(err);
            });
        }
    }).catch((err) =>{
        res.json(err);
    });
});

router.get('/book/:train_id/:arrival_time/:date/:from_station/:to_station', (req, res) =>
{    
    //NEEDS TO BE DONE ->GET AMOUNT OF FREE SEATS + PRICE OF SEAT
    var small_station_id = Math.min(req.params.to_station , req.params.from_station);
    var large_station_id = Math.max(req.params.to_station , req.params.from_station);
    db.query(`SELECT SUM(base_fare) AS "total_base_fare" FROM segment WHERE start_station BETWEEN ${small_station_id} AND ${large_station_id - 1} AND end_station BETWEEN ${small_station_id+1} AND ${large_station_id}`)
    .then((segment_sum)=>{
        db.query(`SELECT * FROM station WHERE id =${req.params.from_station} LIMIT 1`)
        .then((from_station) =>{
            db.query(`SELECT * FROM station WHERE id =${req.params.to_station} LIMIT 1`)
            .then((to_station) =>{
                var base_fare = segment_sum[0].total_base_fare

                var military_reqular= (base_fare/2*2.20).toFixed(2);
                var senior_reqular  = (base_fare/2*2.25).toFixed(2);
                var adult_reqular   = (base_fare/2*2.75).toFixed(2);
                var pet_reqular     = (base_fare/2).toFixed(2);
                var child_reqular   = (base_fare/2*2).toFixed(2);

                var military_first_class= (base_fare/2*4.20).toFixed(2);
                var senior_first_class  = (base_fare/2*4.25).toFixed(2);
                var adult_first_class   = (base_fare/2*4.75).toFixed(2);
                var child_first_class   = (base_fare/2*4).toFixed(2);

                res.render('book/new', {train: req.params.train_id, departureDate : req.params.date, departureTime:req.params.arrival_time,
                                        departureStation: from_station[0].name, arrivalStation:to_station[0].name, military_reqular,senior_reqular,
                                        adult_reqular, pet_reqular, child_reqular, military_first_class, senior_first_class, adult_first_class, child_first_class});
            }).catch((err) =>{
                res.json(err);
            });
        }).catch((err) =>{
            res.json(err);
        });
    }).catch((err) =>{
        res.json(err);
    });    
});

router.post('/reservation/new', (req, res) =>
{
    db.query(`INSERT INTO passenger (email, name, phone) 
              VALUES ('${req.body.email}, ${req.body.first_name +" "+ req.body.last_name}, ${req.body.phone}')`)
    .then((passenger)=>{
        
    }).catch((err) =>{
        res.json(err);
    });
    //RESERVATION NEEDS TO BE CREATED
    //CHANGE reservation_id TO DISPLAY ACTUAL ID
    console.log(req.body);
    var successful = true;
    var reservation_id="1234567"
    res.render('book/confirmation', {successful,reservation_id})

});

module.exports = router;