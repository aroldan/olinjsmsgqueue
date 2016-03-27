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

#### Create a new task that scales and saves the images

We're already bringing a JavaScript-based image manipulation library in, [Jimp](https://github.com/oliver-moran/jimp), and you can see from the upload endpoint stub how image uploads are handled in node with a package called [multer](https://github.com/expressjs/multer).

Before creating the task, upload an image to the basic page and look at the log output from the service. Is it what you'd expect? Also look at your file system to verify the files are where you'd expect.

Now, let's create a new task that takes the path of the image on disk and saves resized versions to somewhere else.

