'use strict';

// we need to use the dotenv npm package 
require('dotenv').config();

//as well as express!
const express = require('express');
const app = express();
const cors = require('cors');


// get the specified port from our environmental variables
// if there is nothing specified, use port 3000
const PORT = process.env.PORT || 3000;

// tell the server to look in the public folder
// for any routes or static files such as html, images etc...
app.use(express.static('./'));
app.use(cors());



// make a get call to the /location route and 
// return the data located in the geo.json file
// located in our data folder
app.get('/location', (request, response) => {

  try {
    // Mock DATA
    const locaTionData = require('./data/geo.json');
    const location = new Location(request.query.data, locaTionData.results[0]);
    response.send(location);
  }
  catch(error){handleError(error,response);}
});

// Location Constructor Function
function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

app.get('/weather',(request,response)=>{
  try{
    const weatherData=searchToweather(request.query.data);
    response.send(weatherData);
  }
  catch(error){handleError(error,response);}
});

//helper
function searchToweather(){
  let arr=[];
  const weaData=require('./data/darksky.json');

  for(let i=0;i<weaData.daily.data.length;i++){
    arr.push( new Weather(weaData.daily.data[i]));
  }
  return arr;
}

function Weather(demo){
  this.time=new Date(demo.time*1000).toDateString();
  this.forecast=demo.summary;
}


//error handling
function handleError(error,res){
  res.status(500).send('error');
}


//when we connect to the port, tell us what port we are listening too
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))