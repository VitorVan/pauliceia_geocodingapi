/*  
+---------------------------------------------------+
|Var
+---------------------------------------------------+*/
	var express = require('express');
	var router = express.Router();
  var GeoJSON = require('geojson');
  var postgeo = require("postgeo");
  var js2xmlparser = require("js2xmlparser");
  var Search = require('../models/searchPoint');
  var webServiceAdress = "http://localhost:3000";
  const request = require('request');
  var yearExtra;
  var nameExtra;
  var geomExtra;
  var FYear;
  var LYear;

/*  
+---------------------------------------------------+
|Connection
+---------------------------------------------------+*/
	const pg = require('pg');
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:teste@localhost/db_pauliceia';
	const client = new pg.Client(connectionString);
	client.connect();

/*  
+---------------------------------------------------+
|getDateTime
+---------------------------------------------------+*/
function getDateTime() {
      var date = new Date();
      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;
      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;
      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;
      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;
      return  hour + ":" + min + ":" + sec+ " "+ day + "/" + month  + "/" + year;
  } 

/*  
+---------------------------------------------------+
|request
+---------------------------------------------------+*/
function getJsonUrl(url1) {
  request(url1, function (error, response, body) {
    if (!error) {
      var bodyjson = JSON.parse(body);
      console.log(bodyjson[2][0].geom);
      return bodyjson[2][0].geom
      } 
  });
} 

/*  
+---------------------------------------------------+
|processYear
+---------------------------------------------------+*/
function processName(name)
{
    nameExtra = name;
    console.log(nameExtra);
}

/*  
+---------------------------------------------------+
|processFYear
+---------------------------------------------------+*/
function processFYear(fy)
{
    FYear= fy;
    console.log(FYear);
}

/*  
+---------------------------------------------------+
|processLYear
+---------------------------------------------------+*/
function processLYear(ly)
{
    LYear= ly;
    console.log(LYear);
}


/*  
+---------------------------------------------------+
|processName
+---------------------------------------------------+*/
function processYear(year)
{
    yearExtra = year;
    console.log(yearExtra);
}

/*  
+---------------------------------------------------+
|processGeom
+---------------------------------------------------+*/
function processGeom(geom)
{
    geomExtra = geom;
    console.log(geomExtra);
}

/*  
+---------------------------------------------------+
|function JsonEmpty
+---------------------------------------------------+*/

// This should work in node.js and other ES5 compliant implementations.
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// This should work both there and elsewhere.
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

/*  
+---------------------------------------------------+
|Urls
+---------------------------------------------------+*/

/*  
+---------------------------------------------------+
|HomePage - Index of Pages
+---------------------------------------------------+*/
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Documentação do Desenvolvedor Pauliceia 2.0' });

});

/*  
+---------------------------------------------------+
|getAllStreets - GeoJson
+---------------------------------------------------+*/
router.get('/api/street/all/geojson', (req, res, next) => {

const results = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street order by id ASC;');

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = GeoJSON.parse(results, {'MultiLineString': 'geom'});
      //console.log(results2);

      return res.json(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getAllStreets - Json
+---------------------------------------------------+*/
router.get('/api/street/all/json', (req, res, next) => {

const results = [];
const head = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street order by id ASC;');
    
    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      
      head.push(results);

      return res.json(head);
    });
  });
});

/*  
+---------------------------------------------------+
|getAllStreets - Xml
+---------------------------------------------------+*/
router.get('/api/street/all/xml', (req, res, next) => {

const results = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street order by id ASC;');

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      
      const results2 = js2xmlparser.parse("data", results);
      
      return res.end(results2);
    });
  });
});


/*  
+---------------------------------------------------+
|getAllPlaces - GeoJson
+---------------------------------------------------+*/
router.get('/api/places/all/geojson', (req, res, next) => {

const results = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_places order by id ASC;');

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = GeoJSON.parse(results, {'Point': 'geom'});
      //console.log(results2);

      return res.json(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getAllPlaces - Json
+---------------------------------------------------+*/
router.get('/api/places/all/json', (req, res, next) => {

const results = [];
const head = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_places order by id ASC;');
    
    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      head.push(results);
      
      return res.json(head);
    });
  });
});

/*  
+---------------------------------------------------+
|getAllPlaces - Xml
+---------------------------------------------------+*/
router.get('/api/places/all/xml', (req, res, next) => {

const results = [];
const head = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_places order by id ASC;');
    
    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      
      const results2 = js2xmlparser.parse("data", results);
      
      //console.log(results2);
      
      return res.end(results2);

    });
  });
});

/*  
+---------------------------------------------------+
|getSingleStreet - Json
+---------------------------------------------------+*/
router.get('/api/street/:street_id/json', (req, res, next) => {

  const results = [];
  const head = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street where id=($1)',[id]);
    //const query = client.query('select * from tb_street where id=($1)', id);

    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      //const results2 = GeoJSON.parse(results, {'MultiLineString': 'geom'});
      //console.log(results2);

      head.push(results);

      return res.json(head);
    });
  });
});

