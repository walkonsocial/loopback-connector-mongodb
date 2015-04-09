var DataSource = require('loopback-datasource-juggler').DataSource;
var connector = require('../..');
var memwatch = require('memwatch');

var db = new DataSource(connector, {
  host: '127.0.0.1',
  port: '27017',
  database: 'strongloop'
});
var Todo = db.define('Todo', {
  content: {type: String}
});

var start = new Date();
function getMsFromStart() {
  return new Date() - start;
}
setInterval(function() {
  Todo.create({content: 'Buy eggs'});
}, 10);

// report heap usage periodically
setInterval(function() {
  console.log('> time:', getMsFromStart() + 'ms', process.memoryUsage());
}, 1000);

// stop when a leak is detected
memwatch.on('leak', function(data) {
  console.log('> leak:', data);
  Todo.destroyAll();
  process.exit();
});

process.on('SIGINT', function() {
  Todo.destroyAll();
  process.exit();
});
