//.  app.js
var express = require( 'express' ),
    fs = require( 'fs' ),
    request = require( 'request' ),
    app = express();
var settings = require( './settings' );

app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

//. '/list' にアクセスがあった場合の処理
app.get( '/list', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var option = {
    url: settings.api_url + 'searchcreated?format=json&limit=10',
    method: 'GET'
  };
  request( option, ( err0, res0, body0 ) => {
    if( err0 ){
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: err0 } ) );
      res.end();
    }else{
      if( typeof body0 == 'string' ){
        body0 = JSON.parse( body0 );
      }
      res.write( JSON.stringify( { status: true, images: body0 } ) );
      res.end();
    }
  });
});

app.get( '/get', function( req, res ){
  var id = null;
  if( req.query.id ){
    id = req.query.id;
  }

  if( id ){
    var option = {
      url: settings.api_url + 'get?id=' + id,
      method: 'GET',
      encoding: null, //. 'binary'
      headers: {
        "Content-type": "image/png"
      }
    };
    request( option, ( err0, res0, body0 ) => {
      if( err0 ){
        res.contentType( 'application/json; charset=utf-8' );
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: err0 } ) );
        res.end();
      }else{
        if( res0 && res0.headers && res0.headers["content-type"] ){
          res.contentType( res0.headers["content-type"] );
        }else{
          res.contentType( 'image/png' );
        }
        res.write( body0, 'binary' );
        res.end();
      }
    });
  }else{
    res.contentType( 'application/json; charset=utf-8' );
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter id required.' } ) );
    res.end();
  }
});


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
