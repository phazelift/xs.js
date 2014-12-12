xs.js
=====

***Access your objects!***

A Javascript deep object manipulation tool/library, with string based access.

Key features:

- use space delimited strings to create and access your objects
- safely CRUD nodes with ease and without risking to crash your app
- remove or change all keys/values at once for nodes with the same name
- set listeners on nodes (can listen deep as well!)
- create tree/hierarchical-based text/strings/numbers!

___

A few quick examples:
```javascript
// with standard JS, if someNode doesn't exist:
console.log( myObject.someNode.someKey );				// crash!

// or dynamically
console.log( myObject[ 'someNode' ][ 'someKey' ] );		// crash!

// but, you can safely call with xs.js:
console.log( myObject.get('someNode someKey') );
// undefined
```

Ever tried to create an object with path to some property?
```javascript
var myObject.someNode.someKey= 'crash! way to intuitive..';

// pity, ok we all know how to do this the 'proper' way:
myObject= {};
myObject.someNode= {};
myObject.someNode.someKey= 'lame..';

// of course, some of you will think: dude, this is how you should do it:
var dumb= {
	someNode: {
		someKey: 'this sucks too..'
	}
};
myObject= dumb;

// now try with xs.js:
myObject= new Xs('someNode someKey', 'sweet!');

// or go nuts!
myObject= new Xs('nodes are just words, special !@#$%^ allowed, kidding?', 'omg!');

// which effectively creates this object:
//	nodes: {
//		are: {
//			just: {
//				'words,': {
//					special: {
//						'!@#$%^': {
//							'allowed,': {
//								'kidding?': 'omg!'
//							}
//						}
//					}
//				}
//			}
//		}
//	}

// now you could access this the standard JS way..
var value= myObject.object.nodes.are.just['words,'].special['!@#$%^']['allowed,']['kidding?'];

// easier and more save with xs.js:
value= myObject.get('nodes are just words, special !@#$%^ allowed, kidding?');
console.log(value);
// omg!
```

<br/>
Install xs.js, check the API below and wield your new powers for the good!
<br/>
<br/>
___

##Included:

xs.js includes **types.js** (full 2.2kB) and the smallest possible selection of **tools.js**, **strings.js** and **words.js**.

- types.js is a tiny type-checker/enforcer. It's API can be found at: https://github.com/phazelift/types.js
- strings.js is an extensive string manipulation library. It's API can be found at: https://github.com/phazelift/strings.js
- words.js is string manipulation related to words (includes strings.js) It's API can be found at: https://github.com/phazelift/words.js

all available via Xs:

```javascript
var _		= Xs.Types
	,Tools	= Xs.Tools
	,Strings= Xs.Strings
	,Words	= Xs.Words
;
```
___
**node.js**

When using xs.js in node.js, you can use `npm install xs.js`, after that:
```javascript
var Xs		= require('xs.js')
	,_		= Xs.Types
;

```
___
**AMD**

```javascript
require.config({
	 paths: {
		xs, [ 'path/to/xs.min(.js') ]
	}
});

require( ['xs'], function( Xs ){
	// load types.js
	var _= Xs.Types;

	console.log( _.isObject(Xs) );
	// true

	console.log( Xs.empty({}) );
	// true
});
```
___
**Browser**

```html
<script src="path/to/xs.min.js"></script>
```
___

# API
___
**Xs.prototype.constructor**
> `<this> Xs( <string>/<number>/<object> path, <any type> value )`

The constructor sets .object to {} and calls Xs.prototype.add with path and value as arguments. See .add for a
specification of path and value.

Some different ways to initialize a new instance of Xs:
```javascript
// the most basic start of an Xs object, a key:value pair:
var xs= new Xs( 'name', 'xs.js' );
// will create:
// {name: 'xs.js'}

// or a path to a key at once:
var xs= new Xs( 'javascript libraries useful xs.js', './xs.js' );
// javascript: {
//		libraries: {
//			useful: {
//				'xs.js': './xs.js'
//			}
//		}
//	}

// or, initialize as object:
var xs= new Xs( 'brush', {
	colors:{
		red		: '#f00',
		green	: '#0f0',
		blue	: '#00f',
		background: {
			red		: '#800',
			green	: '#080',
			blue	: '#008',
		}
	},
	size: 10
});
// I will use this object for all the following examples in the API
```
___
**Xs.prototype.object**
> `<object> object`

.object is the actual object. You can always directly access .object if you need faster/direct access to some node.

