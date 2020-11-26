const jwt = require("jsonwebtoken"),cookieParser = require("cookie-parser");

/**
 * @param {Express} app The main object of express module, or express.router object.
 * @param {String} sessionsecret A secret phrase to act as a key for the masked session token.
 * @param {Number} expirytimeinseconds Seconds for which a session token is valid after creation.
 * @param {String} sessionkey (Optional) A phrase to indicate the token.
 * @param {Boolean} secured (Optional) If true, then session will only be created on an https (secured) protocol (Not recommended). Defaults to false.
 */
class Sesscook{
  constructor(app,sessionsecret = String,expirytimeinseconds = 0,sessionkey = "sesscookkey",secured = false){
    if(!app) throw "Error: app (Express.Application) is not provided as first argument in sesscook(). Failed to initialize.";
    if(typeof sessionsecret == "number") throw "Error: sessionsecret must be a string in second argument of sesscook() method.";
    if(!sessionsecret) throw "Error: sessionsecret (String) not provided. Provide a second argument in sesscook() method, which acts as a private key.";
    if(isNaN(expirytimeinseconds)) throw "Error: expirytimeinseconds (Number) is not a valid number in third argument of sesscook() method.";
    if(!expirytimeinseconds) console.warn("Warning: Expiry time (in seconds) not provided as third argument in sesscook() method. By default, session token expires in 10 years.")
    if(secured) console.log("Warning: Sesscook.create() has third argument as true (secured), therefore session will only be created on secured (https) protocol.");

    app.use(cookieParser(sessionsecret));
    this.secret = sessionsecret;
    this.expiresIn = Number(expirytimeinseconds);
    this.sessionKey = sessionkey;
    this.secured = secured;
  }

  /**
   * Creates a new session.
   * @param {JSON} response The response callback parameter of get method of express object.
   * @param {Object} sessiondata The payload data to be locked in current session, and can be retrived from Sesscook.isValid method.
   */
  create(response,sessiondata){
    const token = jwt.sign(sessiondata,this.secret,{expiresIn:this.expiresIn?this.expiresIn:10*365*24*60*60});
    response.cookie(this.sessionKey, token, { signed: true,expires: new Date(Date.now() + (this.expiresIn?this.expiresIn*1000:10*365*24*60*60*1000)), httpOnly: true, secure:this.secured,sameSite:'Lax'});
    return true;
  }

  /**
   * Checks if session is valid and returs sessiondata locked in session if valid, else returns false.
   * @param {JSON} request The request callback parameter of get method of express object.
   */
  isValid(request){
    const token = request.signedCookies[this.sessionKey];
    try {
      if (!token) return false;
      return jwt.verify(token, this.secret);
    } catch (e) {
      return false;
    }    
  }

  /**
   * Finishes current session.
   * @param {JSON} response THe response callback parameter of get method of express object.
   */
  finish(response){
    response.clearCookie(this.sessionKey);
    return true;
  }
}

/**
 * @param {Express} app The object of express(), or express.Router() object.
 * @param {String} sessionsecret A secret phrase to act as a key for the masked session token.
 * @param {Number} expirytimeinseconds Seconds for which a session token is valid after creation. Defaults to 10 years.
 * @param {String} sessionkey (Optional) A phrase to indicate the token.
 * @param {Boolean} secured (Optional) If true, then session will only be created on an https (secured) protocol (Not recommended). Defaults to false.
 */
const sesscook = (app,sessionsecret = String,expirytimeinseconds = 0,sessionkey, secured) => new Sesscook(app,sessionsecret,expirytimeinseconds,sessionkey,secured);

module.exports = sesscook;