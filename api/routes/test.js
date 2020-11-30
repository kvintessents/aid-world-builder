const { Router } = require('express');
const router = Router();

router.get('/test/:fileName', function (req, res) {
    const { fileName } = req.params;

    res.json({ fileName });
});

module.exports = router;