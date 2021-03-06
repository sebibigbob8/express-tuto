# Express Tutorial
Follow up this tutorial will teach you how to build an API REST based on nodeJS and the framework Express.

## Table of Contents
1. [ Why using express. ](#why)
2. [ Installation. ](#instal)
3. [ Infrastructure. ](#infra)
4. [ Set up Database. ](#db)
4. [ Models. ](#models)
4. [ Building CRUD Routes. ](#crud)
4. [ Middleware. ](#middleware)
4. [ Authentication System. ](#auth)
4. [ Documentation. ](#doc)
4. [ To go Further. ](#further)

<a name="why"></a>
## 1. Why using Express
Express is a node.js application framework that provide a lot of features for Web Application developpement. Express is
 particulary good for building strong API. The developpment process is quick and easy to understand.

[express website](https://expressjs.com/)


<a name="infra"></a>
## 2. Infrastructure
Our future system will be made up of three different parts.

    1. A MongoDB database
    2. A nodeJS server with Express on it.
    3. A PostMan client

### 2.1 mongoDB
mongoDB is a no-sql database system. Mongo allow us to build a database really quickly. This system match perfectly with
 NodeJS based application. In our future API, we will use mongooseJS (mongodb object modeling for node.js) to 
 communicate with the database.
### 2.2 PostMan
During the creation process, we will need a tool for performing HTTP request easyily. Postman is a free and really 
usefull tool that offer a lot of possibilities.

[download PostMan](https://www.getpostman.com/downloads/)

<a name="instal"></a>
## 3. App Installation
This installation is build on a Windows 10 machine. The commands are run with Powershell.
### 3.1 Requirement
Before the installation begin, you need to have NPM and nodeJS on your computer.

https://www.npmjs.com/get-npm

### 3.2 ExpressJS install
1. Install express generator. With this tool is possible to create an nodeJS based ExpressJS application in one command.
<br/>`npm install express-generator -g`

1. Build our app skeleton with one command. <br/>`express myapi`

1. Install all the dependencies of **package.json**. Go in your application directory and run the following command<br/>
 `npm install`<br/>
1. Run the application :<br/>
`set DEBUG=myapi:* & npm start`</br>

Now we need to test if the installation went well. With your browser go on the address :
 [http://localhost:3000/](http://localhost:3000/)
<br>If your installation is correct, you would see the following message:
![ExpressJS welcome!](/myapi/public/images/expresswelcome.PNG "ExpressJS welcome")

### 3.3 Dev environment with nodemon
The problem is that for now everytime you change something on your code(and you will) you have to restart your app.
Nodemon is a great tool to avoid that situation.

First install nodemon with the command : `npm install -g nodemon`

Then you can run your application by doing : `nodemon myapi`

Your application will now restart automatically when a change is saved.
### 3.4 App Skeleton
>app.js

The main file of the application is the ***app.js*** file. Basically, when any call is made, it first pass on this file 
and then the call is redirect to others files. 
In this file we will add our routes and all basics information like the database URL. <br/>The line we need to 
understand here is: `app.use('/users', usersRouter);`<br/>
The first argument is the URL (here localhost:3000/users) and the second argument is the Router object. Earlier in the 
code, usersRouter is declare by the line `var usersRouter = require('./routes/users');`.<br/> When a call at /users is
 made, the application knows that the file **users.js** handle it.
>/routes

Contain all our CRUD routes. Open ***users.js*** to see how a Router file is structured. A basic route function looks 
like :
```javascript 
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
 });
 ``` 
 ***res.send()*** is the function use to communicate with client. You cannot call this function twice during a http 
 call.

>/models

The models are objects that represent database documents. It's a good practice to create a folder for it. It's help to 
maintain a good application architecture.

<a name="db"></a>
## 4. Set up Database
### 4.1 Create database
In the first place, install a mongoDB instance on your computer. Go check :
 [Install Mongo](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) <br/>
Once mongoDB is correctly installed, we can now build our database and insert our first document. The mongo shell 
(mongo.exe) will be used in the next steps. We want to create a basic users table like :<br/>
![users class](/myapi/public/images/usersTable.PNG "users class")


1. Create the database <br/>`use myapi`<br/>
1. Create users collection <br/>`db.createCollection("users")`
1. Insert the first document <br/>`db.users.insert({username: "test", password: "test"})`
1. Test if the user is correctly created <br/> `db.users.find()`<br/>This query retrieve all the documents in the 
**users** table
1. To see more mongo queries: [MongoDB getting started](https://docs.mongodb.com/manual/tutorial/getting-started/)

### 4.2 Connect the database with our application
1. install mongoose <br/>`npm install mongoose`
1. Connect mongoose with our database. Insert at the beginning of **app.js** :<br/> 
```javascript
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myapi', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
``` 
This will connect express to our mongoDB instance and show on console if any error exist. **If you give the wrong 
database name, this will not create an error. In mongoDB using a Db that do not exist will create a new one directly.**
<a name="models"></a>
## 5. Models
Now we need to create a model that represent the users collection.
1. Create a new file in `/models` named *user.js*
2. Paste the following code 
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);
```
A Schema allow us to define the data rules and verification.

[More informations about Schemas](https://mongoosejs.com/docs/guide.html)
<a name="crud"></a>
## 6. Building CRUD Routes
### 6.1 Create users (POST Request)
The first step is to verify that our request sends the correct data and that we are able to get them.
Write the code below :
```javascript
router.post('/', function (req, res, next) {
    res.send(req.body);
});
```
This code mean : catch any POST request made on */users* and send back the request body.

Now open PostMan and send a POST request to the route. Your PostMan screen normally looks like this : <br/>
![PostMan Post Request!](/myapi/public/images/basicPostRequest.PNG "PostMan Post Request")

We can create a new user in our database.

Import the user model at the beginning of the file : 
```javascript
const User = require('../models/user');
```

Then use it to save a new entry : 
```javascript
router.post('/', function (req, res, next) {
    new User(req.body).save(function (err, newUser) {
        if (err) {
            return next(err);
        }
        res.status(201).send(newUser);
    });
});
```
An important point in the snippets above is ***next(err)***. This function call the next code in the Express Chain.
This chain is defined in *app.js*.If you look back at it you would see a section 'error handler' at the end. That's
where our *err* will land when an error occurs.

If all went perfectly you should receive the new user's information and his MongoID.

We can test our error handler by sending again the same request. As we defined earlier the username must be unique.
You normally have to see an error like :
> E11000 duplicate key error collection: myapi.users index: username_1 dup key: { : "myFirstUser" }

### 6.2 Retrieve users (GET Request)
Fill the already created function 'get' 
```javascript
router.get('/', function (req, res, next) {
    let query = User.find();
    query.exec(function (err, users) {
        if (err) {
            return next(err);
        }
        res.status(200).send(users);
    });
});
```
You normally see a list of users with username and password. A good practice is to never return the password to the 
front-end. To configure that, just add the attribute `select:false` to the mongoose Schema. This will automatically 
unselect the field. This is, of course, not enough to protect the password. You will see more about security in the 
chapter about authentication.

### 6.3 Update users (PATCH Request)
Code snippets to change the user's username. Our request contains the user's id in URL and the new username in her body.
In PostMan, your screen has to look like 
![PostMan Patch Request!](myapi/public/images/updateRequest.PNG "PostMan Patch Request")
To signal express that our url will contain a variable use the synthax below :
````javascript
router.patch('/:id', function (req, res, next) {
    //CODE
});
````
In the patch function, we start by testing the ID and check if it's a correct MongoId.
```javascript
// test the MongoId
    const userId = req.params.id; //get the url parameter
    if (!ObjectId.isValid(userId)) {
        return next(new Error('wrong ID'));
    }
```
To verify the MongoId validity, we need to import `const ObjectId = require('mongoose').Types.ObjectId;` at the 
beginning of the file.
Then we test the request's body
````javascript
//Test the body
    if (req.body.username === undefined) {
        return next(new Error('wrong request body'));
    }
````
Finally we retrieve the user by ID, test if he's exist in the Database and change the username.
```javascript
let query = User.findById(userId);
    query.exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('user not found'));
        } else {
            user.username = req.body.username;
            user.save(function (err, savedUser) {
                if (err) {
                    return next(err);
                }
                res.send(savedUser).status(200);
            });
        }
    });
```
### 6.4 Delete users (DELETE Request)

Code similar to the PATCH route.
```javascript
const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
        return next(new Error('wrong ID'));
    }
    let query = User.findById(userId);
    query.exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('user not found'));
        } else {
            user.delete(function (err, deletedUser) {
                if (err) {
                    return next(err);
                }
                res.send(deletedUser).status(200);
            });
        }
    });
```

As we can see, create basic CRUD routes with express is easy. What's missing yet is the use of middleware to optimise
the code. We currently have redondant piece of code when we retrieve an user by his id. Middlewares will help us.
<a name="middleware"></a>
## 7. Middlewares

<a name="auth"></a>
## 8. Authentication System

<a name="doc"></a>
## 9. Documentation

<a name="further"></a>
## 10. To go Further
