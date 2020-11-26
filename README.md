# sesscook

Local session manager module for nodejs with expressjs applications.
Uses signed & masked cookies to maintain local session only.

## Install

```bash
npm i sesscook
```

## Methods

After declaring  

```js
const express = require("express");
const app = express();
const sesscook = require("sesscook");

const session = sesscook(
  app, //Express.Application object
  "somesessionsecret",  //private key
  60*60*2,  //validity in seconds (here 2 hours), defaults  to 10 years.
  "somesessionpublickey" //optional public key.
);

//an optional fifth parameter (boolean) is also present, but not recommended to set true, as session will only be created on https protocol then.

```

the following methods can be accessed via ```session``` object.

- session.create(```response```,```sessiondata```)

  This method creates a new session based on following parameters.

  - ```response``` is parameter of ```app.get(path, (request,response)=>{...})```'s callbackfn.

  - ```sessiondata``` is JSON/String type data, to be stored in current session (like username, or userid).

  - ```secured``` is Boolean type, defaults to false. If set true, then session will only be created on https (secured) protocol. (not recommended)

- session.isValid(```request```)
  This method checks if session is valid, returns false if not, or returns sessiondata which was provided as second parameter of ```session.create()``` method.
  
  - ```request``` is parameter of ```app.get(path, (request,response)=>{...})```'s callbackfn.

- session.finish(```response```)

  This method finishes and thus invalidates any current session created via ```session.create()``` method.

  - ```response``` is parameter of ```app.get(path, (request,response)=>{...})```'s callbackfn.

## Example

```js
const express = require("express");
const app = express();
const sesscook = require("sesscook");

const session = sesscook(app,"sessionsecret",60*60*2,"sessionpublickey");

//now use session object to access Sesscook methods, wherever needed.

/** This endpoint creates a new session with dummy session
 data, and after that the session.isValid() method will return that same data.
 */
app.get("/login",(req,res)=>{
  ...
  //after successfull authentication

  let sessiondata = {
    username:"someuser",
    email:"someemail"
  };

  session.create(res,sessiondata);
  //session is created
});

/**An endpoint which redirects to login page, if session is
invalid, else session.isValid(req) method returns the
session data stored using session.create() method.
*/
app.get("/session",(req,res)=>{
  const client = session.isValid(req);
  if(!client) return res.redirect("/login");  //if client is false, session is invalid.

  ...
  //if session is valid, then client contains sessiondata for current valid session.
  const email = client.email;
  const username = client.username;
  ...
})

/**An endpoint which removes the current session. This will
 lead the session.isValid() method to return false.
 */
app.get("/logout",(req,res)=>{
  session.finish(res);
  //session finished.
  ...
});

app.listen(8000);

```

The ```session``` object is an object of unexported class ```Sesscook```, accessed via exported ```sesscook()``` method, which returns a new instance of the same.

## Dependencies

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
