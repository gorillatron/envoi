
var extend = require( "extend" )


/**
  @class Mediator
  @exports Mediator
*/

function Mediator( config ) {
  this.channels = {}
  this.configuration = extend( Mediator.configuration, config || {} )
}


/**
  Configuration for mediators.
  @public
  @static
  @type Object
*/
Mediator.configuration = {
  namespaceDelimiter: "::"
}


/**
  Binds a callback to be called when published to the channel given.
  @public
  @type Function
  @param {String} channel The name of the channel to bind the callback to
  @param {Function} callback The callback to fire
  @param {Object} context The context of the callback. The callback will have this paramter as its this value
*/
Mediator.prototype.subscribe = function( channel, callback, context ) {
  if( typeof channel !== 'string' ) 
    throw new TypeError( 'channel must be string' ) 
  if( typeof callback !== 'function' )
    throw new TypeError( 'callback must be function' ) 

  if( !this.channels[channel] )
    this.channels[ channel ] = [ ]

  this.channels[ channel ].push({
    callback: callback,
    context: context
  })
}


/**
  Removes a callback where the given arguments mathes the listener properties
  @public
  @type Function
  @param {String} channel The name of the channel to bind the callback to
  @param {Function} callback The callback to fire
*/
Mediator.prototype.unsubscribe = function( channel, callback ) {
  var subscribingChannel, subscriptions, i, subscription

  for( subscribingChannel in this.channels ) {
    if( !this.namespaceMatch(subscribingChannel, channel) )
      continue

    if( !callback ) {
      delete this.channels[ subscribingChannel ]
      continue
    }

    subscriptions = this.channels[ subscribingChannel ]

    for( i = 0; i < subscriptions.length; i++ ) {
      subscription = subscriptions[ i ]
      if( subscription.callback === callback ) {
        subscriptions.splice( i, 1 )
        i--
      }
    }

  }
}


/**
  Publish to a channel, passing the arguments after channel to the callback.
  @public
  @type Function
  @param {String} channel The name of the channel to unbind the callback from
  @param {Mixed[]} args The arguments after channel to be passed to callback
  @returns {Boolean}
*/
Mediator.prototype.publish = function( channel, callback ) {
  var subscriptions, args, subscribingChannel, i, subscription

  subscriptions = []

  for( subscribingChannel in this.channels ) {
    if( this.namespaceMatch(channel, subscribingChannel) ) {
      if( this.channels[subscribingChannel] ) {
        subscriptions = subscriptions.concat( this.channels[subscribingChannel] )
      }
    }
  }

  if( !subscriptions.length ) 
    return false

  args = [].slice.call(arguments, 1)
  for( i = 0; i < subscriptions.length; i = i+1 ) {
    subscription = subscriptions[i]
    subscription.callback.apply( subscription.context, args )
  }

  return true
}


/**
  Check if a channel name is within the bound of another channel namespace.
  @public
  @type Function
  @param {String} targetNs The name of the channel published to
  @param {String} outerNs The name of the subscribing channel to test against
  @returns Boolean
*/
Mediator.prototype.namespaceMatch = function( targetNs, outerNs ) {
  var targetNamespace, outerNamespace, i

  targetNamespace = targetNs.split( this.configuration.namespaceDelimiter )
  outerNamespace = outerNs.split( this.configuration.namespaceDelimiter )

  for( i = 0; i < outerNamespace.length; i++ ) {
    if( outerNamespace[i] !== targetNamespace[i] ) {
      return false
    }
  }

  return true
}

module.exports = Mediator
