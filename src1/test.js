const io = require('socket.io');
const SerialPort = require("serialport");
const parser = new ReadlineParser({ delimeter: "\r\n" });
//const parser2 = new ReadlineParser({ delimeter: "\r\n" });

//conection with Arduino 
const port = new SerialPort.SerialPort({
    path: "COM11",
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

if (error) throw error;
results.forEach(result => {
 fieldvalue = result.username;
 console.log(fieldvalue);
});

  io.on('connection', function(data) {
    if(fieldvalue == "Jimmy"){
    console.log('Node is listening to port');

    data.on('lights', function(data){
      port.write(data.status);
      console.log(data);
    })
  }
});

parser.on('data', function(data) {

    console.log(data);

    io.emit('data', data);

});