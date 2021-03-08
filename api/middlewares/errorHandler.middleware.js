module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.error === 'rate-limiter') {
        res.status(429);
        res.json({ success: false, payload: err.details, error: 'API Rate limiting exceeded.' });
    } else {
        res.status(500);
        res.json({ success: false, payload: null, error: err.message });
    }
};
