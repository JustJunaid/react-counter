const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is our MongoDB database
const password = encodeURI('Junaid@1234')
const dbRoute = `mongodb+srv://Junaid:${password}@cluster0-swskp.mongodb.net/Compound?retryWrites=true`;
// const dbRoute = "mongodb://localhost:27017/Building";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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

app.get('/getData', (req, res) => {
  const name = (req.param)
  db.collection('Building').findOne({name: name}, (err, data) => {
    if (err) throw err
   res.json(data)
  })
})


// Delete all the data from the DB 
app.get('/deleteData', (req, res) => {
  db.collection('Building').deleteMany(
    {}, function(err, data) {
          if(err) throw err;
          res.json({'result': 'Success', 'message': 'Data Deleted Successfully'})
          //Doc saved
        });
})



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