```javascript
console.log( xs.object.brush.colors.red );
// #f00
```
Yet, a better way to fetch this color would be using .gets, as .gets will always return type String. If for some
reason a non-String was to be found (except for Number which will be converted) at the given path, an empty string will be returned:
```javascript
console.log( xs.gets('brush colors red') );
// #f00

// try fetching a non-existing key
console.log( xs.gets('brush colors pink') );
// ''

// where .get would return undefined:
console.log( xs.get('brush colors pink') );
// undefined
```
___
**Xs.prototype.xs**
> `<array> xs( <function> callback(<string> key, <any type> value, <string> path) )`

xs walks the object recursively in order to access all nodes. While most of xs.js methods abstract away xs's
functionality, you can use xs yourself to apply more specific operations on xs.object.

xs expects only one argument, which is a callback function. While it traverses the object, callback get's called on
every node. It gets passed the key and value of that node, and an additional space delimited string/path as argument.
What you return with your callback can have effect on either the object itself, or on the array with info returned
by xs.

Any truthy value returned by the callback will push an info object for that node to the return array.

The following return values for callback are accepted:

- `undefined (or falsey)`
- `true (or truthy)`
- `{ key: 'someName', value: 'someValue', remove: true }`

<br/>
###### Each of these return values in more detail:

> `undefined (or a falsey value)`

When undefined is returned, nothing will change to xs.object and nothing will be pushed to the return array.

> `true (or a truthy value)`

With true you tell xs that it should push an object with the following 3 keys to it's
return array:
```javascript
{
	key		: 'name of this key',
	value	: 'value of this key',
	path	: 'node-path to this key'
}
```
> `{ key: <string>/<number> 'someName', value: <any type> 'someValue', remove: <boolean> true }`

When you return an object with one or more of the above keys, you modify the xs.object. You don't (and shouldn't)
provide all keys. It's futile to set a new value and at the same time remove the node. To change the name of a key
for example, only return a `{key: 'newName'}`. Invalid types for key will be ignored.

The following code example shows how to use xs to create a modified .setAllKeys that only applies to the
'terminator' keys:
```javascript
// change all (terminator)keys with name 'red' to 'sienna'
xs.xs( function(key, value, path){
	if ( key === 'red' && Xs.notObject(value) )
		return {key: 'sienna'};
});
console.log( xs.get('brush') );
// { colors:
//    { green: '#0f0',
//      blue: '#00f',
//      background: { green: '#080', blue: '#008', sienna: '#800' },
//      sienna: '#f00' },
//   size: 10 }
```
___
**Xs.prototype.empty**
> `<boolean> empty()`

Returns only true if xs.prototype.object is {}.
___
**Xs.prototype.copy**
> `<object> copy()`

Returns a shallow copy of xs.prototype.object. Every node in the .object will be copied, but reference values
inside arrays for example will be copied as references, not copies of the data they are pointing to.
___
**Xs.prototype.add**
> `<this> add( <string>/<number>/<object> path, <any type> value )`

Add a node or nodes to .object. Path can be an object, a key(name), or a node-path to, and including a key.
If path is an object, value won't be needed and will thus be ignored.

With add you cannot set existing nodes, path has to be new and unique. If the node-path already exists or
the argument is invalid, the call will be ignored.
```javascript
xs.add( 'brush', {style: 'soft'} );

// or easier:
xs.add( 'brush style', 'soft' );
console.log( xs.get() );
//	brush:
//   { colors: { red: '#f00', green: '#0f0', blue: '#00f', background: [Object] },
//     size: 10,
//     style: 'soft'
//	 }

// you could also create a pencil next to the 'brush' object:
xs.add( 'pencil', {
	density: 20,
	size: 4
});
console.log( xs.get() );
// { brush:
//    { colors: { green: '#0f0', blue: '#00f', background: [Object] },
//      size: 10 },
//   pencil: { density: 20, size: 4 } }
```
___
**Xs.prototype.remove**
> `<this> remove( <string>/<number> path )`

Removes a node from the object. If path points to an object, everything underneath that object will be removed as
well of course.

remove expects an absolute path to a node or property, non-absolute/non-existing paths and/or invalid arguments
will render no effect.

```javascript
// remove a specific key
xs.remove( 'brush colors red' );
console.log( xs.get('brush colors') );
// { green: '#0f0', blue: '#00f',
//   background: { red: '#800', green: '#080', blue: '#008' }
// }

// remove the colors node/object
xs.remove( 'brush colors' );
console.log( xs.get() );
// { brush: {size: 10} }
```
___
**Xs.prototype.removeAll**
> `<this> removeAll( <string>/<number> name )`

