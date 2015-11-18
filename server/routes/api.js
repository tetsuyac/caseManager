var db = require('../accessDB')
  , util = require('util');
// GET
exports.cases = function (req, res) {
  console.log('*** cases');
  var top = req.query.$top;
  var skip = req.query.$skip;
  db.getCases(skip, top, function (err, data) {
    res.setHeader('X-InlineCount', data.count);
    if (err) {
      console.log('*** cases err');
      res.json({
        cases: data.cases
      });
    } else {
      console.log('*** cases ok');
      res.json(data.cases);
    }
  });
};
exports.case = function (req, res) {
  console.log('*** case');
  db.getCase(req.params.id, function (err, acase) {
    if (err) {
      console.log('*** case err');
      res.json({
        case: acase
      });
    } else {
      console.log('*** case ok');
      res.json(acase);
    }
  });
};
exports.addCase = function (req, res) {
  console.log('*** addCase');
  db.getState(req.body.stateId, function (err, state) {
    if (err) {
      console.log('*** getState err');
      res.json({'status': false});
    } else {
      db.insertCase(req.body, state, function (err) {
        if (err) {
          console.log('*** addCase err');
          res.json(false);
        } else {
          console.log('*** addCase ok');
          res.json(req.body);
        }
      });
    }
  });
};
exports.editCase = function (req, res) {
  console.log('*** editCase');
  db.getState(req.body.stateId, function (err, state) {
    if (err) {
      console.log('*** getState err');
      res.json({'status': false});
    } else {
      db.editCase(req.params.id, req.body, state, function (err) {
        if (err) {
          console.log('*** editCase err' + util.inspect(err));
          res.json({'status': false});
        } else {
          console.log('*** editCase ok');
          res.json({'status': true});
        }
      });
    }
  });
};
exports.deleteCase = function (req, res) {
  console.log('*** deleteCase');
  db.deleteCase(req.params.id, function (err) {
    if (err) {
      console.log('*** deleteCase err');
      res.json({'status': false});
    } else {
      console.log('*** deleteCase ok');
      res.json({'status': true});
    }
  });
};
// GET
exports.states = function (req, res) {
  console.log('*** states');
  db.getStates(function (err, states) {
    if (err) {
      console.log('*** states err');
      res.json({
        states: states
      });
    } else {
      console.log('*** states ok');
      res.json(states);
    }
  });
};
exports.casesSummary = function (req, res) {
  console.log('*** casesSummary');
  var top = req.query.$top;
  var skip = req.query.$skip;
  db.getCasesSummary(skip, top, function (err, summary) {
    res.setHeader('X-InlineCount', summary.count);
    if (err) {
      console.log('*** casesSummary err');
      res.json({
        casesSummary: summary.casesSummary
      });
    } else {
      console.log('*** casesSummary ok');
      res.json(summary.casesSummary);
    }
  });
};
exports.checkUnique = function (req, res) {
  console.log('*** checkUnique');
  var id = req.params.id,
    value = req.query.value,
    property = req.query.property;
  db.checkUnique(id, property, value, function (err, opStatus) {
    if (err) {
      console.log('*** checkUnique err');
      res.json({
        'status': false
      });
    } else {
      console.log('*** checkUnique ok');
      res.json(opStatus);
    }
  });
};
exports.login = function (req, res) {
  console.log('*** login');
  var userLogin = req.body.userLogin;
  var userName = userLogin.userName;
  var password = userLogin.password;
  //Simulate login
  res.json({status: true});
};
exports.logout = function (req, res) {
  console.log('*** logout');
  //Simulate logout
  res.json({status: true});
};





