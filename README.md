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

const session = sesscook(app,"somesessionsecret","somesessionpublickey",60*60*2); //last param is validity in seconds.
```

the following methods can be accessed via ```session``` object.

- session.create(```response```,```sessiondata```,```secured```)

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

const session = sesscook(app,"sessionsecret","sessionpublickey",60*60*2);

//now use session object to access Sesscook methods, wherever needed.

/** This endpoint creates a new session with dummy session
 data, and after that the session.isValid() method will return that same data.
 */
app.get("/login",(req,res)=>{
  ...
  //after successfull authentication
  session.create(res,{username:"someuser",email:"someemail"});
});

/**An endpoint which redirects to login page, if session is
invalid, else session.isValid(req) method returns the
session data stored using session.create() method.
*/
app.get("/session",(req,res)=>{
  const client = session.isValid(req);
  if(!client) return res.redirect("/login");
  ...
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

The ```session``` object is an object of unexported Sesscook class, accessed via exported sesscook method, which returns a new instance of the same.

## Dependencies

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
