const { Router } = require('express');

const router = Router();

router.get('/health', function(req) {
    req.json({ success: true });
});

module.exports = router;