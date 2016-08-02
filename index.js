const METHODS = [
  'GET', 'POST', 'PUT', 'DELETE',
];

class ResourceOp {
  /**
   * A factory that return an Ajax instance
   * @param {string} url - resource address
   * @param {?Object} fetchOpts - default settings of fetch
   * @param {?{empty: boolean}} opts - return an Ajax instance
   * without restful methods if `empty` is `true`
   */
  static create(url, fetchOpts = {}, opts = {}) {
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
      return this._request(url, data, Object.assign(
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
      const _url = applyParams(url, data);
      return fetch(_url, opts);
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

/**
 * append query string to url
 * @param {string} url
 * @param {?Object} paramsObj - query string object
 * @return {string}
 */
function applyParams(url, paramsObj = {}) {
  const urlArr = url.split('?');
  const pathname = urlArr[0];
  const paramsArr = urlArr[1] && urlArr[1].split('&') || [];
  for (let param in paramsObj) {
    const value = paramsObj[param];
    if (!value)
      paramsArr.push(param);
    else
      paramsArr.push(`${param}=${value}`);
  }
  const paramsStr = paramsArr.join('&');
  if (paramsStr)
    return `${pathname}?${paramsStr}`;
  return url;
}
