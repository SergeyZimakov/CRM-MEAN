const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const categoryRoutes = require('./routes/category');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb connected'))
    .catch(error => console.log(error))

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/category', categoryRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    });
}


module.exports = app;