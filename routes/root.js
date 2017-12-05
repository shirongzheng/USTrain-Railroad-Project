let router = require('express').Router();

router.get('/', (req, res) =>
{
    // will render from template: ../views/root.ejs
    res.render('root', { example_data : 'Hello from router!' });
});

module.exports = router;
