(function () {
  var injectParams = ['$location', '$filter', '$window',
    '$timeout', 'authService', 'dataService', 'modalService'];
  var CasesController = function ($location, $filter, $window,
                                  $timeout, authService, dataService, modalService) {
    var vm = this;
    vm.cases              = [];
    vm.filteredCases      = [];
    vm.filteredCount      = 0;
    vm.orderby            = 'lastName';
    vm.reverse            = false;
    vm.searchText         = null;
    vm.cardAnimationClass = '.card-animation';
    //paging
    vm.totalRecords = 0;
    vm.pageSize     = 10;
    vm.currentPage  = 1;
    vm.pageChanged = function (page) {
      vm.currentPage = page;
      getCasesSummary();
    };
    vm.deleteCase = function (id) {
      if (!authService.user.isAuthenticated) {
        $location.path(authService.loginPath + $location.$$path);
        return;
      }
      var cust     = getCaseById(id);
      var custName = cust.firstName + ' ' + cust.lastName;
      var modalOptions = {
        closeButtonText:  'Cancel',
        actionButtonText: 'Delete Case',
        headerText:       'Delete ' + custName + '?',
        bodyText:         'Are you sure you want to delete this case?'
      };
      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          dataService.deleteCase(id).then(function () {
            for (var i = 0; i < vm.cases.length; i++) {
              if (vm.cases[i].id === id) {
                vm.cases.splice(i, 1);
                break;
              }
            }
            filterCases(vm.searchText);
          }, function (error) {
            $window.alert('Error deleting case: ' + error.message);
          });
        }
      });
    };
    vm.DisplayModeEnum = {
      Card: 0,
      List: 1
    };
    vm.changeDisplayMode = function (displayMode) {
      switch (displayMode) {
      case vm.DisplayModeEnum.Card:
        vm.listDisplayModeEnabled = false;
        break;
      case vm.DisplayModeEnum.List:
        vm.listDisplayModeEnabled = true;
        break;
      }
    };
    vm.navigate = function (url) {
      $location.path(url);
    };
    vm.setOrder = function (orderby) {
      if (orderby === vm.orderby) {
        vm.reverse = !vm.reverse;
      }
      vm.orderby = orderby;
    };
    vm.searchTextChanged = function () {
      filterCases(vm.searchText);
    };
    function init() {
      //createWatches();
      getCasesSummary();
    }

    //function createWatches() {
    //    //Watch searchText value and pass it and the cases to caseFilter
    //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
    //    //while also accessing the filtered count via vm.filteredCount above
    //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
    //    vm.$watch("searchText", function (filterText) {
    //        filterCases(filterText);
    //    });
    //}
    function getCasesSummary() {
      dataService.getCasesSummary(vm.currentPage - 1, vm.pageSize)
        .then(function (data) {
          vm.totalRecords = data.totalRecords;
          vm.cases        = data.results;
          filterCases(''); //Trigger initial filter
          $timeout(function () {
            vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
          }, 1000);
        }, function (error) {
          $window.alert('Sorry, an error occurred: ' + error.data.message);
        });
    }

    function filterCases(filterText) {
      vm.filteredCases = $filter("caseFilter")(vm.cases, filterText);
      vm.filteredCount = vm.filteredCases.length;
    }

    function getCaseById(id) {
      for (var i = 0; i < vm.cases.length; i++) {
        var cust = vm.cases[i];
        if (cust.id === id) {
          return cust;
        }
      }
      return null;
    }

    init();
  };
  CasesController.$inject = injectParams;
  angular.module('casesApp').controller('CasesController', CasesController);
}());
