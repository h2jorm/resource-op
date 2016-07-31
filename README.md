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
const ajax = ResourceOp.create('/resource', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': THIS_IS_A_SECRET_TOKEN,
  },
});

// GET /resource?hello=world
ajax.get({hello: 'world'});
// POST {hello: 'world'} -> /resource
ajax.post({hello: 'world'});
// PUT {hello: 'world'} -> /resource
ajax.put({hello: 'world'});
// DELETE /resource
ajax.delete();
```

### `ResourceOp.create(url: string[, fetchOpts: object[, opts: object]])`

This is a static method that returns an instance of ResourceOp.

* url: Resource address
* fetchOpts: It is same as the second param of fetch. See how to use fetch on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch). Default value is `{}`.
* opts: If `empty` attribute is `true`, factory will return an instance without any restful methods. Default value is `{}`.

### `resourceOp.addMethod(name: string, METHOD: string)`

Add a custom method to the instance.

* name: Method name appended on the instance
* METHOD: A valid restful method, e.g. `POST`, `PUT` and etc

```js
import ResourceOp from 'resource-op';
const ajax = ResourceOp.create('/resource/_sort');
ajax.addMethod('sort', 'POST');
// POST {a: 1} -> /resource/_sort
ajax.sort({a: 1});
```
