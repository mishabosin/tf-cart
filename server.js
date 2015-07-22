var http = require('http');
var static = require('node-static');

var Storage = require('./lib/storage');

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

function parseParams(url) {
  var parts = url.split('/');
  return {
    resource: parts[1],
    id: parts[2]
  }
}

function jsonResponse(res, responseData, code) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code || 200;
  res.end(JSON.stringify(responseData));
}

/**
 *
 * @param req
 * @param res
 * @param cb - callback takes 2 params: the parsed json object and a bool=true if an error occurred
 */
function onJsonRead(req, res, cb) {
  var item = '';
  req.on('data', function (chunk) {
    item += chunk;
  });
  req.on('end', function () {
    try {
      item = JSON.parse(item);
      cb(item, false);
    }
    catch (e) {
      res.statusCode = 400;
      responseData = {'message': 'Invalid JSON'};
      res.end(JSON.stringify(responseData));
      cb(null, true);
    }
  });
}

var fileServer = new static.Server('./public');

var server = http.createServer(function (req, res) {
  var urlParams = parseParams(req.url);

  if (urlParams.resource === 'items') {
    if (req.method === 'GET') {
      jsonResponse(res, storage.getItems());

    } else if (req.method === 'POST') {
      onJsonRead(req, res, function(item, isError) {
        if (isError) {
          return;
        }
        jsonResponse(res, storage.add(item.name), 201);
      });

    } else if (req.method === 'DELETE') {
      var deleted = storage.remove(urlParams.id);
      jsonResponse(res, deleted || null);

    } else if (req.method === 'PUT') {
      onJsonRead(req, res, function(item, isError) {
        if (isError) {
          return;
        }
        var updatedItem = storage.update(id, item);
        if (!updatedItem) {
          res.statusCode = 400;
          responseData = {'message': 'Invalid item index'};
          res.end(JSON.stringify(responseData));
          return;
        }
        jsonResponse(res, updatedItem);
      });
    }

  } else {
    fileServer.serve(req, res);
  }
});

server.listen(8080, function () {
  console.log('listening on localhost:8080');
});
