/**  Ensure this is the last route in line to be checked by express */
let router = require('express').Router();

/** For both get and post to any route (given any other handler before this hasn't
 *  served requested resources, send 404 status code with corresponding message) */
router.all('*', (req, res) =>
{
    res.status(404).send('404 NOT FOUND');
});

/** Exports needed to be able to include handler in index in app.use(...) */
module.exports = router;
