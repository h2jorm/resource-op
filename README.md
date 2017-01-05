# resource-op

`resource-op` is designed to handle ajax operations.

## Install and prerequisite

Please polyfill fetch api. `resource-op` use `fetch` api to launch ajax. [whatwg-fetch](https://github.com/github/fetch) is recommended.

installed with npm
```bash
npm install --save resource-op
```

## Api

```js
import ResourceOp from 'resource-op';
const resource = ResourceOp.create('/resource', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': THIS_IS_A_SECRET_TOKEN,
  },
});

// GET /resource?hello=world&tags=1&tags=2&tags=3
resource.get({hello: 'world', tags: [1, 2, 3]});
// POST {hello: 'world'} -> /resource
resource.post({hello: 'world'});
// PUT {hello: 'world'} -> /resource
resource.put({hello: 'world'});
// DELETE /resource
resource.delete();
```

### `ResourceOp.create(url: string|function[, fetchOpts: object[, opts: object]])`

This is a static method that returns an instance of ResourceOp.

* url: Resource address, a function returning a string is also acceptable.
* fetchOpts: It is same as the second param of fetch. See how to use fetch on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch). Default value is `{}`.
* opts: If `empty` attribute is `true`, factory will return an instance without any restful methods. Default value is `{}`.

### `resourceOp.addMethod(name: string, METHOD: string[, transform: string | function])`

Add a custom method to the instance.

* name: Method name appended on the instance
* METHOD: A valid restful method, e.g. `POST`, `PUT` and etc
* transform: A function that transforms the resource url to a new url. A url string is also accessible.

```js
import ResourceOp from 'resource-op';
const resource= ResourceOp.create('/resource');
resource.addMethod('sort', 'POST', url => `${url}/_sort`);
// POST {a: 1} -> /resource/_sort
resource.sort({a: 1});
```

### `resourceOp.extends(url: string[, fetchOpts: object[, opts: object]])`

Extend an exsited instance and return a new instance. The arguments are the same as `ResourceOp.create`.

```js
import ResourceOp from 'resource-op';
const resource= ResourceOp.create('/resource');
const child = resource.extends('/some');
// GET -> /resource/some
resource.get();
```
