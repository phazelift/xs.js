# xs.coffee - A Javascript object utility, written in Coffeescript.
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

# load dependencies
if window? then Words= window.Words
else if module? then Words= require 'words.js'

# create shortcuts to dependencies
Strings= Words.Strings
_= Words.Types

# following methods, made private, were taken out of the object while refactoring, for (micro) speed optimization
# only some type checking is removed

# checks if the object has at least one property
_emptyObject= ( object ) ->
	for key of object
		return false if object.hasOwnProperty key
	return true

# target needs the empty object literal as default for the recursive operation
_extend= ( target= {}, source, append ) ->
	for key, value of source
		if _.isObject value
     		_extend target[ key ], value, append
      else
			target[ key ]= value if not ( append and target.hasOwnProperty key )
	return target

# 3 response options for the callack: key, value, remove
_xs= ( object, callback ) ->
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
_xsPath= ( object, path, command ) ->
	nodes= Strings.oneSpaceAndTrim( _.forceString(path) ).split ' '
	return if nodes[0] is ''
	length= nodes.length- 2
	if length > -1
		# find the node at path
		for index in [0..length]
			return if undefined is object= object[ nodes[index] ]
	else index= 0

	target= nodes[ index ]
	# check object with .hasOwnProperty to allow for undefined keys
	if _.isDefined( command ) and object.hasOwnProperty target
		if command.remove
			return delete object[ target ]
		# only change key to new name if that new name is not a key already
		if command.key and not object.hasOwnProperty command.key
			object[ command.key ]= object[ target ]
			delete object[ target ]
			target= command.key
		if command.value and object.hasOwnProperty target
			object[ target ]= command.value

	result= object[ target ]
	return result

#															Xs

class Xs

	@empty: ( object ) ->
		return false if _.notObject( object ) or object instanceof Number
		return _emptyObject object

	@extend: ( target, source ) -> _extend _.forceObject(target), _.forceObject(source)
	@append: ( target, source ) -> _extend _.forceObject(target), _.forceObject(source), true

	@add: ( object= {}, path, value ) ->
		if _.isObject path
			return _extend object, path, true
		path= new Words path
		valueIsObject= _.isObject value
		target= object
		for node, index in path.words
			target[ node ]?= {} if ( index < (path.count- 1) or valueIsObject )
			if index < (path.count- 1)
				target= target[ node ] if target.hasOwnProperty node
			else if valueIsObject
				_extend target[ node ], value, true
			else target[ node ]?= value
		return object

	@xs: ( object, callback ) ->
		return [] if _.notObject object
		return _xs object, callback

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
		return _xsPath(object, path, commands) if _.isObject object
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

	constructor: ( path, value ) ->
		@object= {}
		Xs.add( @object, path, value ) if path

	xs: ( callback ) -> Xs.xs @object, callback

	empty: -> _emptyObject @object

	copy: -> Xs.copy @object

	add: ( path, value ) -> Xs.add @object, path, value

	remove: ( path ) -> _xsPath @object, path, {remove: true}

	removeAll: ( query ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {remove: true} if key is query
		return @

	set: ( nodePath, value ) ->
		return '' if '' is nodePath= _.forceString nodePath
		value= _xsPath @object, nodePath, {value: value}
		if _.isObject value
			keys= new Xs( value ).search()
			@triggerListener( nodePath+ ' '+ key.path, value ) for key in keys
		else @triggerListener nodePath, value
		return value

	setAll: ( query, value ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {value: value} if key is query
			@triggerListener( result.path, value ) for result in @search query
		return @

	setKey: ( query, name ) -> _xsPath @object, query, {key: name}

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
		return _xsPath @object, path

	getn	: ( path, replacement ) -> Xs.getn @object, path, replacement
	gets	: ( path ) -> Xs.gets @object, path
	geta	: ( path ) -> Xs.geta @object, path
	geto	: ( path ) -> Xs.geto @object, path

	keys: ( path ) ->
		keys= []
		# not calling Xs.keys because it checks for validity of @object, slower..
		if _.isObject path= _xsPath @object, path
			keys.push key for key of path
		return keys

	values: ( path ) ->
		values= []
		if _.isObject path= _xsPath @object, path
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

# end Xs

#														Listeners

# refactor below this line:

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
		path= new Words path
		listeners= @listeners.search '*'
		# trigger all subs if we have a wildcard
		for node in listeners
			callbacks= node.value
			nodePath= new Words( node.path ).remove(-1).$
			if path.startsWith nodePath
				callback?( path.$, data ) for name, callback of callbacks

		listeners= @listeners.get Strings.oneSpaceAndTrim path.$
		listener?( path.$, data ) for k, listener of listeners
		return @

	remove: ( path ) -> @listeners.remove Strings.oneSpaceAndTrim path; @

# end Listeners

# some aliases:
Xs::ls= Xs::list
Xs::find= Xs::search

# give access to dependencies
Xs.Types= Words.Types
Xs.Strings= Words.Strings
Xs.Words= Words

if window? then window.Xs= Xs
else if module? then module.exports= Xs