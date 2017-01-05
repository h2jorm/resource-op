import test from 'ava';

import ResourceOp from './index';

global.fetch = function fetch(...args) {
  return {
    isMethod(method) {
      return args[1].method.toLowerCase() === method.toLowerCase();
    },
    isUrl(url) {
      return args[0] === url;
    },
    isBody(body) {
      if (typeof body === 'object') {
        return args[1].body === JSON.stringify(body);
      }
      return args[1].body === body;
    }
  }
};

test('basic restful', t => {
  const resource = ResourceOp.create('/api');
  let ret = resource.get();
  t.true(ret.isMethod('get'));
  t.true(ret.isUrl('/api'));
  ret = resource.get({a: 1});
  t.true(ret.isUrl('/api?a=1'));
  ret = resource.get({a: [1,2,3]});
  t.true(ret.isUrl('/api?a=1&a=2&a=3'));

  ret = resource.delete();
  t.true(ret.isMethod('delete'));
  t.true(ret.isUrl('/api'));

  ret = resource.post();
  t.true(ret.isMethod('post'));
  t.true(ret.isUrl('/api'));
  ret = resource.post({data: {a: 1}});
  t.true(ret.isBody({data: {a: 1}}));

  ret = resource.put();
  t.true(ret.isMethod('put'));
  t.true(ret.isUrl('/api'));
  ret = resource.post({data: {a: 1}});
  t.true(ret.isBody({data: {a: 1}}));
});

test('empty true', t => {
  const resource = ResourceOp.create('/api', {}, {empty: true});
  ['get', 'delete', 'post', 'put'].forEach(method => {
    t.false(resource.hasOwnProperty(method));
  });
});

test('addMethod', t => {
  const resource = ResourceOp.create('/api');
  resource.addMethod('search', 'post', '/hello');

  const ret = resource.search({b: 2});
  t.true(ret.isMethod('post'));
  t.true(ret.isUrl('/hello'));
  t.true(ret.isBody({b: 2}));

  const error = t.throws(() => {
    resource.addMethod('search', 'get');
  });
  t.is(error.message, 'Method search is occupied');
});

test('extends', t => {
  const resource = ResourceOp.create('/api', {
    a: 1,
  });
  const child = resource.extends('hello', {
    a: 2,
  });
  t.is(child.url, '/api/hello');
  t.is(child.defaultOpts.a, 2);
});
