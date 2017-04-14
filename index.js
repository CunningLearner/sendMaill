'use strict';

const express = require('express');
const bodyParser = require('body-parser');


var mqtt = require('mqtt')
var fs = require('fs');

var client = mqtt.connect('mqtt://broker.hivemq.com', {username:'gs99100', password:'horrendous'});


client.subscribe('apiai/ireading')
client.subscribe('apiai/sreading')

client.on('message', function (topic, message) {
  // message is Buffer 
  if (topic == 'apiai/sreading') {
  var sensoread = message.toString()
  console.log(message.toString())
 // fs.writeFile("test", sensoread, function(err) {
   // if(err) {
     //   return console.log(err);
    //}
//console.log("The file was saved!");
//});
}
})
const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';
	var speed = 'empty speed';


        if (req.body) {
            var requestBody = req.body;
		
	    	    
		

if (requestBody.result) {
	 speed = requestBody.result.resolvedQuery;
	 speed += ' ';
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }


        }

        console.log('result: ', speech);
		client.publish('apiai/ireading', speech)
		//console.log("rest in peace")
	    if(speed != "sensor "){

		    fs.writeFile("test", speed, function(err) {
    			if(err) {
       		     	    return console.log(err);
    			}
			});

}
	

		if(speed == "send a mail to himanshu "){
		    var sendmail = require('sendmail')();
 
sendmail({
    from: 'gs99100@getnada.com',
    to: 'gs99100@getnada.com ',
    subject: 'test sendmaillll',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});


							}
	

	

		fs.readFile('test','utf8', function(err, contents) {
					console.log("The content of the file"+contents);
//});
				
		var sread = contents
		if (speech == "sensor "){
			speech=sread;}
        return res.json({
            speech: speech,
            displayText:sread,
            source: 'apiai-webhook-IOTecosystem'
        });
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});