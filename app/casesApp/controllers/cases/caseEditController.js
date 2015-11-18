(function () {
  var injectParams = ['$scope', '$location', '$routeParams', '$timeout', 'config', 'dataService', 'modalService'];
  var CaseEditController = function ($scope, $location, $routeParams, $timeout, config, dataService, modalService) {
    var vm = this,
      caseId = ($routeParams.caseId) ? parseInt($routeParams.caseId) : 0,
      timer,
      onRouteChangeOff;
    vm.case = {};
    vm.states = [];
    vm.title = (caseId > 0) ? 'Edit' : 'Add';
    vm.buttonText = (caseId > 0) ? 'Update' : 'Add';
    vm.updateStatus = false;
    vm.errorMessage = '';
    vm.isStateSelected = function (caseStateId, stateId) {
      return caseStateId === stateId;
    };
    vm.saveCase = function () {
      if ($scope.editForm.$valid) {
        if (!vm.case.id) {
          dataService.insertCase(vm.case).then(processSuccess, processError);
        }
        else {
          dataService.updateCase(vm.case).then(processSuccess, processError);
        }
      }
    };
    vm.deleteCase = function () {
      var custName = vm.case.firstName + ' ' + vm.case.lastName;
      var modalOptions = {
        closeButtonText:  'Cancel',
        actionButtonText: 'Delete Case',
        headerText:       'Delete ' + custName + '?',
        bodyText:         'Are you sure you want to delete this case?'
      };
      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          dataService.deleteCase(vm.case.id).then(function () {
            onRouteChangeOff(); //Stop listening for location changes
            $location.path('/cases');
          }, processError);
        }
      });
    };
    function init() {
      getStates().then(function () {
        if (caseId > 0) {
          dataService.getCase(caseId).then(function (acase) {
            vm.case = acase;
          }, processError);
        } else {
          dataService.newCase().then(function (acase) {
            vm.case = acase;
          });
        }
      });
      //Make sure they're warned if they made a change but didn't save it
      //Call to $on returns a "deregistration" function that can be called to
      //remove the listener (see routeChange() for an example of using it)
      onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
    }

    init();
    function routeChange(event, newUrl, oldUrl) {
      //Navigate to newUrl if the form isn't dirty
      if (!vm.editForm || !vm.editForm.$dirty) return;
      var modalOptions = {
        closeButtonText:  'Cancel',
        actionButtonText: 'Ignore Changes',
        headerText:       'Unsaved Changes',
        bodyText:         'You have unsaved changes. Leave the page?'
      };
      modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
          onRouteChangeOff(); //Stop listening for location changes
          $location.path($location.url(newUrl).hash()); //Go to page they're interested in
        }
      });
      //prevent navigation by default since we'll handle it
      //once the user selects a dialog option
      event.preventDefault();
      return;
    }

    function getStates() {
      return dataService.getStates().then(function (states) {
        vm.states = states;
      }, processError);
    }

    function processSuccess() {
      $scope.editForm.$dirty = false;
      vm.updateStatus = true;
      vm.title = 'Edit';
      vm.buttonText = 'Update';
      startTimer();
    }

    function processError(error) {
      vm.errorMessage = error.message;
      startTimer();
    }

    function startTimer() {
      timer = $timeout(function () {
        $timeout.cancel(timer);
        vm.errorMessage = '';
        vm.updateStatus = false;
      }, 3000);
    }
  };
  CaseEditController.$inject = injectParams;
  angular.module('casesApp').controller('CaseEditController', CaseEditController);
}());