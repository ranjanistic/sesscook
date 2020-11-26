declare module 'sesscook' {
  interface Sesscook {
    /**
     * Creates a new session.
     * @param response The response callback parameter of get method of express object.
     * @param sessiondata The payload data to be locked in current session, and can be retrived from Session.isValid method.
     * @param secured If true, then session will only be created on an https (secured) protocol. Defaults to false.
     */
    create(response: Express.Response, sessiondata: object, secured?: boolean): boolean;

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
   * @param app The main object of express module, or express.router object.
   * @param sessionsecret A secret phrase to act as a key for the masked session token.
   * @param sessionkey (Optional) A phrase to indicate the token.
   * @param expirytimeinseconds Seconds for which a session token is valid after creation.
   */
  export default function sesscook(app: Express.Application, sessionsecret?: string, sessionkey?: string, expirytimeinseconds?: number): Sesscook;
}
