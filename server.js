const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server:server });

require('dotenv').config();



app.use(logger);
app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(logError);


app.get('*', (req, res) => res.status(200).send("only API"));

wss.on('connection', (ws) => {
    console.log('new client: '+ ws);
    ws.send('Welcome New Client!');
  
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
  
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });


function logError(error, req, res, next) {

    if (error) {
        console.log("error");
        res.status(400).send('error');
    } else {
      next();
    }
}


function logger(req, res, next) {
    const ipAddr = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    console.log(ipAddr + ' ' + req.method + ''+ req.url);
    next();
}

// listener

const port = process.env.PORT || 80;

server.listen(port, () => {
    console.log('Listening on port '+ port +'..');
});