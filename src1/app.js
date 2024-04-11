var fieldvalue
const express = require('express');
const app = express();
const app2 = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
app.use('/pictures', (express.static('./pictures')));
app.use('/Startscherm', (express.static('./Startscherm')));
app.use('/src1', (express.static('./src1')));
app.use('/Select', (express.static('./Select')));
app.use('/Saldo', (express.static('./Saldo')));
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
  res.sendFile(path.join(__dirname, '../Startscherm/Startscherm.html'));
  //res.sendFile(path.join(__dirname, '../Startscherm/Startscherm.html'));
  
});
app.get('/data', (req, res) => {
  res.json(data1);
})
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

  
  const mysql = require('mysql2');
  const db = mysql.createConnection({
    host: 'db', // This should match the server name in Adminer (in your case, 'db')
    user: 'root', // Username for your MySQL database (in your case, 'root')
    password: 'mypassword', // Password for your MySQL database (in your case, 'mypassword')
    database: 'mysql' // Name of the database you want to connect to (in your case, 'mysql')
  });
  
  // Connect to MySQL database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  
  // Example of handling GET request to fetch users
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
      
  });


  
  const fs = require('fs');
  const jsonData = fs.readFileSync(path.join(__dirname, 'data.json'));
  const data1 = JSON.parse(jsonData);
  console.log(data1);
  
  
  parser.on('data', function(data) {
    if(data.trim() === 'accepted'){
      io.emit('accepted')
    }
    
    if(data.trim() === 'button1'){
      io.emit('button1');
    }
    if(data.trim() === 'button3'){
      io.emit('button3');
    }
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
        
  }
      
});
  io.on('check', (data1) => {
    console.log('received: ', data1.input);
    console.log('correct: ', data1.correct);

    if(data1.input){
      io.emit('Result', 'correct');
    }else{io.emit('Result', 'incorrect');}
  })




  server.listen(3000, ()=>{
    console.log("connected on port 3000");
  });
  


