
var express = require("express");
var sentiment = require('sentiment');
var twitter = require('twitter');

// make Stream globally visible so we can clean up better
var stream;

var DEFAULT_TOPIC = "Justin Bieber";

// defensiveness against errors parsing request bodies...
process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err.stack);
});
process.on("exit", function(code) {
    console.log("exiting with code: " + code);
});

var app = express();
// Configure the app web container
// app.configure(function() {
// 	app.use(express.bodyParser());
//     app.use(express.static(__dirname + '/public'));
// });

// Sample keys for demo and article - you must get your own keys if you clone this application!
// Create your own app at: https://dev.twitter.com/apps
// See instructions HERE:  https://hub.jazz.net/project/spirit/Sentiment%20Analysis%20App/overview
// Look for "To get your own Twitter Application Keys" in the readme.md document
var tweeter = new twitter({
    consumer_key: 'hzgLcVRfA9NO0XVk1Zq1nDm8V',
    consumer_secret: 'jSF5UBZjOxogZDIJLy0TUAZgt1YHc9dDdWKGscx3Y3hVrfnBRY',
    access_token_key: '73639552-TEhBCShGKKksF7my818cdoAhXl4XJI7iUlcdpOUaC',
    access_token_secret: 'mXiayB8j7cvEE6tEHO4rX1KiMib7qCr2CGazYWhLjIzwp'
});

app.get('/twitterCheck', function (req, res) {
    tweeter.verifyCredentials(function (error, data) {
        res.send("Hello, " + data.name + ".  I am in your twitters.");
    });
});

var tweetCount = 0;
var tweetTotalSentiment = 0;
var monitoringPhrase;

app.get('/sentiment', function (req, res) {
    res.json({monitoring: (monitoringPhrase != null),
    	monitoringPhrase: monitoringPhrase,
    	tweetCount: tweetCount,
    	tweetTotalSentiment: tweetTotalSentiment,
    	sentimentImageURL: sentimentImage()});
});

app.post('/sentiment', function (req, res) {
	try {
		if (req.body.phrase) {
	    	beginMonitoring(req.body.phrase);
			res.send(200);
		} else {
			res.status(400).send('Invalid request: send {"phrase": "bieber"}');
		}
	} catch (exception) {
		res.status(400).send('Invalid request: send {"phrase": "bieber"}');
	}
});

function resetMonitoring() {
	if (stream) {
		var tempStream = stream;
	    stream = null;  // signal to event handlers to ignore end/destroy
		tempStream.destroySilent();
	}
    monitoringPhrase = "";
}

function beginMonitoring(phrase) {
    // cleanup if we're re-setting the monitoring
    if (monitoringPhrase) {
        resetMonitoring();
    }
    monitoringPhrase = phrase;
    tweetCount = 0;
    tweetTotalSentiment = 0;
    tweeter.verifyCredentials(function (error, data) {
        if (error) {
        	resetMonitoring();
            console.error("Error connecting to Twitter: " + error);
            if (error.statusCode === 401)  {
	            console.error("Authorization failure.  Check your API keys.");
            }
        } else {
            tweeter.stream('statuses/filter', {
                'track': monitoringPhrase
            }, function (inStream) {
            	// remember the stream so we can destroy it when we create a new one.
            	// if we leak streams, we end up hitting the Twitter API limit.
            	stream = inStream;
                console.log("Monitoring Twitter for " + monitoringPhrase);
                stream.on('data', function (data) {
                    // only evaluate the sentiment of English-language tweets
                    if (data.lang === 'en') {
                        sentiment(data.text, function (err, result) {
                            tweetCount++;
                            tweetTotalSentiment += result.score;
                        });
                    }
                });
                stream.on('error', function (error, code) {
	                console.error("Error received from tweet stream: " + code);
		            if (code === 420 || code === 429)  {
	    		        console.error("API limit hit, are you using your own keys?");
            		}
	                resetMonitoring();
                });
				stream.on('end', function (response) {
					if (stream) { // if we're not in the middle of a reset already
					    // Handle a disconnection
		                console.error("Stream ended unexpectedly, resetting monitoring.");
		                resetMonitoring();
	                }
				});
				stream.on('destroy', function (response) {
				    // Handle a 'silent' disconnection from Twitter, no end/error event fired
	                console.error("Stream destroyed unexpectedly, resetting monitoring.");
	                resetMonitoring();
				});
            });
            return stream;
        }
    });
}

