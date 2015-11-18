(function () {
  var injectParams = ['$scope'];
  var OrderChildController = function ($scope) {
    var vm = this;
    vm.orderby = 'product';
    vm.reverse = false;
    vm.entriesTotal = 0.00;
    vm.case;
    init();
    vm.setOrder = function (orderby) {
      if (orderby === vm.orderby) {
        vm.reverse = !vm.reverse;
      }
      vm.orderby = orderby;
    };
    function init() {
      if ($scope.case) {
        vm.case = $scope.case;
        updateTotal($scope.case);
      }
      else {
        $scope.$on('case', function (event, acase) {
          vm.case = acase;
          updateTotal(acase);
        });
      }
    }

    function updateTotal(acase) {
      var total = 0.00;
      for (var i = 0; i < acase.entries.length; i++) {
        var order = acase.entries[i];
        total += order.orderTotal;
      }
      vm.entriesTotal = total;
    }
  };
  OrderChildController.$inject = injectParams;
  angular.module('casesApp').controller('OrderChildController', OrderChildController);
}());