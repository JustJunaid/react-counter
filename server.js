const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB config goes here
const dbURI = require('./config/keys').dbURI
// const dbRoute = "mongodb://localhost:27017/Building";  // Local DB

mongoose.connect(
  dbURI,
  { useNewUrlParser: true })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Something went wrong connecting DB', err))

const db = mongoose.connection

// API calls
app.post('/addData', (req, res) => {
  db.collection('Building').insertOne(
    { 'name': req.body.name, 
    'floors': req.body.floors, 
    'flats': req.body.flats }, 
        function(err, data) {
          if(err) throw err;
        });
    res.json({'result': 'Success', 'message': 'Data Added Successfully'})
    });

// app.get('/getData', (req, res) => {
//   const name = (req.param)
//   // const name = 'Junior Burj Khalifa'
//   db.collection('Building').findOne({building: name}, (err, data) => {
//     if (err) throw err
//     res.json(data)
//   })
// })


// // Delete all the data from the DB 
// app.get('/deleteData', (req, res) => {
//   db.collection('Building').deleteMany(
//     {}, (err, data) => {
//           if(err) throw err;
//           res.json({'result': 'Success', 'message': 'Data Deleted Successfully'})
//         });
// })



// if (process.env.NODE_ENV === 'production') {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });
// }

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
