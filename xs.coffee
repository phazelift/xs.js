# xs.coffee - A Javascript deep object manipulation tool/library, written in Coffeescript.
#
# Copyright (c) 2014 Dennis Raymondo van der Sluis
#
# This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with this program.  If not, see <http://www.gnu.org/licenses/>

"use strict"

#													types.coffee (types.js v1.5.0)
#

instanceOf	= ( type, value ) -> value instanceof type
typeOf		= ( value, type= 'object' ) -> typeof value is type

LITERALS=
	'Boolean'	: false
	'String'		: ''
	'Object'		: {}
	'Array'		: []
	'Function'	: ->
	'Number'		: do ->
		number= new Number
		number.void= true
		return number

TYPES=
	'Undefined'		: ( value ) -> value is undefined
	'Null'			: ( value ) -> value is null
	'Function'		: ( value ) -> typeOf value, 'function'
	'Boolean'		: ( value ) -> typeOf value, 'boolean'
	'String'			: ( value ) -> typeOf value, 'string'
	'Array'			: ( value ) -> typeOf(value) and instanceOf Array, value
	'RegExp'			: ( value ) -> typeOf(value) and instanceOf RegExp, value
	'Date'			: ( value ) -> typeOf(value) and instanceOf Date, value
	'Number'			: ( value ) -> typeOf(value, 'number') and (value is value) or ( typeOf(value) and instanceOf(Number, value) )
	'Object'			: ( value ) -> typeOf(value) and (value isnt null) and not instanceOf(Boolean, value) and not instanceOf(Number, value) and not instanceOf(Array, value) and not instanceOf(RegExp, value) and not instanceOf(Date, value)
	'NaN'				: ( value ) -> typeOf(value, 'number') and (value isnt value)
	'Defined'		: ( value ) -> value isnt undefined

TYPES.StringOrNumber= (value) -> TYPES.String(value) or TYPES.Number(value)

Types= _=
	parseIntBase: 10


createForce= ( type ) ->
	convertType= ( value ) ->
		switch type
			when 'Number' then return value if (_.isNumber value= parseInt value, _.parseIntBase) and not value.void
			when 'String' then return value+ '' if _.isStringOrNumber value
			else return value if Types[ 'is'+ type ] value

	return ( value, replacement ) ->

		return value if value? and undefined isnt value= convertType value
		return replacement if replacement? and undefined isnt replacement= convertType replacement
		return LITERALS[ type ]


testValues= ( predicate, breakState, values= [] ) ->
	return ( predicate is TYPES.Undefined ) if values.length < 1
	for value in values
		return breakState if predicate(value) is breakState
	return not breakState


breakIfEqual= true
do -> for name, predicate of TYPES then do ( name, predicate ) ->
	Types[ 'is'+ name ]	= predicate
	Types[ 'not'+ name ]	= ( value ) -> not predicate value
	Types[ 'has'+ name ]	= -> testValues predicate, breakIfEqual, arguments
	Types[ 'all'+ name ]	= -> testValues predicate, not breakIfEqual, arguments
	Types[ 'force'+ name ]= createForce name if name of LITERALS

Types.intoArray= ( args... ) ->
	if args.length < 2
		if _.isString args[ 0 ]
			args= args.join( '' ).replace( /^\s+|\s+$/g, '' ).replace( /\s+/g, ' ' ).split ' '
		else if _.isArray args[ 0 ]
			args= args[ 0 ]
	return args

Types.typeof= ( value ) ->
	for name, predicate of TYPES
		return name.toLowerCase() if predicate( value ) is true

#
# end of types.js


