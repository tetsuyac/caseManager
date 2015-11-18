(function () {
  var caseFilter = function () {
    return function (cases, filterValue) {
      if (!filterValue) return cases;
      var matches = [];
      filterValue = filterValue.toLowerCase();
      for (var i = 0; i < cases.length; i++) {
        var acase = cases[i];
        if (acase.case.toLowerCase().indexOf(filterValue) > -1) {
          matches.push(acase);
        }
      }
      return matches;
    };
  };
  angular.module('casesApp').filter('caseFilter', caseFilter);
}());