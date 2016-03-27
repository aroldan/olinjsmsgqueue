# An example of message queueing for Olin.js

### Assumptions

Getting going with this lab assumes you've already gotten something working on Heroku.

### Setup

To complete this lab, you'll need to add a Redis add-on to your Heroku deployment. I suggest [redistogo](https://devcenter.heroku.com/articles/redistogo) since they have a decent free tier.

To add in the add-on, run:

```
$ heroku addons:create redistogo
````

For local development, you can use either redis running on your machine locally, or tap into the Redistogo instance created in your add-on by copying the configuration parameter locally:

```
$ heroku config:get REDISTOGO_URL -s >> .env
```

### Steps

Check out the project, and explore what comes out of the box. By default, we have a simple page served in the app root with an area to drop uploaded images into. When dropping an image into the area, it gets uploaded to the server and stashed in a temporary location (`uploads/(some random number)`).

In the lab, we'll modify this to write the image path into a processing queue that'll thumbnail it and extract some metadata. In this canned example, we will run both the image processing and the web worker in the same node process, but there's nothing that says that has to be the case -- we could easily build and deploy the queue consumer in a different process or app.

#### Get everything plugged in, and verify the queue is working.

You'll see there is one route that already exists at the `/cool/` URL. It shows a [cool ASCII face](https://github.com/maxogden/cool-ascii-faces) and two random numbers that it'll then add by placing them in the task queue.

Verify this works by hitting the URL and watching the console output from the worker.



