var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  debug: false
});


/* Get all. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  //res.sendFile('index.html');

  //query DB for todos and send to dom as json
  pool.query('SELECT * FROM todos', function (error, results, fields) {
    //if (error) throw error;

    res.render('index', {

      results: results

    });
  });
});

/* Get all for user */
router.get('/:username', function (req, res, next) {
  var username = req.params.username;
  // console.log(username);
  // res.send(username);

  pool.query('SELECT * FROM todos WHERE username = ?', [username], function (error, results, fields) {
    //if (error) throw error;
    // ...
    console.log(results);
    res.send(results);
    //res.render('index');
  });
})

/* Mark todo complete by id */
router.get('/complete/:id', function (req, res, next) {
  var id = req.params.id;

  pool.query('UPDATE todos SET complete = 1 WHERE id = ?', [id], function (error, results, fields) {
    //if (error) throw error;
    // ...
    //console.log(results);
    //res.send(results);
    res.redirect('/');
  });
})

/* Toggle todo complete */
router.get('/toggle/:id', function (req, res, next) {
  var id = req.params.id;
  var newComplete;

  pool.query('SELECT * FROM todos WHERE id = ?', [id], function (error, results, fields) {
    if (results[0].complete) {
      newComplete = 0;
    } else newComplete = 1;

    pool.query('UPDATE todos SET complete = ? WHERE id = ?', [newComplete, id], function (error, results, fields) {
      //res.send(results);
      // res.render('index', { 
      //   // user: results[0].username,
      //   // todo: results[0].todo
      //   //keys: keys,
      //   results: results
      // });
      res.redirect('/');
    });
  });
})

/* Add todo */
router.get('/new/:username/:todo', function (req, res, next) {

  var username = req.params.username;
  var todo = req.params.todo;

  pool.query('INSERT INTO todos(username,todo, complete) VALUES(?, ?, 0)', [username, todo], function (error, results, fields) {
    console.log(results);
    res.send(results);
  });
})

/* Delete todo by id*/
router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;

  pool.query('DELETE FROM todos WHERE id = ?', [id], function (error, results, fields) {
    res.redirect('/');
  });
})

router.post('/send', function (req, res) {
  var newtodo = req.body.newtodo;
  var username = req.body.username;

  pool.query('INSERT INTO todos(username, todo, complete) VALUES(?, ?, 0)', [username, newtodo], function (error, results, fields) {
    console.log(results);
    res.redirect('/');
  });
})

module.exports = router;
