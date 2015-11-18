(function () {
  var injectParams = ['$filter', '$window', 'dataService'];
  var OrdersController = function ($filter, $window, dataService) {
    var vm = this;
    vm.cases = [];
    vm.filteredCases;
    vm.filteredCount;
    //paging
    vm.totalRecords = 0;
    vm.pageSize = 10;
    vm.currentPage = 1;
    init();
    vm.pageChanged = function (page) {
      vm.currentPage = page;
      getCases();
    };
    vm.searchTextChanged = function () {
      filterCasesProducts(vm.searchText);
    };
    function init() {
      //createWatches();
      getCases();
    }

    //function createWatches() {
    //    //Watch searchText value and pass it and the cases to caseFilter
    //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
    //    //while also accessing the filtered count via vm.filteredCount above
    //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
    //    $scope.$watch("searchText", function (filterText) {
    //        filterCasesProducts(filterText);
    //    });
    //}
    function filterCasesProducts(filterText) {
      vm.filteredCases = $filter("nameProductFilter")(vm.cases, filterText);
      vm.filteredCount = vm.filteredCases.length;
    }

    function getCases() {
      dataService.getCases(vm.currentPage - 1, vm.pageSize)
        .then(function (data) {
          vm.totalRecords = data.totalRecords;
          vm.cases = data.results;
          filterCasesProducts('');
        }, function (error) {
          $window.alert(error.message);
        });
    }
  };
  OrdersController.$inject = injectParams;
  angular.module('casesApp').controller('OrdersController', OrdersController);
}());



