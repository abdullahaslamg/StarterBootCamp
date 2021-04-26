/* eslint-disable prettier/prettier */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// const DB = process.env.DATABASE_LOCAL
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


// Read data from a file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    )

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data has been successfully loaded'); 
    } catch (error) {
        console.log(error)
    }
    process.exit();
}


//DELETE ALL DATA FROM THE DATABASE
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Database has been delete successfully');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

