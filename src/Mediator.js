var _ = require( 'underscore' )




/**
  @class Mediator
  @exports Mediator
*/
module.exports = Mediator
function Mediator( config ) {
  this.namespaces = {}
  this.configuration = _.extend({}, Mediator.configuration, config || {} )
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
  Binds a callback to be called when published to the namespace given.
  @public
  @type Function
  @param {String} namespace The name of the namespace to bind the callback to
  @param {Function} callback The callback to fire
  @param {Object} context The context of the callback. The callback will have this paramter as its this value
*/
Mediator.prototype.subscribe = function( namespace, callback, context ) {
  if( typeof namespace !== 'string' ) 
    throw new TypeError( 'namespace must be string' ) 
  if( typeof callback !== 'function' )
    throw new TypeError( 'callback must be function' ) 

  if( !this.namespaces[namespace] )
    this.namespaces[ namespace ] = [ ]

  this.namespaces[ namespace ].push({
    callback: callback,
    context: context
  })
}


/**
  Removes a callback where the given arguments mathes the listener properties
  @public
  @type Function
  @param {String} namespace The name of the namespace to bind the callback to
  @param {Function} callback The callback to fire
*/
Mediator.prototype.unsubscribe = function( namespace, callback ) {
  var subscribingChannel, subscriptions, i, subscription

  for( subscribingChannel in this.namespaces ) {
    if( !this.namespaceMatch(subscribingChannel, namespace) )
      continue

    if( !callback ) {
      delete this.namespaces[ subscribingChannel ]
      continue
    }

    subscriptions = this.namespaces[ subscribingChannel ]

    for( i = subscriptions.length - 1; i >= 0; i-- ) {
      subscription = subscriptions[ i ]
      if( subscription.callback === callback ) {
        subscriptions.splice( i, 1 )
      }
    }
  }
}


/**
  Publish to a namespace, passing the arguments after namespace to the callback.
  @public
  @type Function
  @param {String} namespace The name of the namespace to unbind the callback from
  @param {Mixed[]} args The arguments after namespace to be passed to callback
  @returns {Boolean}
*/
Mediator.prototype.publish = function( namespace, callback ) {
  var subscriptions, args, subscribingChannel, i, subscription

  subscriptions = this.getSubscriptionsForNamespace( namespace )

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
  Get all subscriptions for a given namespace
  @public
  @type Function
  @param {String} namespace The name of the namespace to unbind the callback from
  @returns [Object]
*/
Mediator.prototype.getSubscriptionsForNamespace = function( namespace ) {
  var subscriptions

  subscriptions = []

  for( subscribingChannel in this.namespaces ) {
    if( this.namespaceMatch(namespace, subscribingChannel) && this.namespaces[subscribingChannel] ) {
      subscriptions = subscriptions.concat( this.namespaces[subscribingChannel] )
    }
  }

  return subscriptions
}


/**
  Check if a namespace name is within the bound of another namespace namespace.
  @public
  @type Function
  @param {String} targetNs The name of the namespace published to
  @param {String} outerNs The name of the subscribing namespace to test against
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

