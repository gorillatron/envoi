# Envoi

Loosly coupled and namespaced communication. Mediator, pub/sub pattern.

## Installation

```
$ npm install envoi
```

## Usage

```js
var Envoi = require( 'envoi' ).Envoi
var envoi = new Envoi()

envoi.subscribe( "chat", logChatEvent )
envoi.subscribe( "chat::message", displayMessage )

// 'chat' and 'chat::message' will fire because of namespacing
envoi.publish( "chat::message", "shaggy87", "lol dope" )

```

### Api

#### Envoi.prototype.subscribe( channel, callback, context )

Subscribe to the given channel/namespace. Call the given callback with the given context as 'this'
when that channels is published to.

#### Envoi.prototype.unsubscribe( channel, callback )

Unsubscribe from channel. If only channel is given all callbacks that match the channels namspace will be 
removed. If callback is given it will only remove subscriptions that has that specific callback

#### Envoi.prototype.publish( channel, args.. )

Publishes to the channel, calling all subscribing callbacks with the rest of the arguments as arguments
to the calback function[s].


## License 

MIT licensed