module.exports = function asyncMiddleware(handler) {
    return (req, res, next) => {
        handler(req, res).then(() => next()).catch(next);
    }
}
