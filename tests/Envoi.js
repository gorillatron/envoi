
var Envoi = require("../index").Envoi,
    expect = require("expect.js")

describe("Envoi", function() {
    
  describe("Envoi.prototype.subscribe", function() {
    
    var envoi

    beforeEach(function() {
      envoi = new Envoi()
    })

    it("should bind the third context callback as the this value for the callback", function() {
      
      var _this, that

      _this = { foo: 'bar' }

      envoi.subscribe("context", function() {
        that = this
      }, _this)

      envoi.publish( "context" )

      expect( _this ).to.equal( that )
      expect( that["foo"] ).to.equal( "bar" )

    })

  })

  describe("Envoi.prototype.publish", function() {
    
    var envoi

    beforeEach(function() {
      envoi = new Envoi()
    })

    it("should fire all subscribing callbacks with the arguments.. after channel", function() {
      
      var a, b, c

      envoi.subscribe("abc", function( _a, _b, _c) {
        a = _a
        b = _b
        c = _c
      })

      envoi.publish( "abc", 'a', 'b', 'c' )

      expect( a ).to.equal( "a" )
      expect( b ).to.equal( "b" )
      expect( c ).to.equal( "c" )

    })

  })


  describe("Envoi.prototype.unsubscribe", function() {
    
    var envoi

    beforeEach(function() {
      envoi = new Envoi()
    })

    it("should remove all callbacks if only channel is given", function() {

      var calls = 0

      envoi.subscribe( "foo", function() { calls++ } )
      envoi.subscribe( "foo", function() { calls++ } )
      envoi.subscribe( "foo", function() { calls++ } )

      envoi.publish("foo")
      expect( calls ).to.equal( 3 )

      envoi.unsubscribe( "foo" )

      envoi.publish("foo")
      expect( calls ).to.equal( 3 )

    })

    it("should remove a specific subscription that has the callback specified in parameters", function() {
      
      var i, callback

      i = 0
      callback = function() { i++ }

      envoi.subscribe( "increment", callback )

      envoi.publish( "increment" )
      envoi.publish( "increment" )

      expect( i ).to.equal( 2 )

      envoi.unsubscribe( "increment", callback )

      envoi.publish( "increment" )

      expect( i ).to.equal( 2 )

    })

  })
  
  describe("namespaces", function() {

    var envoi

    beforeEach(function() {
      envoi = new Envoi()
    })

    describe("Envoi.prototype.namespaceMatch", function() {

      var envoi

      beforeEach(function() {
        envoi = new Envoi()
      })

      it("should return a boolean if the first namespace is within the second namespace parameter", function() {

        expect( envoi.namespaceMatch("foo", "foo") ).to.equal( true )  
        expect( envoi.namespaceMatch("foo::bar", "foo") ).to.equal( true )
        expect( envoi.namespaceMatch("foo::bar::lol", "foo") ).to.equal( true )

        expect( envoi.namespaceMatch("foo::bar", "foo::bar") ).to.equal( true )  
        expect( envoi.namespaceMatch("foo::bar::nice", "foo::bar") ).to.equal( true )

        expect( envoi.namespaceMatch("foo::bar::nice", "foo::bar") ).to.equal( true )

        expect( envoi.namespaceMatch("not::bar::nice", "foo::bar") ).to.equal( false )  

      })
      

    })

    it("should fire all subscribers where where subscriber namespace is within the published namespace", function() {

      var stat = {
        "foo": 0,
        "foo::bar": 0,
        "foo::bar::lol": 0
      }

      envoi.subscribe("foo", function( n ) { stat["foo"] += n })
      envoi.subscribe("foo::bar", function( n ) { stat["foo::bar"] += n })
      envoi.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
      
      envoi.publish("foo", 1)
      envoi.publish("foo::bar", 1)
      envoi.publish("foo::doesntexist", 1)
      envoi.publish("foo::bar::lol", 1)
      
      expect( stat["foo"] ).to.equal( 4 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

    })

    it("should remove all subscribers where where subscriber namespace is within the unsubscribed namespace", function() {

      var stat = {
        "foo": 0,
        "foo::bar": 0,
        "foo::bar::lol": 0
      }

      envoi.subscribe("foo", function( n ) { stat["foo"] += n })
      envoi.subscribe("foo::bar", function( n ) { stat["foo::bar"] += n })
      envoi.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
      
      envoi.publish("foo", 1)
      envoi.publish("foo::bar", 1)
      envoi.publish("foo::bar::lol", 1)

      expect( stat["foo"] ).to.equal( 3 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

      envoi.unsubscribe("foo")

      envoi.publish("foo", 1)
      envoi.publish("foo::bar", 1)
      envoi.publish("foo::bar::lol", 1)

      expect( stat["foo"] ).to.equal( 3 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

    })

  })
  
})