var fieldvalue
const express = require('express');
const app = express();
const app2 = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
app.use('/pictures', (express.static('./pictures')));
app.use('/', express.static(path.join(__dirname, 'pictures')));
const SerialPort = require("serialport");
const parsers = SerialPort.parsers;

// var bank1 = {
//   hostname: '127.0.0.1',
//   port: app.get('port'),
//   path: '/users',
//   method: 'GET',
//   json:true
// }
// request(bank1, function(error, response, body){
//   if(error) console.log(error);
//   else console.log(body);
// });

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/index.html'));
  // res.sendFile(path.join(__dirname, '../balance/balance.html'));
  
});

// Route to display the image




 


  const { ReadlineParser} = require("@serialport/parser-readline");
  const { Socket } = require('socket.io');
  
  
  const parser = new ReadlineParser({ delimeter: "\r\n" });
  const parser2 = new ReadlineParser({ delimeter: "\r\n" });
  
  //conection with Arduino 
  const port = new SerialPort.SerialPort({
      path: "COM9",
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false
  });


  
  var connectjson = "app.json";
  
  port.write(connectjson);

  
  port.pipe(parser);
  console.log(io.sockets.version); // will print the version number of the socket.io client

  
  // const mysql = require('mysql2');
  // const db = mysql.createConnection({
  //   host: '127.0.0.1',
  //   user: 'root',
  //   password: 'mypassword',
  //   database: 'mysql'
  // });
  
  // // Connect to MySQL
  // db.connect((err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log('Connected to MySQL');
  // });
  
  // // Example of handling GET request to fetch users
  // app.get('/api/users', (req, res) => {
  //   const sql = 'SELECT * FROM users';
  
  //   db.query(sql, (err, result) => {
  //     if (err) {
  //       throw err;
  //     }
  //     res.json(result);
  //   });
  // });


    io.on('connection', function(data) {
      if(fieldvalue == "Jimmy"){
      console.log('Node is listening to port');
      
      data.on('lights', function(data){
        port.write(data.status);
        console.log(data);
      })
    }
  });

  const fs = require('fs');
  const jsonData = fs.readFileSync(path.join(__dirname, 'data.json'));
  const data1 = JSON.parse(jsonData);
  console.log(data1);
  
  
  parser.on('data', function(data) {
    var datarrray = data.split(',');
      
    var key1 = datarrray[0];
    var key2 = datarrray[1];

      //io.emit('data', data);
      io.emit('keypadData', {key1: key1, key2: key2});

      if(data.trim() === 'ZERO'){
        io.emit('erase');
      }
      if(data.trim() === 'enter'){
        io.emit('enter');

    if (data.block === 'sample') {
      io.emit('inputResult', 'correct');
    } else {
      io.emit('inputResult', 'incorrect');
    }
  }});
    




 


// port.write("Hello Arduino\r\n", (err)=>{
//   if(err){
//   console.error("error");
// }
//   else{
// console.log("message sent");
//   }
// }
// )


// io2.on('connection', function(data) {
    
//   console.log('Node is listening to port');
  
// });

// parser.on('data', function(data) {
  
//   console.log(data);
  
//   io2.emit('data', data);
  
// });



  server.listen(3000, ()=>{
    console.log("connected on port 3000");
  });
  


