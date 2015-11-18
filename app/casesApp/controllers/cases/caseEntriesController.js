(function () {
  var injectParams = ['$scope', '$routeParams', '$window', 'dataService'];
  var CaseOrdersController = function ($scope, $routeParams, $window, dataService) {
    var vm = this,
      caseId = ($routeParams.caseId) ? parseInt($routeParams.caseId) : 0;
    vm.case = {};
    vm.entriesTotal = 0.00;
    init();
    function init() {
      if (caseId > 0) {
        dataService.getCase(caseId)
          .then(function (acase) {
            vm.case = acase;
            $scope.$broadcast('case', acase);
          }, function (error) {
            $window.alert("Sorry, an error occurred: " + error.message);
          });
      }
    }
  };
  CaseOrdersController.$inject = injectParams;
  angular.module('casesApp').controller('CaseOrdersController', CaseOrdersController);
}());