/*  
+---------------------------------------------------+
|getSingleStreet - GeoJson
+---------------------------------------------------+*/
router.get('/api/street/:street_id/geojson', (req, res, next) => {

  const results = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street where id=($1)',[id]);
    //const query = client.query('select * from tb_street where id=($1)', id);

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = GeoJSON.parse(results, {'MultiLineString': 'geom'});
      //console.log(results2);

      return res.json(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getSingleStreet - Xml
+---------------------------------------------------+*/
router.get('/api/street/:street_id/xml', (req, res, next) => {

  const results = [];
  const head = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select *, st_astext(geom) as geom from tb_street where id=($1)',[id]);

    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = js2xmlparser.parse("data", results);
      
      //console.log(results2);
      
      return res.end(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getSinglePlace - Json
+---------------------------------------------------+*/
router.get('/api/places/:street_id/json', (req, res, next) => {
  
  const results = [];
  const head = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select id, id_street, st_x(st_astext(geom)) as lat, st_y(st_astext(geom)) as lng, number, name, first_day, first_month, first_year, last_day, last_month, last_year, description, source from tb_places where number=($1)',[id]);
    //const query = client.query('select * from tb_street where id=($1)', id);

    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      head.push(results);      

      return res.json(head);
    });
  });
});

/*  
+---------------------------------------------------+
|getSinglePlace- GeoJson
+---------------------------------------------------+*/
router.get('/api/places/:street_id/geojson', (req, res, next) => {
  
  const results = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select id, id_street, st_astext(geom) as geom, number, name, first_day, first_month, first_year, last_day, last_month, last_year, description, source from tb_places where number=($1)',[id]);
    //const query = client.query('select * from tb_street where id=($1)', id);

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = GeoJSON.parse(results, {'Point': 'geom'});

      return res.json(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getSinglePlace - Xml
+---------------------------------------------------+*/
router.get('/api/places/:street_id/xml', (req, res, next) => {
  
  const results = [];
  const head = [];
  const id = req.params.street_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select id, id_street, st_x(st_astext(geom)) as lat, st_y(st_astext(geom)) as lng, number, name, first_day, first_month, first_year, last_day, last_month, last_year, description, source from tb_places where number=($1)',[id]);

    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      const results2 = js2xmlparser.parse("data", results);

      //console.log(results2);

      return res.end(results2);
    });
  });
});

/*  
+---------------------------------------------------+
|getList - Json
+---------------------------------------------------+*/
router.get('/api/listQuickSearch', (req, res, next) => {
  const results = [];
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query("select b.name, a.number, a.first_year as year from tb_street as b join tb_places as a on a.id_street = b.id where a.first_year >= 1 and a.last_year >= 1 order by number;");

    query.on('row', (row) => {
      results.push(row.name +', '+ row.number+', '+ row.year);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

    return res.json(results);

   });
  });
});

