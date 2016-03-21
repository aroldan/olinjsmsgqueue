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

### Background

