const { RateLimiterMemory } = require('rate-limiter-flexible');

function getForwardedClientIp(xForwaredFor) {
    if (typeof xForwaredFor !== 'string')
        return null;

    const clientIp = xForwaredFor.split(',')[0].trim();

    if (!clientIp)
        return null;

    return clientIp;
}

module.exports = function rateLimiter(options = {}) {
    const opts = Object.assign({
        points: 10,
        duration: 1, // Per second
    }, options);

    const rateLimiter = new RateLimiterMemory(opts);

    return (req, res, next) => {
        const xForwaredFor = req.headers['x-forwarded-for'];
        const clientIp = getForwardedClientIp(xForwaredFor);

        if (clientIp)
            rateLimiter.consume(clientIp, 1)
                .then(() => {
                    next();
                })
                .catch(rateLimiterRes => {
                    next({ error: 'rate-limiter', details: rateLimiterRes });
                });
        else
            next();
    };
};
