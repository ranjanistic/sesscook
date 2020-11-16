const jwt = require("jsonwebtoken"),cookieParser = require("cookie-parser");

/**
 * @param {Express} app The main object of express module, or express.router object.
 * @param {String} sessionsecret A secret phrase to act as a key for the masked session token.
 * @param {String} sessionkey (Optional) A phrase to indicate the token.
 * @param {Number} expirytimeinseconds Seconds for which a session token is valid after creation.
 */
class Sesscook{
  constructor(app,sessionsecret = "NASFDJLSJKV3U0R892U3R.Zc;#ri*uiiifyhoo>lvpqid",sessionkey = "sesscookkey",expirytimeinseconds = 0){
    app.use(cookieParser(sessionsecret));
    this.secret = sessionsecret;
    this.expiresIn = expirytimeinseconds;
    this.sessionKey = sessionkey;
  }
  /**
   * Creates a new session.
   * @param {JSON} response The response callback parameter of get method of express object.
   * @param {JSON} sessiondata The payload data to be locked in current session, and can be retrived from Session.isValid method.
   * @param {Boolean} secured If true, then session will only be created on an https (secured) protocol. Defaults to false.
   */
  create(response,sessiondata = {},secured = false){
    const token = jwt.sign(sessiondata,this.secret);
    response.cookie(this.sessionKey, token, { signed: true,expires: new Date(Date.now() + (this.expiresIn?this.expiresIn*1000:10*365*24*60*60*1000)), httpOnly: true, secure:secured,sameSite:'Lax'});
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

const sesscook = (app,sessionsecret = "NASFDJLSJKV3U0R892U3R.Zc;#ri*uiiifyhoo>lvpqid",sessionkey = "sesscookkey",expirytimeinseconds = 0) => new Sesscook(app,sessionsecret,sessionkey,expirytimeinseconds);

module.exports = sesscook;