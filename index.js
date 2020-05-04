var ssid = 'SSID';
var password = 'PWD';

var wifi = require('Wifi');
var http = require('http');

function connectWifi() {
  console.log('Connecting to WiFi');
  d.drawString("Connecting to WiFi",2,15);
  wifi.connect(ssid, {password: password}, function() {
      console.log('Connected to Wifi.  IP address is:', wifi.getIP().ip);
      let ipString = 'IP Address: ' + wifi.getIP().ip;
      printString('Connected to WiFi.', 2, 25);
      d.clear();
      d.flip();
      printString(ipString, 2, 60);
      wifi.save(); // Next reboot will auto-connect
      getBitcoinEur();
      var interval = setInterval(getBitcoinEur, 5000);
  });
}

function getBitcoinEur() {
  console.log('Fetching BTC');
  // using http as https is only possible with recompiling the firmware 
  // See: https://github.com/espruino/Espruino/issues/1777#issuecomment-618232966
  let url = 'http://api.coindesk.com/v1/bpi/currentprice/EUR.json';

  http.get(url, function(res) {
    res.on('data', function(data) {
      let result = data.replace(/(\r\n\t|\n|\r\t)/gm,"");
      result = JSON.parse(result);
      console.log(result);
      d.clear();
      let string = result.bpi.EUR.rate + ' EUR';
      printString('1 BTC', 50, 20, true);
      printString('=', 65, 35, true);
      printString(result.bpi.EUR.rate, 35, 50);
    });
    res.on('close', function(data) {
      console.log("Connection closed");
    });
  });
  }

function show(){
 // write some text
 d.drawString("Initiating!",2,2);
 // write to the screen
 d.flip();
}

function printString(arg1, x, y, size) {
  if ( x == undefined ) {
   let x = 2;
  }
  if ( y == undefined ) {
   let y = 2;
  }
  if ( size == true ) {
    d.setFont('4x6',2);
  }
  d.drawString(arg1,x,y);
  d.flip();
}

function clearDisplay() {
  d.clear();
  d.flip();
}

// I2C
I2C1.setup({scl:D22,sda:D21});
var d = require("SSD1306").connect(I2C1, show);
// Getting state of esp on start
console.log(ESP32.getState());
// Connect to Wifi
connectWifi();