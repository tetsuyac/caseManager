(function () {
  var injectParams = ['$http', '$q'];
  var casesFactory = function ($http, $q) {
    var serviceBase = '/api/dataservice/',
      factory = {};
    factory.getCases = function (pageIndex, pageSize) {
      return getPagedResource('cases', pageIndex, pageSize);
    };
    factory.getCasesSummary = function (pageIndex, pageSize) {
      return getPagedResource('casesSummary', pageIndex, pageSize);
    };
    factory.getStates = function () {
      return $http.get(serviceBase + 'states').then(
        function (results) {
          return results.data;
        });
    };
    factory.checkUniqueValue = function (id, property, value) {
      if (!id) id = 0;
      return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
        function (results) {
          return results.data.status;
        });
    };
    factory.insertCase = function (acase) {
      return $http.post(serviceBase + 'postCase', acase).then(function (results) {
        acase.id = results.data.id;
        return results.data;
      });
    };
    factory.newCase = function () {
      return $q.when({id: 0});
    };
    factory.updateCase = function (acase) {
      return $http.put(serviceBase + 'putCase/' + acase.id, acase).then(function (status) {
        return status.data;
      });
    };
    factory.deleteCase = function (id) {
      return $http.delete(serviceBase + 'deleteCase/' + id).then(function (status) {
        return status.data;
      });
    };
    factory.getCase = function (id) {
      //then does not unwrap data so must go through .data property
      //success unwraps data automatically (no need to call .data property)
      return $http.get(serviceBase + 'caseById/' + id).then(function (results) {
        extendCases([results.data]);
        return results.data;
      });
    };
    function extendCases(cases) {
      var custsLen = cases.length;
      //Iterate through cases
      for (var i = 0; i < custsLen; i++) {
        var cust = cases[i];
        if (!cust.entries) continue;
        var entriesLen = cust.entries.length;
        for (var j = 0; j < entriesLen; j++) {
          var order = cust.entries[j];
          order.orderTotal = order.quantity * order.price;
        }
        cust.entriesTotal = entriesTotal(cust);
      }
    }

    function getPagedResource(baseResource, pageIndex, pageSize) {
      var resource = baseResource;
      resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
      return $http.get(serviceBase + resource).then(function (response) {
        var custs = response.data;
        extendCases(custs);
        return {
          totalRecords: parseInt(response.headers('X-InlineCount')),
          results:      custs
        };
      });
    }

    function buildPagingUri(pageIndex, pageSize) {
      var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
      return uri;
    }

    // is this still used???
    function orderTotal(order) {
      return order.quantity * order.price;
    };
    function entriesTotal(acase) {
      var total = 0;
      var entries = acase.entries;
      var count = entries.length;
      for (var i = 0; i < count; i++) {
        total += entries[i].orderTotal;
      }
      return total;
    };
    return factory;
  };
  casesFactory.$inject = injectParams;
  angular.module('casesApp').factory('casesService', casesFactory);
}());