removeAll removes all nodes with name from xs.object. As with remove, an invalid argument or non-existing name
will render no effect.

If we want to remove all red's from the object, we can do with ease using removeAll:

```javascript
xs.removeAll('red');
console.log( xs.get('brush colors') );
// { green: '#0f0', blue: '#00f',
//   background: { green: '#080', blue: '#008' }
// }
```
___
**Xs.prototype.set**
> `<this> set( <string>/<number> path, <any type> value )`

With set you can overwrite the value of an existing node. Non-existing or invalid paths/arguments
will be ignored.

The following example uses the same arguments as with the previous example, but now with set. You'll see that this time
the entire brush node is overwritten with the given value:

```javascript
xs.set( 'brush', {style: 'soft'} );
console.log( xs.get() );
// brush: {	style: 'soft' }

// but be aware! you cannot:
xs.set( 'brush style', 'soft' );
// ignored, because xs.object.brush.style doesn't exist, and you cannot add with set!
```
___
**Xs.prototype.setAll**
> `<this> setAll( <string>/<number> name, <any type> value )`

With setAll you can set all existing nodes in the object with name to the given value. If name is invalid or not
found, no changes will be made.
```javascript
xs.setAll('blue', '#00d');
console.log( xs.get('brush colors') );
// { red: '#f00', green: '#0f0', blue: '#00d',
//   background: { red: '#800', green: '#080', blue: '#00d' }
// }
```
___
**Xs.prototype.setKey**
> `<this> setKey( <string>/<number> path, <string>/<number> newName )`

With setKey you can rename an existing node. If newName already exists in the node-path, or the path is invalid or
non-existing, no changes will be made. setKey is similar to set, it only sets the name of the node instead of the value.

```javascript
xs.setKey( 'brush colors red', 'sienna' );
console.log( xs.get('brush colors') );
// { sienna: '#f00',
//   green: '#0f0',
//   blue: '#00f',
//   background: { red: '#800', green: '#080', blue: '#008' } }
```
___
**Xs.prototype.setAllKeys**
> `<this> setAllKeys( <string>/<number> name, <string>/<number> newName )`

With setAllKeys you can set all nodes with name, to newName. If name is invalid or not found, no changes will be made.
If one of the found node-paths already has a node with newName, it will be left unchanged.
```javascript
xs.setAllKeys('red', 'sienna');
console.log( xs.get('brush colors') );
// { sienna: '#f00', green: '#0f0', red: '#00d',
//   background: { sienna: '#800', green: '#080', blue: '#00d' }
// }
```
___
**Xs.prototype.search**
> `<this> search( <string>/<number> name )`

With search you can search the object for nodes with name. An array will return containing one or more objects that
contain info about the found node. name should not be a node-path, just the name of a node somewhere in the object.
If name is invalid or not found, an empty array will be returned.

Internally search uses Xs.prototype.xs so you can check xs to find out about the format of the returned objects.

```javascript
console.log( xs.search('background') );
// [ { key: 'background',
//     value: { red: '#800', green: '#080', blue: '#008' },
//     path: 'brush colors background' } ]

//or
console.log( xs.search('red') );
// [ { key: 'red',
//     value: '#f00',
//     path: 'brush colors red' },
//   { key: 'red',
//     value: '#800',
//     path: 'brush colors background red' } ]
```
___
**Xs.prototype.find**

Alias for Xs.prototype.search.
___
**Xs.prototype.list**
> `<this> list( <string>/<number> path )`

List returns an info array containing all nodes found (deep) under an absolute path, a bit like 'ls -R' in bash.
Internally list uses Xs.prototype.xs so you can check .xs to find out about the format of the returned objects.
If path is invalid or not found, an empty array will be returned.

```javascript
console.log( xs.list('brush colors background') );
// [ { key: 'background',
//     value: { red: '#800', green: '#080', blue: '#008' },
//     path: 'brush colors background' },
//   { key: 'red',
//     value: '#800',
//     path: 'brush colors background red' },
//   { key: 'green',
//     value: '#080',
//     path: 'brush colors background green' },
//   { key: 'blue',
//     value: '#008',
//     path: 'brush colors background blue' } ]
```
___
**Xs.prototype.ls**

Alias for Xs.prototype.list.
___
**Xs.prototype.get**
> `<this> get( <string>/<number> path, <boolean> terminator )`

