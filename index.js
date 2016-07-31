const METHODS = [
  'GET', 'POST', 'PUT', 'DELETE',
];

class Ajax {
  /**
   * A factory that return an Ajax instance
   * @param {string} url - resource address
   * @param {?Object} fetchOpts - default settings of fetch
   * @param {?{empty: boolean}} opts - return an Ajax instance
   * without restful methods if `empty` is `true`
   */
  static create(url, fetchOpts = {}, opts = {}) {
    const ajax = new Ajax();
    ajax.defaultOpts = opts;
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
   */
  addMethod(methodName, METHOD) {
    if (this.hasOwnProperty(methodName)) {
      throw new Error(`Method ${methodName} is occupied`);
    }
    this[methodName] = this._createMethod(METHOD);
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
   * @param {string} METHOD
   */
  _createMethod(METHOD) {
    return (data, opts) => {
      return this._request(data, Object.assign(
        {method: METHOD}, this.defaultOpts, opts
      ));
    };
  }

  /**
   * @private
   * @param data {object} - params for GET, body for others
   * @param opts {object}
   */
  _request(data, opts) {
    if (opts.method.toLowerCase() === 'get') {
      const url = applyParams(this.url, data);
      return fetch(url, opts);
    }
    var body;
    try {
      body = JSON.stringify(data);
    } catch (err) {
      body = data.toString();
    }
    Object.assign(opts, {body});
    return fetch(this.url, opts);
  }
}

module.exports = Ajax;

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
