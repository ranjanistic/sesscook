declare module 'sesscook' {
  interface Sesscook {
    /**
     * Creates a new session.
     * @param response The response callback parameter of get method of express object.
     * @param sessiondata The payload data to be locked in current session, and can be retrived from Session.isValid method.
     */
    create(response: Express.Response, sessiondata: object): boolean;

    /**
     * Checks if session is valid and returs sessiondata locked in session if valid, else returns false.
     * @param request The request callback parameter of get method of express object.
     */
    isValid(request: Express.Request): boolean;

    /**
     * Finishes current session.
     * @param response The response callback parameter of get method of express object.
     */
    finish(response: Express.Response): boolean;
  }

  /**
   * @param {Express} app The object of express(), or express.Router() object.
   * @param {String} sessionsecret A secret phrase to act as a key for the masked session token.
   * @param {Number} expirytimeinseconds Seconds for which a session token is valid after creation. Defaults to 10 years.
   * @param {String} sessionkey (Optional) A phrase to indicate the token.
   * @param {Boolean} secured (Optional) If true, then session will only be created on an https (secured) protocol (Not recommended). Defaults to false.
   */
  export default function sesscook(app: Express.Application, sessionsecret?: string, expirytimeinseconds?: number,sessionkey?: string,secured?: boolean): Sesscook;
}
