module.exports = function asyncRouter(handler) {
    return function(req, res) {
        handler(req, res).catch(e => {
            console.error('Uncaught async router error:', e.message);
            throw e;
        });
    };
};