#													a selection of tools.js
#
class Tools

	# Words.remove
	@positiveIndex: ( index, max ) ->
		return false if 0 is index= _.forceNumber index, 0
		max= Math.abs _.forceNumber max
		if Math.abs( index ) <= max
			return index- 1 if index > 0
			return max+ index
		return false


	# only for sorted arrays
	@noDupAndReverse: ( array ) ->
		length= array.length- 1
		newArr= []
		for index in [length..0]
			newArr.push array[ index ] if newArr[ newArr.length- 1 ] isnt array[ index ]
		return newArr

	@insertSort: ->
		array= _.intoArray.apply @, arguments
		if array.length > 1
			length= array.length- 1
			for index in [ 1..length ]
				current	= array[ index ]
				prev		= index- 1
				while ( prev >= 0 ) && ( array[prev] > current )
					array[ prev+1 ]= array[ prev ]
					--prev
				array[ +prev+1 ]= current
		return array

#
# end of Tools

#													a selection of strings.js
#

class Strings

	@create: ->
		string= ''
		string+= _.forceString( arg ) for arg in arguments
		return string

	@trim					: ( string= '' ) -> (string+ '').replace /^\s+|\s+$/g, ''
	@oneSpace			: ( string= '' ) -> (string+ '').replace /\s+/g, ' '
	@oneSpaceAndTrim	: ( string ) -> Strings.oneSpace( Strings.trim(string) )

	@create: ->
		string= ''
		string+= _.forceString( arg ) for arg in arguments
		return string

	@split: ( string, delimiter ) ->
		string= Strings.oneSpaceAndTrim string
		result= []
		return result if string.length < 1
		delimiter= _.forceString delimiter, ' '
		array= string.split delimiter[ 0 ] or ''
		for word in array
			continue if word.match /^\s$/
			result.push Strings.trim word
		return result

#
# end of Strings


#													a selection of words.js
#

class Words

	@delimiter: ' '

	constructor: -> @set.apply @, arguments


	get: ->
		return @words.join( Words.delimiter ) if arguments.length < 1
		string= ''
		for index in arguments
			index= Tools.positiveIndex( index, @count )
			string+= @words[ index ]+ Words.delimiter if index isnt false
		return Strings.trim string

	set: ( args... ) ->
		@words= []
		args= _.intoArray.apply @, args
		return @ if args.length < 1
		for arg in args
			@words.push( str ) for str in Strings.split Strings.create( arg ), Words.delimiter
		return @

	xs: ( callback= -> true ) ->
		return @ if _.notFunction( callback ) or @count < 1
		result= []
		for word, index in @words
			if response= callback( word, index )
				if response is true then result.push word
				else if _.isStringOrNumber response
					result.push response+ ''
		@words= result
		return @

	startsWith: ( start ) ->
		return false if '' is start= _.forceString start
		result= true
		start= new Words start
		start.xs ( word, index ) =>
			result= false if word isnt @words[ index ]
		return result

	remove: ->
		return @ if arguments.length < 1
		args= []
		for arg in arguments
			if _.isString arg
				args.unshift arg
			else if _.isNumber arg
				args.push Tools.positiveIndex arg, @count
		args= Tools.noDupAndReverse Tools.insertSort args
		for arg, index in args
			if _.isNumber arg
				@xs ( word, index ) => true if index isnt arg
			else if _.isString arg then @xs ( word ) -> true if word isnt arg
		return @

Object.defineProperty Words::, '$', { get: -> @.get() }
Object.defineProperty Words::, 'count', { get: -> @words.length }


#
# end of Words

#														Xs PRIVATE
#

