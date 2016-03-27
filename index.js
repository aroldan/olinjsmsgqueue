var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var multer = require("multer");
var uploads = multer({dest: 'uploads/'});

var redisClient;
var NR = require("node-resque");

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = require("redis").createClient();
}

var resqueConnectionDetails = { redis: redisClient };

var jobs = {
  "add": {
    perform: function(a, b, callback) {
      var answer = a + b;
      callback(null, answer);
    }
  }
};

var scheduler = new NR.scheduler({connection: resqueConnectionDetails});
scheduler.connect(function(){
  scheduler.start();
});


var worker = new NR.worker({ connection: resqueConnectionDetails, queues: 'math'}, jobs);
worker.connect(function() {
  worker.workerCleanup();
  worker.start();
});

// debug output
/////////////////////////
// REGESTER FOR EVENTS //
/////////////////////////

worker.on('start',           function(){ console.log("worker started"); });
worker.on('end',             function(){ console.log("worker ended"); });
worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker); });
worker.on('poll',            function(queue){ console.log("worker polling " + queue); });
worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)); });
worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); });
worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error); });
worker.on('pause',           function(){ console.log("worker paused"); });

scheduler.on('start',             function(){ console.log("scheduler started"); });
scheduler.on('end',               function(){ console.log("scheduler ended"); });
scheduler.on('poll',              function(){ console.log("scheduler polling"); });
scheduler.on('master',            function(state){ console.log("scheduler became master"); });
scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });

var queue = new NR.queue({connection: resqueConnectionDetails}, jobs);
queue.on('error', function(error){ console.log(error); });

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(req, res) {
  var coolFace = cool();

  var number1 = Math.round(Math.random() * 1000)
  var number2 = Math.round(Math.random() * 1000)

  queue.connect(function() {
    queue.enqueue("math", "add", [number1, number2]);
  });

  res.send(coolFace + "\n" +
    "adding " + number1 + " and " + number2
  );
});

app.post('/file-upload', uploads.single('file'), function(request, response) {
  console.info("Got file uploaded.");
  console.info(request.file.path);
  response.send("Cool");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