/*
+---------------------------------------------------+
|geolocation-Json
+---------------------------------------------------+*/
router.get('/api/geolocation/:textpoint,:number,:year/json', (req, res, next) => {
  
  const results = [];
  const head = [];
  const textpoint = req.params.textpoint;
  const year = req.params.year.replace(" ", "");;
  const number = req.params.number.replace(" ", "");
  const total = [];
  var url = "";
  
  if (!number || !textpoint || !year || number == null || textpoint == null || year == null /*|| typeof number === 'number' ||  typeof year === 'number' */){
    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");
    results.push({alert: ""});
    head.push(results);
    return res.json(head);
  }
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // SQL Query > Select Data
    const query = client.query("SELECT tb_places.name, ST_ASTEXT(tb_places.geom) AS geom FROM tb_places JOIN tb_street ON tb_places.id_street = tb_street.id WHERE tb_places.number = ($3) AND tb_street.name LIKE ($1) AND tb_places.first_year <= ($2) AND tb_places.last_year >= ($2)",['%'+textpoint+'%', year, number]);

    // Stream results back one row at a time
    head.push("created_at: " + getDateTime());
    head.push("type: 'GET'");

    query.on('row', (row) => {
      results.push(row);
    });
  
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

            if (isEmptyObject(results)) {
                //if it's empty

                pg.connect(connectionString, (err, client, done) => {
                  // Handle connection errors
                  if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({success: false, data: err});
                  }

                  const query = client.query("SELECT geometry , nf, nl, ($3) AS num FROM (SELECT (SELECT ST_AsText(ST_Line_SubString(street, startfraction, endfraction)) as geometry FROM(SELECT(SELECT St_AsText(a.geom) FROM tb_street AS a WHERE a.name LIKE ($1)) AS street,(SELECT ST_LineLocatePoint(line, point) FROM(SELECT(SELECT St_AsText(ST_LineMerge(a.geom)) AS street FROM tb_street AS a WHERE a.name LIKE ($1)) AS line,	(SELECT(SELECT ST_AsText(ST_ClosestPoint(line, pt)) FROM (SELECT (SELECT st_astext(a.geom) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE a.number = (SELECT MIN(number) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE b.name LIKE ($1) AND a.number > ($3) AND a.first_year >= ($2) AND a.last_year >= ($2) LIMIT 1) AND b.name LIKE ($1)  ) As pt, (SELECT ST_AsText(geom) FROM tb_street WHERE name LIKE ($1)) As line) As foo)) AS point)AS foo) AS startfraction,(SELECT ST_LineLocatePoint(line, point) FROM (SELECT(SELECT St_AsText(ST_LineMerge(a.geom)) AS street FROM tb_street AS a WHERE a.name LIKE ($1)) AS line,	(SELECT (SELECT ST_AsText(ST_ClosestPoint(line, pt)) FROM (SELECT (SELECT st_astext(a.geom) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE a.number = (SELECT MAX(number) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE b.name LIKE ($1) AND a.number < ($3) AND a.first_year >= ($2) AND a.last_year >= ($2) LIMIT 1) AND b.name LIKE ($1)  ) As pt, (SELECT ST_AsText(geom) FROM tb_street WHERE name LIKE ($1)  ) As line) As foo)) AS point) AS foo) AS endfraction) AS foo) AS geometry, (SELECT number_max FROM (SELECT (SELECT MIN(number) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE b.name LIKE ($1) AND a.number > ($3) AND a.first_year >= ($2) AND a.last_year >= ($2) LIMIT 1) as number_max) AS foo) As nf, (SELECT number_min FROM (SELECT (SELECT MAX(number) FROM tb_places AS a JOIN tb_street AS b ON a.id_street = b.id WHERE b.name LIKE ($1) AND a.number < ($3) AND a.first_year >= ($2) AND a.last_year >= ($2) LIMIT 1) as number_min) AS foo) AS nl) As foo;",['%'+textpoint+'%', year, number]);
                  query.on('row', (row) => {
                    if (!row.geometry || !row.nf || !row.num || !row.nl) {
/*
                      if (row.num < row.nf){

                        const query2 = client.query("select name, first_year, ST_AsText(geom) from tb_places where id_street = (select id from tb_street where name like $1) and number = $2",['%'+textpoint+'%', row.nf]);
                        query2.on('row', (row) => {
                          processName(row.name);
                          processYear(row.first_year);
                          processGeom(row.st_astext);
                        });
                      
                      const ads1 = textpoint+", "+row.nf+", "+yearExtra;
                      results.push({Address: ads1, name: nameExtra, geom: geomExtra});
                        processName("");
                        processYear("");
                        processGeom("");
                      } 

                      if (row.num < row.nf){

                        const query3 = client.query("select name, first_year, ST_AsText(geom) from tb_places where id_street = (select id from tb_street where name like $1) and number = $2",['%'+textpoint+'%', row.nl]);
                        query3.on('row', (row) => {
                          processName(row.name);
                          processYear(row.first_year);
                          processGeom(row.st_astext);
                        });
                        
                        const ads2 = textpoint+", "+row.nl+", "+yearExtra;
                        results.push({Address:  ads2, name: nameExtra, geom: geomExtra});
                          processName("");
                          processYear("");
                          processGeom("");
                      } */
                      results.push({alert: "Point not found", msg:{alertMsg: "System did not find " + textpoint+", "+number+", "+year, help: "Make sure the search is spelled correctly. (street, number, year)"}});
                    } else {
                      results.push({name: "Point Geolocated", geom: ("POINT("+Search.getPoint(row.geometry, row.nl, row.nf, row.num).point)+")"});
                    }

                  });
                  query.on('end', () => {
                    done(); 
                    head.push(results);
                    return res.json(head);
                    });
                });
            } else {
             
              head.push(results);
              return res.json(head);
            }
      });
  }); 
});


/*
+---------------------------------------------------+
|multiplegeolocation-Json
+---------------------------------------------------+*/
router.get('/api/multiplegeolocation/:jsonquery/json', (req, res, next) => {
  
  const results = [];
  var jsonObject = JSON.parse(req.params.jsonquery);
  const sizeJson = Object.keys(jsonObject).length;
  var urlList = [];
  var textList = [];
  var k = 0;
  const head = [];
  
  var content = "";
  for(index in jsonObject)
      for(product in jsonObject[index])
          content = (Object.keys(jsonObject[index]));

  for ( var j = 0; j < sizeJson ; j++ ) {
    url = webServiceAdress + '/api/geolocation/' + jsonObject[j][content] +"/json"
    urlList.push(url);
    textList.push(jsonObject[j][content]);
  }

  for (i in urlList) {
    request(urlList[i], function (error, response, body) {
      if (!error) {
        var bodyjson = JSON.parse(body);
        results.push({adress: textList[k], geom:  bodyjson[2][0].geom, url: urlList[k] });
        //console.log({adress: textList[k], geom:  bodyjson[2][0].geom, url: urlList[k] });
       k=k+1;

       if (k >= urlList.length){
        
        // Stream results back one row at a time
        head.push("created_at: " + getDateTime());
        head.push("type: 'GET'");
      
        head.push(results);
        return res.json(head);

      }

     } 
      });  
  }  
});

/*  
+---------------------------------------------------+
|consoleLog
+---------------------------------------------------+*/
console.log('Listening on port 3000.');
module.exports = router;