class Xs

	# checks if the object has at least one property
	emptyObject= ( object ) ->
		for key of object
			return false if object.hasOwnProperty key
		return true

	# target needs the empty object literal as default for the recursive operation
	extend= ( target= {}, source, append ) ->
		for key, value of source
			if _.isObject value
	     		extend target[ key ], value, append
	      else
				target[ key ]= value if not ( append and target.hasOwnProperty key )
		return target

	# 3 response options for the callack: key, value, remove
	xs= ( object, callback ) ->
		# force callback to be a function, returning true by default, so if only object is given
		# the return array contains all nodes in object
		callback= _.forceFunction callback, -> true

		# traverse will call itself recursively until either the last node has been processed or
		# the callback returns {stop: true}
		traverse= ( node ) ->
			for key, value of node
				# check the recursive node instead of value to reach terminators as well
				continue if _.notObject node
				path.push key
				if response= callback key, value, path

					if _.isObject response
						if response.remove is true
							delete node[ key ]
						else
							if _.isDefined response.value
								value= node[ key ]= response.value
								continue
							if _.isDefined(response.key) and '' isnt responseKey= _.forceString response.key
								# only change key name if no key already exists with response.key/newName
								if not node.hasOwnProperty responseKey
									node[ responseKey ]= value
									delete node[ key ]

					result.push
						key		: key
						value		: value
						path		: path.join ' '

					return if response?.stop is true

				traverse value
				path.pop()

		result	= []
		path		= []
		traverse object
		return result

	# made this second xs method for specific paths because it's way faster
	# command has 3 options: key, value, remove
	xsPath= ( object, path, command ) ->
		# after oneSpaceAndTrim we can't get sparse, use the standard/faster .split
		nodes= Strings.oneSpaceAndTrim( _.forceString(path) ).split ' '
		return if nodes[ 0 ] is ''

		length= nodes.length- 2
		if length > -1
			# find the node at path
			for index in [0..length]
				# try to build path from the root
				return if undefined is object= object[ nodes[index] ]
		else index= 0

		# the path exists, object is the node and index points to the key
		key= nodes[ index ]
		# check object with .hasOwnProperty to allow for undefined keys
		if _.isDefined( command ) and object.hasOwnProperty key
			if command.remove
				return delete object[ key ]
			# only change key to new name if that new name is not a key already
			if command.key and not object.hasOwnProperty command.key
				object[ command.key ]= object[ key ]
				delete object[ key ]
				key= command.key
			if command.value and object.hasOwnProperty key
				object[ key ]= command.value

		result= object[ key ]
		return result

	#													Xs STATIC

	# give access to dependencies
	@Types	: Types
	@Tools	: Tools
	@Strings	: Strings
	@Words	: Words

	@empty: ( object ) ->
		return false if _.notObject( object ) or object instanceof Number
		return emptyObject object

	@extend: ( target, source ) -> extend _.forceObject(target), _.forceObject(source)
	@append: ( target, source ) -> extend _.forceObject(target), _.forceObject(source), true

	@add: ( object= {}, path, value ) ->
		if _.isObject path
			return extend object, path, true
		path= new Words path
		valueIsObject= _.isObject value
		target= object
		for node, index in path.words
			target[ node ]?= {} if ( index < (path.count- 1) or valueIsObject )
			if index < (path.count- 1)
				target= target[ node ] if target.hasOwnProperty node
			else if valueIsObject
				extend target[ node ], value, true
			else target[ node ]?= value
		return object

	@xs: ( object, callback ) ->
		return [] if _.notObject object
		return xs object, callback

	# shallow copy
	@copy: ( object ) ->
		return {} if _.notObject object
		traverse= ( copy, node ) ->
			for key, value of node
				# not sure if this will work everywhere without .hasOwnProperty, need to check
				if _.isObject node then copy[ key ]= value # if node.hasOwnProperty( key )
				else traverse value
			return copy
		return traverse {}, object

	@get: ( object, path, commands ) ->
		return xsPath(object, path, commands) if _.isObject object
		return ''

	@getn: ( object, path, replacement ) -> _.forceNumber Xs.get(object, path), replacement
	@gets: ( object, path ) -> _.forceString Xs.get( object, path )
	@geta: ( object, path ) -> _.forceArray Xs.get( object, path )
	@geto: ( object, path ) -> _.forceObject Xs.get( object, path )

	@keys: ( object, path ) ->
		keys= []
		if _.isObject path= Xs.get object, path
			keys.push key for key of path
		return keys

	@values: ( object, path ) ->
		values= []
		if _.isObject path= Xs.get object, path
			values.push value for key, value of path
		return values

