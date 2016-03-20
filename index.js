var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var postmark = require("postmark")(process.env.POSTMARK_API_TOKEN)

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

  res.send(coolFace);
  postmark.send({
    "From": "aroldan@hubspot.com",
    "To": "aroldan@gmail.com",
    "Subject": "This is cool!",
    "TextBody": coolFace,
    "Tag": "Faces"
  }, function(error, success) {
    if (error) {
      console.error("Ah crap: " + error.message);
      return;
    }
    console.info("Sent to postmark");
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


