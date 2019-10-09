var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({
  connectionLimit: 1,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  debug: false
});

router.get('/', function (req, res, next) {
  pool.query('SELECT * FROM todos', function (error, results, fields) {
    //if (error) throw error;

    var users = [];
    results.forEach(element => {
      users.push(element.username);
    });

    var uniqueUsers = users.filter((item, index) => {
      return users.indexOf(item) === index;
    });

    res.render('index', {
      results: results,
      users: uniqueUsers
    });
  });
})

router.get('/:username', function (req, res, next) {
  var username = req.params.username;

  //short for pool.getconnection > .query > .release
  pool.query('SELECT * FROM todos WHERE username = ?', [username], function (error, results, fields) {
    //if (error) throw error;

    res.render('user', {
      results: results
    });
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
      res.redirect('/');
    });
  });
})

/*Adds new Todo */
router.post('/send', function (req, res) {
  var newtodo = req.body.newtodo;
  var username = req.body.username;

  pool.query('INSERT INTO todos(username, todo, complete) VALUES(?, ?, 0)', [username, newtodo], function (error, results, fields) {
    console.log(results);
    res.redirect('/');
  });
})

/* Delete todo by id*/
router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;

  pool.query('DELETE FROM todos WHERE id = ?', [id], function (error, results, fields) {
    res.redirect('/');
  });
})

module.exports = router;
