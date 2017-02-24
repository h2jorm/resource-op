const URL = require('url');
const path = require('path');

const METHODS = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
];

class ResourceOp {
  /**
   * A factory that return an Ajax instance
   * @param {string|function} url - resource address
   * @param {?Object} fetchOpts - default settings of fetch
   * @param {?{empty: boolean}} opts - return an Ajax instance
   * without restful methods if `empty` is `true`
   */
  static create(url, fetchOpts = {}, opts = {}) {
    const urlType = typeof url;
    if (['string', 'function'].indexOf(urlType) === -1)
      throw new Error('invalid type of url when creating ResourceOp instance');
    const ajax = new ResourceOp();
    ajax.defaultOpts = fetchOpts;
    ajax.url = url;
    const {empty} = opts;
    if (!empty)
      ajax._applyRestful();
    return ajax;
  }

  constructor() {
    // DONOTHING
  }

  /**
   * Create a new method on the instance
   * @param {string} methodName
   * @param {string} METHOD - standard method name
   * @param {?function|string} transform - tranform `this.url`
   */
  addMethod(methodName, METHOD, transform) {
    if (this.hasOwnProperty(methodName)) {
      throw new Error(`Method ${methodName} is occupied`);
    }
    let url;
    if (typeof transform === 'string')
      url = transform;
    else if (typeof transform === 'function')
      url = transform(this.url);
    else
      url = this.url;
    this[methodName] = this._createMethod(url, METHOD);
  }

  extends(url, fetchOpts = {}, opts = {}) {
    return ResourceOp.create(
      path.join(this.url.toString(), url.toString()),
      Object.assign({}, this.defaultOpts, fetchOpts),
      opts
    );
  }

  /**
   * Add restful methods
   */
  _applyRestful() {
    METHODS.forEach(METHOD => {
      this.addMethod(METHOD.toLowerCase(), METHOD);
    });
  }

  /**
   * Wrap method in opts
   * @private
   * @param {string} url
   * @param {string} METHOD
   */
  _createMethod(url, METHOD) {
    return (data, opts) => {
      let _url;
      switch (typeof url) {
        case 'string':
          _url = url;
          break;
        case 'function':
          _url = url();
          break;
      }
      return this._request(_url, data, Object.assign(
        {method: METHOD}, this.defaultOpts, opts
      ));
    };
  }

  /**
   * @private
   * @param {string} url
   * @param {Object} data - params for GET, body for others
   * @param {Object} opts
   */
  _request(url, data, opts) {
    if (opts.method.toLowerCase() === 'get') {
      url = URL.format({pathname: url, query: data});
      return fetch(url, opts);
    }
    var body;
    try {
      body = JSON.stringify(data);
    } catch (err) {
      body = data.toString();
    }
    Object.assign(opts, {body});
    return fetch(url, opts);
  }
}

module.exports = ResourceOp;
