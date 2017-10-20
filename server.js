#!/usr/bin/env node

var _ = require('lodash');
var cors = require('cors');
var express = require('express');
var http = require('http');
var https = require('https');
var pg = require('pg');

var config = {
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

// Get numbers as numbers
var types = require('pg').types;
types.setTypeParser(20, function(val) {
  return parseInt(val, 10);
});

var app = express();

app.use(cors());

function pgError(error) {
  console.log("PG error", error);
}

app.get('/search', function (req, res) {
  var name = req.query.name;
  var ein = req.query.ein;
  var entries;

  if ((ein && name) ||
      (!ein && !name)) {
    res.status(500).send('Please send an ein or name parameter, but not both.');
  }

  // TODO: Handle more than 100 results
  //

  if (name) {
    entries = pool.query('SELECT * FROM ( SELECT * FROM xml_index, plainto_tsquery(($1)) AS q  WHERE (tsv @@ q)) AS t1 ORDER BY ts_rank_cd(t1.tsv, plainto_tsquery(($1))) DESC LIMIT 100;',
      [name])
    .then(function(data) {
      var rows = _.map(data.rows, function(row) {
        row.url = 'https://s3.amazonaws.com/irs-form-990/' + row.OBJECT_ID + '_public.xml';
        return row;
      });
      res.send(rows);
    })
    .catch(pgError);
  }

  if (ein) {
    entries = pool.query('SELECT * FROM xml_index where "EIN"=($1);',
      [ein])
    .then(function(data) {
      if (data.rows.length) {
        var rows = _.map(data.rows, function(row) {
          row.url = 'https://s3.amazonaws.com/irs-form-990/' + row.OBJECT_ID + '_public.xml';
          return row;
        });
        res.send(rows);
        return;
      }
      res.status(404).send('EIN not found ' + ein);
    })
    .catch(pgError);
  }

});

var host = process.env.HOST || undefined;

http.createServer(app).listen(process.env.PORT, host, function() {
  console.log('990 app listening on port ' + process.env.PORT);
});

/*
if (process.env.CERT_PATH) {
  console.log("Starting HTTPS server");
  https.createServer({
    cert: fs.readFileSync(process.env.CERT_PATH),
    key: fs.readFileSync(process.env.KEY_PATH)
  }, app).listen(process.env.SSLPORT, host, function() {
    console.log('990 app listening on port ' + process.env.SSLPORT);
  });
}
*/
