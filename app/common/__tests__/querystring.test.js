import * as querystringUtils from '../querystring';
import {globalBeforeEach} from '../../__jest__/before-each';

describe('getBasicAuthHeader()', () => {
  beforeEach(globalBeforeEach);
  it('gets joiner for bare URL', () => {
    const joiner = querystringUtils.getJoiner('http://google.com');
    expect(joiner).toBe('?');
  });

  it('gets joiner for invalid URL', () => {
    const joiner = querystringUtils.getJoiner('hi');
    expect(joiner).toBe('?');
  });

  it('gets joiner for URL with question mark', () => {
    const joiner = querystringUtils.getJoiner('http://google.com?');
    expect(joiner).toBe('&');
  });

  it('gets joiner for URL with params', () => {
    const joiner = querystringUtils.getJoiner('http://google.com?foo=bar');
    expect(joiner).toBe('&');
  });

  it('gets joiner for URL with hash', () => {
    const joiner = querystringUtils.getJoiner('http://google.com?foo=bar#hi');
    expect(joiner).toBe('&');
  });

  it('gets joiner for URL with ampersand', () => {
    const joiner = querystringUtils.getJoiner(
      'http://google.com?foo=bar&baz=qux'
    );
    expect(joiner).toBe('&');
  });
});

describe('joinUrl()', () => {
  beforeEach(globalBeforeEach);
  it('joins bare URL', () => {
    const url = querystringUtils.joinUrl(
      'http://google.com',
      'foo=bar'
    );
    expect(url).toBe('http://google.com?foo=bar');
  });

  it('joins with hash', () => {
    const url = querystringUtils.joinUrl(
      'http://google.com#hash',
      'foo=bar'
    );
    expect(url).toBe('http://google.com?foo=bar#hash');
  });

  it('joins hash and querystring', () => {
    const url = querystringUtils.joinUrl(
      'http://google.com?baz=qux#hash',
      'foo=bar'
    );
    expect(url).toBe('http://google.com?baz=qux&foo=bar#hash');
  });

  it('joins multi-hash and querystring', () => {
    const url = querystringUtils.joinUrl(
      'http://google.com?hi=there&baz=qux#hash#hi#hi',
      'foo=bar'
    );
    expect(url).toBe('http://google.com?hi=there&baz=qux&foo=bar#hash#hi#hi');
  });

  it('joins URL with querystring', () => {
    const url = querystringUtils.joinUrl(
      'http://google.com?hi=there',
      'foo=bar%20baz'
    );
    expect(url).toBe('http://google.com?hi=there&foo=bar%20baz');
  });
});

describe('build()', () => {
  beforeEach(globalBeforeEach);
  it('builds simple param', () => {
    const str = querystringUtils.build({name: 'foo', value: 'bar??'});
    expect(str).toBe('foo=bar%3F%3F');
  });

  it('builds param without value', () => {
    const str = querystringUtils.build({name: 'foo'});
    expect(str).toBe('foo');
  });

  it('builds empty param without name', () => {
    const str = querystringUtils.build({value: 'bar'});
    expect(str).toBe('');
  });

  it('builds with numbers', () => {
    const str = querystringUtils.build({name: 'number', value: 10});
    const str2 = querystringUtils.build({name: 'number', value: 0});

    expect(str).toBe('number=10');
    expect(str2).toBe('number=0');
  });
});

describe('buildFromParams()', () => {
  beforeEach(globalBeforeEach);
  it('builds from params', () => {
    const str = querystringUtils.buildFromParams([
      {name: 'foo', value: 'bar??'},
      {name: 'hello'},
      {name: 'hi there', value: 'bar??'},
      {name: '', value: 'bar??'},
      {name: '', value: ''}
    ]);

    expect(str).toBe('foo=bar%3F%3F&hello&hi%20there=bar%3F%3F');
  });
  it('builds from params', () => {
    const str = querystringUtils.buildFromParams([
      {name: 'foo', value: 'bar??'},
      {name: 'hello'},
      {name: 'hi there', value: 'bar??'},
      {name: '', value: 'bar??'},
      {name: '', value: ''}
    ], false);

    expect(str).toBe('foo=bar%3F%3F&hello=&hi%20there=bar%3F%3F&=bar%3F%3F&=');
  });
});

describe('deconstructToParams()', () => {
  beforeEach(globalBeforeEach);
  it('builds from params', () => {
    const str = querystringUtils.deconstructToParams(
      'foo=bar%3F%3F&hello&hi%20there=bar%3F%3F&=&=val'
    );

    expect(str).toEqual([
      {name: 'foo', value: 'bar??'},
      {name: 'hello', value: ''},
      {name: 'hi there', value: 'bar??'}
    ]);
  });
  it('builds from params with =', () => {
    const str = querystringUtils.deconstructToParams(
      'foo=bar&1=2=3=4&hi'
    );

    expect(str).toEqual([
      {name: 'foo', value: 'bar'},
      {name: '1', value: '2=3=4'},
      {name: 'hi', value: ''}
    ]);
  });
});

describe('deconstructToParams()', () => {
  beforeEach(globalBeforeEach);
  it('builds from params not strict', () => {
    const str = querystringUtils.deconstructToParams(
      'foo=bar%3F%3F&hello&hi%20there=bar%3F%3F&=&=val',
      false
    );

    expect(str).toEqual([
      {name: 'foo', value: 'bar??'},
      {name: 'hello', value: ''},
      {name: 'hi there', value: 'bar??'},
      {name: '', value: ''},
      {name: '', value: 'val'}
    ]);
  });
});