function sentimentImage() {
    var avg = tweetTotalSentiment / tweetCount;
    if (avg > 0.5) { // happy
        return "/images/excited.png";
    }
    if (avg < -0.5) { // angry
        return "/images/angry.png";
    }
    // neutral
    return "/images/content.png";
}

app.get('/',
    function (req, res) {
        var welcomeResponse = "<HEAD>" +
            "<title>Twitter Sentiment Analysis</title>\n" +
            "</HEAD>\n" +
            "<BODY>\n" +
            "<P>\n" +
            "Welcome to the new Twitter Sentiment Analysis app.<br>\n" +
            "What would you like to monitor?\n" +
            "</P>\n" +
            "<FORM action=\"/monitor\" method=\"get\">\n" +
            "<P>\n" +
            "<INPUT type=\"text\" name=\"phrase\" value=\"" + DEFAULT_TOPIC + "\"><br><br>\n" +
            "<INPUT type=\"submit\" value=\"Go\">\n" +
            "</P>\n" + "</FORM>\n" + "</BODY>";
        if (!monitoringPhrase) {
            res.send(welcomeResponse);
        } else {
            var monitoringResponse = "<HEAD>" +
                "<META http-equiv=\"refresh\" content=\"5; URL=http://" +
                req.headers.host +
                "/\">\n" +
                "<title>New Twitter Sentiment Analysis</title>\n" +
                "</HEAD>\n" +
                "<BODY>\n" +
                "<P>\n" +
                "The Twittersphere is feeling<br>\n" +
                "<IMG align=\"middle\" src=\"" + sentimentImage() + "\"/><br>\n" +
                "about " + monitoringPhrase + ".<br><br>" +
                "Analyzed " + tweetCount + " tweets...<br>" +
                "</P>\n" +
                "<A href=\"/reset\">Monitor another phrase</A>\n" +
                "</BODY>";
            res.send(monitoringResponse);
        }
    });

app.get('/testSentiment',
    function (req, res) {
        var response = "<HEAD>" +
            "<title>Twitter Sentiment Analysis</title>\n" +
            "</HEAD>\n" +
            "<BODY>\n" +
            "<P>\n" +
            "Welcome to the Twitter Sentiment Analysis app.  What phrase would you like to analzye?\n" +
            "</P>\n" +
            "<FORM action=\"/testSentiment\" method=\"get\">\n" +
            "<P>\n" +
            "Enter a phrase to evaluate: <INPUT type=\"text\" name=\"phrase\"><BR>\n" +
            "<INPUT type=\"submit\" value=\"Send\">\n" +
            "</P>\n" +
            "</FORM>\n" +
            "</BODY>";
        var phrase = req.query.phrase;
        if (!phrase) {
            res.send(response);
        } else {
            sentiment(phrase, function (err, result) {
                response = 'sentiment(' + phrase + ') === ' + result.score;
                res.send(response);
            });
        }
    });

app.get('/monitor', function (req, res) {
    beginMonitoring(req.query.phrase);
    res.redirect(302, '/');
});

app.get('/reset', function (req, res) {
    resetMonitoring();
    res.redirect(302, '/');
});

app.get('/hello', function (req, res) {
    res.send("Hello world.");
});

app.get('/watchTwitter', function (req, res) {
    var stream;
    var testTweetCount = 0;
    var phrase = 'bieber';
    // var phrase = 'ice cream';
    tweeter.verifyCredentials(function (error, data) {
        if (error) {
            res.send("Error connecting to Twitter: " + error);
        }
        stream = tweeter.stream('statuses/filter', {
            'track': phrase
        }, function (stream) {
            res.send("Monitoring Twitter for \'" + phrase + "\'...  Logging Twitter traffic.");
            stream.on('data', function (data) {
                testTweetCount++;
                // Update the console every 50 analyzed tweets
                if (testTweetCount % 50 === 0) {
                    console.log("Tweet #" + testTweetCount + ":  " + data.text);
                }
            });
        });
    });
});
