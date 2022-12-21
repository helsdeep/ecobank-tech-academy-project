const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const authRoute = require('./routes/auth');
const userRoutes = require('./routes/user');
const transerRoutes = require('./routes/transfer');

const app = express();

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log('DB connection successful'))
.catch((err)=> console.log(err));

mongoose.set('strictQuery', true);



app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use((err, req, res, next)=> {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong!'
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoutes);
app.use('/api/transfers', transerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));