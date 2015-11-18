var express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  errorhandler = require('errorhandler'),
  csrf = require('csurf'),
  routes = require('./routes'),
  api = require('./routes/api'),
  DB = require('./accessDB'),
  protectJSON = require('./lib/protectJSON'),
  app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({
  secret:            'casemanagerstandard',
  saveUninitialized: true,
  resave:            true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));
app.use(errorhandler());
app.use(protectJSON);
app.use(csrf());
app.use(function (req, res, next) {
  var csrf = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrf);
  res.locals._csrf = csrf;
  next();
})
process.on('uncaughtException', function (err) {
  if (err) console.log(err, err.stack);
});

var conn = DB.dbConn();
var db = new DB.startup(conn);

app.get('/', routes.index);

var baseUrl = '/api/dataservice/';
app.get(baseUrl + 'Cases', api.cases);
app.get(baseUrl + 'Case/:id', api.case);
app.get(baseUrl + 'CasesSummary', api.casesSummary);
app.get(baseUrl + 'CaseById/:id', api.case);
app.post(baseUrl + 'PostCase', api.addCase);
app.put(baseUrl + 'PutCase/:id', api.editCase);
app.delete(baseUrl + 'DeleteCase/:id', api.deleteCase);
app.get(baseUrl + 'States', api.states);
app.get(baseUrl + 'CheckUnique/:id', api.checkUnique);
app.post(baseUrl + 'Login', api.login);
app.post(baseUrl + 'Logout', api.logout);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

//app.listen(3000, function () {
//  console.log("CustMgr Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});