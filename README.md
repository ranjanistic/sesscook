# sesscook
Local session manager module for nodejs applications.
Uses signed cookies to maintain local session.

## Install

```bash
npm i sesscook
```

## Usage

```js
const express = require("express");
const app = express();
const sesscook = require("sesscook");
const session = sesscook(app,"sessionsecret","sessionpublickey",60*60*2);

//now use session object to access Sesscook methods, wherever needed.
app.get("/login",(req,res)=>{
  //after successfull authentication
  session.create(res,{username:"someuser",email:"someemail"});
});

app.get("/logout",(req,res)=>{
  session.finish(res);
  //session finished.
});
```

The ```session``` object is an object of unexported Sesscook class, accessed via exported sesscook method, which returns a new instance of the same.

## Dependencies

- jsonwebtoken
- cookie-parser
