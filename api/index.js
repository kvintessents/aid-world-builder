require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Create express instance
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

app.use(rateLimiter());

app.use(bodyParser.json());
app.use(cookieParser());

// Import API Routes
app.use(require('./routes/auth'));
app.use(require('./routes/health'));
app.use(require('./routes/feedback'));
app.use(require('./routes/migrate/migrate'));
app.use(require('./routes/users'));
app.use(require('./routes/worlds'));

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