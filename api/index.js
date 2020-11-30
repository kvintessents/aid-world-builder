require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter.middleware');

// Require API routes
const bodyParser = require('body-parser');

// Create express instance
const app = express();

app.use(rateLimiter());

app.use(bodyParser.json());

// Import API Routes
app.use(require('./routes/health'));
app.use(require('./routes/auth'));
app.use(require('./routes/users'));
app.use(require('./routes/posts'));
app.use(require('./routes/upvotes'));
app.use(require('./routes/comments'));
app.use(require('./routes/test'));
app.use(require('./routes/worlds'));

app.use(require('./routes/thumbnails'));

app.use(errors());
app.use(require('./middlewares/errorHandler.middleware'));

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
    const port = global.process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}