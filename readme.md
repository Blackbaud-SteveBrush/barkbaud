# Barkbaud

Blackbaud SKY API / SKY UX sample application.

## About

This sample application showcases the [Blackbaud SKY API](https://developer.sky.blackbaud.com/) and [Blackbaud SKY UX](http://skyux.developer.blackbaud.com/). Both technologies function completely independent of one another.  The Blackbaud SKY API currently supports the [Authorization Code Flow](http://apidocs.sky.blackbaud.com/docs/authorization/auth-code-flow/), which requires us to have a back-end server component where we're able to securely store the client secret. We've implemented the server component using [NodeJS](https://nodejs.org/).  Our front-end is stored and built in the [barkbaud-ui repo](https://github.com/blackbaud/barkbaud-ui). Using Bower, we consume the pre-built user interface and move it to the barkbaud repo's **ui** folder during the install and build steps.

The Barkbaud application starts by requesting authorization to your Blackbaud Raiser's Edge NXT data. A dashboard provides a listing of dogs that are looking for a good home. Selecting a dog will take you to a page which lists the animal's owner and medical history. Biographies, owner and medical history for each animal are stored in a MongoDB database at [mLab](https://www.mlab.com). Blackbaud SKY API provides access to constituent data. The application uses the API to search for a constituent and retrieve the constituent ID which is used to relate the constituent to a dog within mLab. Medical history is stored as a subdocument for each dog in mLab. Upon adding medical history, the user has the option of storing the information as a note on the current owner's Raiser's Edge NXT record.

## View the live demo

We've deployed Barkbaud to Heroku.com. Feel free to checkout the live demo of our application at [https://barkbaud.herokuapp.com](https://barkbaud.herokuapp.com).

Feel free to leave feedback by filing an [issue](https://github.com/blackbaud/barkbaud/issues).

## Run Barkbaud on your server

To run this application in your environment, you will need a server (such as your local machine) capable of running [NodeJS](https://nodejs.org/). We're also expecting you to have some familiarity with server-side JavaScript, environment variables, cloning a repo with git, and using a command line interface (CLI), such as Command Prompt within Windows, or Terminal within Mac.

### Server requirements:

- The latest, stable version of [NodeJS](https://nodejs.org/)
- The latest, stable version of [Git](https://git-scm.com/)

### Sky API requirements:

- **A Blackbaud Developer Subscription Key**
    - If you have not already done so, be sure to complete the [Getting started guide](https://apidocs.sky.blackbaud.com/docs/getting-started/).  This will guide you through the process of signing up for a Blackbaud developer account and requesting a subscription to an API product.  Once approved, your subscription will contain a **Primary key** and a **Secondary key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header when making calls to the API. You can view your subscription keys within your [profile](https://developer.sky.blackbaud.com/developer). 
- **A Blackbaud Developer Application ID and Secret Key**
    -  [Register your application](https://developerapp.sky.blackbaud.com/applications) in order to obtain the **Application ID** (client id) and **Application secret** (client secret).  When you call the Blackbaud Authorization Service from your application, you pass the `redirect_uri` as part of the call. The Blackbaud Authorization Service redirects to this URI after the user grants or denies permission. Therefore, you must whitelist the web address(es) or the authorization will fail. URIs must _exactly_ match the value your application uses in calls to the Blackbaud Authorization Service. If you plan on running this sample on your local machine, be sure to supply a **Redirect URI** of "https://localhost:5000/auth/callback" (we support localhost redirect URIs if they are bound as HTTPS using a self-signed SSL certificate).

### Steps to install:

#### 1)  Clone or fork the Barkbaud repository

```
$  git clone https://github.com/blackbaud/barkbaud.git
$  cd barkbaud
```

#### 2)  Register for a free mLab account
- Create a [free mLab account](https://mlab.com/signup/)
- Once logged into mLab, [create a new database subscription](http://docs.mlab.com/#create-sub) (the "Sandbox" tier is free). 
- Within this subscription, create a new database named "barkbaud".
- Open the database and click "Users > Add database user" to create a database user (the username and password is your preference)

#### 3)  Connect Barkbaud to your database

- On your server (or local machine), open the **barkbaud** working directory and copy the configuration file **barkbaud.env-sample**, saving it as **barkbaud.env**.  
- Open the **barkbaud.env** file in a text editor (such as Notepad or TextEdit). 
- You should see a list of variables which will serve to configure Barkbaud's NodeJS environment.
- Update **barkbaud.env** with the following values:<br><br>
    <table>
    <tr>
        <td>**AUTH_CLIENT_ID**</td>
        <td>Your registered application's **Application ID** (see, [Managing your apps](https://apidocs.sky.blackbaud.com/docs/apps/))</td>
    </tr>
    <tr>
        <td>**AUTH_CLIENT_SECRET**</td>
        <td>Your registered application's **Application Secret**</td>
    </tr>
    <tr>
        <td>**AUTH_REDIRECT_URI**</td>
        <td>One of your registered application's **Redirect URIs**. For local development, use `https://localhost:5000/auth/callback` (see, [Managing your apps](https://apidocs.sky.blackbaud.com/docs/apps/)).</td>
    </tr>
    <tr>
        <td>**AUTH_SUBSCRIPTION_KEY**</td>
        <td>Your Blackbaud Developer **Subscription Key** (use either the **Primary key** or **Secondary key**, visible on your [profile](https://developer.sky.blackbaud.com/developer))</td>
    </tr>
    <tr>
        <td>**DATABASE_URI**</td>
        <td>The MongoDB connection string, which points to your mLab database. The string should follow this format: `mongodb://<dbuser>:<dbpassword>@<dbaddress>/<dbname>`. More details about how to find your connection string can be found at [mLab's Documentation](http://docs.mlab.com/connecting/#connect-string).</td>
    </tr>
    </table>
- Save the **barkbaud.env** file. 
- Review the **.gitignore** file.  The purpose of this file is to specify which directories and files Git should ignore when performing a commit. Note that the **barkbaud.env** file is ignored. This prevents the file from being synced to your repository and protects your registered application's keys and other sensitive data from being exposed.

#### 4)  Build and test the application

Using Terminal/Command Prompt, change to the working directory (`cd barkbaud`) and type:

```
barkbaud $  npm run setup
barkbaud $  npm start
```

The first command builds the database and the application's user interface, so it should only be executed once.

The second command starts the NodeJS server, automatically opening a Web browser to: [https://localhost:5000](https://localhost:5000).

(If you want to stop and run the application again, you will only need to type `npm start`, since the database and user interface were already created by `npm run setup`.)

## Deploy Barkbaud to Heroku

- Create a [free Heroku account](https://signup.heroku.com/login).
- From your Heroku Dashboard, create a new Heroku NodeJS application.
- Edit your [Blackbaud Application](https://developerapp.sky.blackbaud.com/applications) and add a new **Redirect URL** that points to your Heroku application's URL. This URL should also include the path "/auth/callback" (for example: "https://<your-heroku-app-name>.herokuapp.com/auth/callback").
- Open the **barkbaud.env** file and change the variable **AUTH_REDIRECT_URI** to reference this new URL.
- Install the [Heroku Toolbelt](https://toolbelt.heroku.com/) on your local machine. It's a command line interface (CLI) built specifically for Heroku applications.
- Open Terminal/Command Prompt and login to Heroku via the Toolbelt: 

```
$  heroku login
```

- Change your working directory to **barkbaud** (`cd barkbaud`) and type `git status` to make sure Git is working properly.
- Add a Git remote that references your Heroku application's Git repository: 

```
barkbaud $  heroku git:remote -a your-app-name
barkbaud $  git remote add heroku git@heroku.com:<your-heroku-app-name>.git
```

- Finally, in the **barkbaud** working directory, type:

```
barkbaud $  npm run setup --heroku
barkbaud $  git add .
barkbaud $  git commit -m "Made it better."
barkbaud $  git push heroku master
barkbaud $  heroku open
```
Visit your Heroku application's URL to view a public version of your Barkbaud application!