// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Case = require('./models/case')
  , State = require('./models/state')
  , util = require('util');
// connect to database
module.exports = {
  // Define class variable
  myEventID: null,
  // initialize DB
  startup: function (dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function () {
      console.log('We have connected to mongodb');
    });
  },
  // disconnect from database
  closeDB: function () {
    mongoose.disconnect();
  },
  // get all the cases
  getCases: function (skip, top, callback) {
    console.log('*** accessDB.getCases');
    Case.count(function (err, custsCount) {
      var count = custsCount;
      console.log('Cases count: ' + count);
      Case.find({}, {
        '_id':        0,
        'case':       1,
        'firstName':  1,
        'lastName':   1,
        'city':       1,
        'state':      1,
        'stateId':    1,
        'entries':    1,
        'orderCount': 1,
        'gender':     1,
        'id':         1
      })
        /*
         //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
         function (err, cases) {
         console.log('Cases count: ' + cases.length);
         count = cases.length;
         })*/
        .skip(skip)
        .limit(top)
        .exec(function (err, cases) {
          callback(null, {
            count:     count,
            cases: cases
          });
        });
    });
  },
  // get the case summary
  getCasesSummary: function (skip, top, callback) {
    console.log('*** accessDB.getCasesSummary');
    Case.count(function (err, custsCount) {
      var count = custsCount;
      console.log('Cases count: ' + count);
      Case.find({}, {
        '_id':        0,
        'case':       1,
        'firstName':  1,
        'lastName':   1,
        'city':       1,
        'state':      1,
        'orderCount': 1,
        'gender':     1,
        'id':         1
      })
        /*
         //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
         function (err, casesSummary) {
         console.log('Cases Summary count: ' + casesSummary.length);
         count = casesSummary.length;
         })
         */
        .skip(skip)
        .limit(top)
        .exec(function (err, casesSummary) {
          callback(null, {
            count:            count,
            casesSummary: casesSummary
          });
        });
    });
  },
  // get a  case
  getCase: function (id, callback) {
    console.log('*** accessDB.getCase');
    Case.find({'id': id}, {}, function (err, acase) {
      callback(null, acase[0]);
    });
  },
  // insert a  case
  insertCase: function (req_body, state, callback) {
    console.log('*** accessDB.insertCase');
    var acase = new Case();
    var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}
    acase.case = req_body.case;
    acase.firstName = req_body.firstName;
    acase.lastName = req_body.lastName;
    acase.email = req_body.email;
    acase.address = req_body.address;
    acase.city = req_body.city;
    acase.state = s;
    acase.stateId = state[0].id;
    acase.zip = req_body.zip;
    acase.gender = req_body.gender;
    acase.id = 1; // The id is calculated by the Mongoose pre 'save'.
    acase.save(function (err, acase) {
      if (err) {
        console.log('*** new case save err: ' + err);
        return callback(err);
      }
      callback(null, acase.id);
    });
  },
  editCase: function (id, req_body, state, callback) {
    console.log('*** accessDB.editCase');
    var s = {'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name}
    Case.findOne({'id': id}, {
      '_id':       1,
      'case':      1,
      'firstName': 1,
      'lastName':  1,
      'city':      1,
      'state':     1,
      'stateId':   1,
      'gender':    1,
      'id':        1
    }, function (err, acase) {
      if (err) {
        return callback(err);
      }
      acase.case = req_body.case || acase.case;
      acase.firstName = req_body.firstName || acase.firstName;
      acase.lastName = req_body.lastName || acase.lastName;
      acase.email = req_body.email || acase.email;
      acase.address = req_body.address || acase.address;
      acase.city = req_body.city || acase.city;
      acase.state = s;
      acase.stateId = s.id;
      acase.zip = req_body.zip || acase.zip;
      acase.gender = req_body.gender || acase.gender;
      acase.save(function (err) {
        if (err) {
          console.log('*** accessDB.editCase err: ' + err);
          return callback(err);
        }
        callback(null);
      });
    });
  },
  // delete a case
  deleteCase: function (id, callback) {
    console.log('*** accessDB.deleteCase');
    Case.remove({'id': id}, function (err, acase) {
      callback(null);
    });
  },
  // get a  case's email
  checkUnique: function (id, property, value, callback) {
    console.log('*** accessDB.checkUnique');
    console.log(id + ' ' + value)
    switch (property) {
    case 'email':
      Case.findOne({'email': value, 'id': {$ne: id}})
        .select('email')
        .exec(function (err, acase) {
          console.log(acase)
          var status = (acase) ? false : true;
          callback(null, {status: status});
        });
      break;
    }
  },
  // get all the states
  getStates: function (callback) {
    console.log('*** accessDB.getStates');
    State.find({}, {}, {sort: {name: 1}}, function (err, states) {
      callback(null, states);
    });
  },
  // get a state
  getState: function (stateId, callback) {
    console.log('*** accessDB.getState');
    State.find({'id': stateId}, {}, function (err, state) {
      callback(null, state);
    });
  }
}