get is the default method to get a nodes value. Path must be an absolute node-path to an existing node, if it is
non-existing or invalid it returns undefined. If you call get without arguments the full .object will be returned.
```javascript
// fetch some nodes value
console.log( xs.get('brush colors') );
// { red: '#f00',
//   green: '#0f0',
//   blue: '#00f',
//   background: { red: '#800', green: '#080', blue: '#008' } }

// or a terminator's value
console.log( xs.get('brush colors red') );
// #f00

// no crash if some part of the path is non-existing
console.log( xs.get('brush default colors red') );
// undefined
```
___
**Xs.prototype.gets**
> `<string> gets( path )`

Returns value found at path, only if it is exists and is of type String, or convertable to String, otherwise an
empty string will be returned.
___
**Xs.prototype.getn**
> `<number> getn( path, replacement )`

Returns number found at path, only if it is exists and is of type Number(according to types.js), or is convertible
to a number. If no valid number is found at path, replacement will be used to set the return value. When replacement
is undefined, a new Number object is returned with a .void property set to true (see types.js .forceNumber for info).
___
**Xs.prototype.geto**
> `<object> geto( path )`

Returns the object found at path, only if it is exists and is of type Object, otherwise an empty object(literal) will be
returned.
___
**Xs.prototype.geta**
> `<array> geta( path )`

Returns array found at path, only if it is exists and is of type Array, otherwise an empty array(literal) will be returned.
___
**Xs.prototype.keys**
> `<array> keys( <string>/<number> path )`

Keys expects an absolute path to a node/object. If the path exists, keys will return an array with all
node/property names found in that node, but it's not 'deep', it will not list keys on levels below that node.
If path is invalid or points to a terminator/property, an empty array is returned.

```javascript
console.log( xs.keys('brush') );
// [ 'colors', 'size' ]
console.log( xs.keys('brush colors') );
// [ 'red', 'green', 'blue', 'background' ]
```
___
**Xs.prototype.values**
> `<array> values( <string>/<number> path )`

Values expects an absolute path to a node/object. If the path exists, values will return an array with all
node/property values found in that node, but it's not 'deep', it will not list values on levels below that node.
If path is invalid or points to a non-object, an empty array is returned.
```javascript
console.log( xs.values('brush colors background') );
// [ '#800', '#080', '#008' ]
```
___
**Xs.prototype.paths**
> `<array> paths( <string>/<number> name )`

Paths expects a non-absolute node-name to search for. An array with paths to all found node names will be returned.
If name is invalid or no nodes with name are found, an empty array is returned.

```javascript
console.log( xs.paths('red') );
// [ 'brush colors red', 'brush colors background red' ]
```
___
**Xs.prototype.addListener**
> `<Listener> addListener( <string> path, <function> callback )`

Returns a listener object for path. Path must be a node-path to an existing node. Every change to node at path,
will trigger callback. The returned object has two methods; .trigger() and .remove() that can be called like so:
```javascript
var listener= xs.addListener( 'node path', function(path, data){
	console.log( 'something at '+ path+ ' has changed..' );
	console.log( 'the data value given is: '+ data );
});
xs.set( 'node path', 'trigger the listener!' );
// something at node path has changed..
// the data value given is: trigger the listener

// now, trigger the listener manually and override the default data parameter
listener.trigger( 'hi!' );
// something at node path has changed..
// the data value given is: 'hi!'

listener.remove();
// will remove the listener and make listener undefined.
```
___
**Xs.prototype.triggerListener**
> `<this> triggerListener( <string> path, <any type> data )`

Triggers the given path and passes data as argument. Returns context.
___
**Xs.prototype.removeListener**
> `<this> removeListener( <string> paths, [paths1, ..., pathsN] )`

Removes the given listeners at paths, making them undefined. Returns context.
___

change log
==========
**0.2.0**

Removed words.js dependency, xs.js is now stand-alone ~10kB minified:)

Load words.js or strings.js manually if you're missing them.
___
**0.1.8**

Added AMD loader support.
___
**0.1.6**

Updated the words.js dependency to version 0.3.7.
Fixed a bug in Xs.add that caused an error when adding non existing paths in a very specific way.
___
**0.1.3**

Updated the words.js dependency to version 0.3.6
___
**0.1.2**

Added two aliases; Xs.prototype.ls for .list and Xs.prototype.find for .search.
___
**0.1.0**

First commit.

Thoroughly tested already, partly with Jasmine, but objects are time consuming to test, still a lot to do..
___
todo:
=====

- source annotations
- some more testing
- make listeners more specific for any combination of: add, create, read, update, delete

___
**Additional**

I am always open for feature requests or any feedback. You can reach me at Github.