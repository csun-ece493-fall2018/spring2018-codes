/**
 * California State University Northridge
 * ECE 493 Senior Design
 * Project: Ultrasonic radar
 * Participants: Hambartzum Gamburian, Giovanni Alonzo, Saba Janamian, Hamed Seyedroudbari, Andrew Zaragoza, Xiaoao Feng
 * Advisor: Dr. Shahnam Mirzaei
 * Code Description: Local NodeJs server to listen to a serial port on the local machine and send the read data to an external server
 * Author: Saba Janamian
 * Version: 1.0
 * Date: 3/7/2018
 **/

/////////////////////////////////////////////
//   Include libraries
////////////////////////////////////////////
// Include the serialport library
var SerialPort = require('serialport');
// Include string_decoder library
var { StringDecoder } = require('string_decoder');
// Include query string library
var querystring = require('querystring');
// Include http library
var http = require('http');
// Define the decoding mode to be utf8
var decoder = new StringDecoder('utf8');

/////////////////////////////////////////////
//   Connect to the local serial port
////////////////////////////////////////////

var msg = "";
// Define the serial port to listen to
var port = new SerialPort("/dev/cu.usbmodem1421", {
  baudRate: 9600
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});

/////////////////////////////////////////////
//   Read the data from the serial prot
////////////////////////////////////////////

// Switches the port into "flowing mode"
port.on('data', function (data) {
  data_decoded = Buffer.from(data);
  if(data_decoded.indexOf('~') > -1 ){
    msg = msg+data_decoded;
    console.log(msg);
    send_http_request("?id=1&value="+msg);
  msg = "";
  }else {
  msg = msg+data_decoded;
  }
});

/////////////////////////////////////////////
//   Send data to the server as Http request
////////////////////////////////////////////
function send_http_request(data) {

var options = {
  host: 'localhost', // In the production we will change the localhost to a public domain over the internet
  port: '8888',
  path: '/api'+data
};

var req = http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
  })
});

}