# end of statics
#														Xs DYNAMIC

	constructor: ( path, value ) ->
		@object= {}
		Xs.add( @object, path, value ) if path

	xs: ( callback ) -> Xs.xs @object, callback

	empty: -> emptyObject @object

	copy: -> Xs.copy @object

	add: ( path, value ) -> Xs.add @object, path, value

	remove: ( path ) -> xsPath @object, path, {remove: true}

	removeAll: ( query ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {remove: true} if key is query
		return @

	set: ( nodePath, value ) ->
		return '' if '' is nodePath= _.forceString nodePath

		if value= xsPath @object, nodePath, {value: value}
			if _.isObject value
				keys= new Xs( value ).search()
				for key in keys
					@triggerListener( nodePath+ ' '+ key.path, value )
			else
				@triggerListener nodePath, value
		return value

	setAll: ( query, value ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {value: value} if key is query
			@triggerListener( result.path, value ) for result in @search query
		return @

	setKey: ( query, name ) -> xsPath @object, query, {key: name}

	setAllKeys: ( query, name ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {key: name} if key is query
		return @

	search: ( query ) ->
		if _.isDefined query
			return [] if '' is query= Strings.trim query
		if query then predicate= ( key ) -> true if key is query
		else predicate= -> true
		result= @xs predicate
		return result

	list: ( query ) ->
		return [] if '' is query= Strings.oneSpaceAndTrim query
		if query then returnValue= ( path ) -> true if new Words( path.join(' ') ).startsWith query
		else returnValue= -> true
		return @xs ( k, v, path ) -> returnValue path

	get: ( path ) ->
		return @object if path is undefined
		return xsPath @object, path

	getn	: ( path, replacement ) -> Xs.getn @object, path, replacement
	gets	: ( path ) -> Xs.gets @object, path
	geta	: ( path ) -> Xs.geta @object, path
	geto	: ( path ) -> Xs.geto @object, path

	keys: ( path ) ->
		keys= []
		# not calling Xs.keys because it checks for validity of @object, slower..
		if _.isObject path= xsPath @object, path
			keys.push key for key of path
		return keys

	values: ( path ) ->
		values= []
		if _.isObject path= xsPath @object, path
			values.push value for key, value of path
		return values

	paths: ( node ) ->
		paths= []
		paths.push( entry.path ) for entry in @search node
		return paths

	addListener: ( path, callback ) ->
		@listeners= new Listeners if not @listeners
		return @listeners.add path, callback

	triggerListener: ( path, data ) ->	@listeners.trigger( path, data ) if @listeners; @

	removeListener: ( paths... ) ->
		if @listeners then for path in paths
			@listeners.remove path
		return @
#
# end Xs

# some aliases:
Xs::ls= Xs::list
Xs::find= Xs::search


#														Listeners
#

class Listeners

	@count: 0
	# simple class-unique name generator, force string, no number
	@newName: -> ''+ (++Listeners.count)

	constructor: ( @listeners= new Xs ) ->

	add: ( path, callback ) ->
		path= Strings.oneSpaceAndTrim path
		name= Listeners.newName()
		if listener= @listeners.get path
			listener[ name ]= callback
		else
			obj= {}
			obj[ name ]= callback
			@listeners.add path, obj
		trigger= @listeners.get path
		return {
			trigger: (data= '') -> trigger[ name ]?( path, data )
			remove: -> delete trigger[ name ]
		}

	trigger: ( path, data= '' ) ->
		for node in @listeners.search '*'
			callbacks= node.value
			if new Words(path).startsWith new Words( node.path ).remove(-1).$
				callback?( path, data ) for name, callback of callbacks

		listeners= @listeners.get Strings.oneSpaceAndTrim path
		for k, listener of listeners
			listener?( path, data )
		return @

	remove: ( path ) -> @listeners.remove Strings.oneSpaceAndTrim path; @

#
# end Listeners

if define? and ( typeof define is 'function' ) and define.amd
	define 'xs', [], -> Xs

else if window?
	window.Xs= Xs

else if module?
	module.exports= Xs
