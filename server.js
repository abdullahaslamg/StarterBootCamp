const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({path: './config.env'});
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>', process.env.DATABASE_PASSWORD
//     )
const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(con => {
    console.log('Connection successful');
}).catch(err => {
    console.log('Error');
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
})
