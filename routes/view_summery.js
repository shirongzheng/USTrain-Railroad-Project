let router = require('express').Router();
let db = require('../database/connect');
let validator = require('validator');

router.get('/view_summery', (req, res) =>
{
    console.log('view session', req.session);
    res.send('TO BE IMPLEMENTED');
});

router.post('/view_summery', (req, res) =>
{
    let seconds_diff =
        new Date(req.session.date).getTime()/1000
        -
        new Date(new Date().setHours(0, 0, 0, 0)).getTime()/1000
    let price = (Math.abs(1-(seconds_diff/31536000)) * req.session.base_fare)
                + req.session.base_fare;

    if(req.body.user_id !== undefined)
    {
        db.one(`SELECT * from passenger WHERE id = ${req.body.user_id}`)
        .then((result) =>
        {
            if(result.id === undefined) throw new Error('id not found');
            req.session.user_id = req.body.user_id;
            req.session.name = result.name;
            req.session.address = result.address;
            req.session.email = result.email;
            req.session.phone = result.phone;
            req.session.is_first_class = req.body.is_first_class || 'false';
            req.session.is_bringing_pet = req.body.is_bringing_pet || 'false';
            req.session.passenger_type = req.body.passenger_type;
            req.session.payment_type = req.body.payment_type;
            if(req.session.is_first_class === 'on') price += 50;
            if(req.session.is_bringing_pet === 'on') price += 20;
            if(req.session.passenger_type === 'senior' && price > 30) price -= 30;
            if(req.session.passenger_type === 'children' && price > 20) price -= 20;
            if(req.session.passenger_type === 'militery' && price > 10) price -= 10;

            req.session.price = price.toFixed(2);
            res.render('view_summery', req.session);
        })
        .catch((err) =>
        {
            console.log('Error:\n', err);
            res.redirect(301, '/make_reservation');
        });
    }
    else
    {
        db.one
        (
            `
            INSERT INTO passenger
            (
                name,
                address,
                email,
                phone
            )
            VALUES
            (
                '${validator.escape(req.body.name)}',
                '${validator.escape(req.body.address)}',
                '${validator.escape(req.body.email)}',
                '${validator.escape(req.body.phone)}'
            )
            RETURNING id;
            `
        )
        .then((result) =>
        {
            if(result.id === undefined) throw new Error('insert with no id return');
            req.session.user_id = result.id;
            req.session.name = req.body.name;
            req.session.address = req.body.address;
            req.session.email = req.body.email;
            req.session.phone = req.body.phone;
            req.session.is_first_class = req.body.is_first_class || 'false';
            req.session.is_bringing_pet = req.body.is_bringing_pet || 'false';
            req.session.passenger_type = req.body.passenger_type;
            req.session.payment_type = req.body.payment_type;
            if(req.session.is_first_class === 'on') price += 50;
            if(req.session.is_bringing_pet === 'on') price += 20;
            if(req.session.passenger_type === 'senior' && price > 30) price -= 30;
            if(req.session.passenger_type === 'children' && price > 20) price -= 20;
            if(req.session.passenger_type === 'militery' && price > 10) price -= 10;
            req.session.price = price.toFixed(2);

            res.render('view_summery', req.session);
        })
        .catch((err) =>
        {
            console.log('Error:\n', err);
            res.redirect(301, '/make_reservation');
        });
    }
});

module.exports = router;