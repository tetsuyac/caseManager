(function () {
  var nameProductFilter = function () {
    function matchesProduct(acase, filterValue) {
      if (acase.entries) {
        for (var i = 0; i < acase.entries.length; i++) {
          if (acase.entries[i].product.toLowerCase().indexOf(filterValue) > -1) {
            return true;
          }
        }
      }
      return false;
    }

    return function (cases, filterValue) {
      if (!filterValue || !cases) return cases;
      var matches = [];
      filterValue = filterValue.toLowerCase();
      for (var i = 0; i < cases.length; i++) {
        var cust = cases[i];
        if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
          cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
          matchesProduct(cust, filterValue)) {
          matches.push(cust);
        }
      }
      return matches;
    };
  };
  angular.module('casesApp').filter('nameProductFilter', nameProductFilter);
}());