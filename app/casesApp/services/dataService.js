(function () {
  var injectParams = ['config', 'casesService', 'casesBreezeService'];
  var dataService = function (config, casesService, casesBreezeService) {
    return (config.useBreeze) ? casesBreezeService : casesService;
  };
  dataService.$inject = injectParams;
  angular.module('casesApp').factory('dataService', dataService);
}());

