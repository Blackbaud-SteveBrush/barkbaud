# Barkbaud

## What it is
- Live demo: http://barkbaud.herokuapps.com/

## Getting Started

### What you'll need

- Heroku account
- MongoLab account
- NPM installed locally

## Steps to install

### 1)  Clone barkbaud repo on your desktop.

### 2)  Register for a Heroku account.
- Create a new app

### 3)  Download and install the Heroku Toolbelt.
- Login to heroku toolbelt on your directory

### 4)  Create a new Heroku app.

### 4)  Register for a MongoLab account.
	- Create a database
	- Create a database user

### 5)  Configure your application.
- Create/edit the .env file (no need for .bat files)

### 6)  Build and test the application locally.

Type:

```
barkbaud $ npm run setup
barkbaud $ npm run local
```

### 7)  Deploy local application to Heroku.

Type:
```
barkbaud $ npm run production
```

- Change the redirect_url to point to heroku app. and type: `heroku config:set AUTH_REDIRECT_URI=http://barkbaud-demo.herokuapps.com/auth/redirect/`

Type:

```
barkbaud $ git add .
barkbaud $ git commit -m "Made it better."
barkbaud $ git push heroku master
```

Then, to view your public application, type:
```
barkbaud $ heroku open
```