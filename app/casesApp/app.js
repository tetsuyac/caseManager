(function () {
  var app = angular.module('casesApp', ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'breeze.angular'])
    .config(['$routeProvider', function ($routeProvider) {
      var viewBase = '/app/casesApp/views/';
      $routeProvider
        .when('/cases', {
          controller:   'CasesController',
          templateUrl:  viewBase + 'cases/cases.html',
          controllerAs: 'vm'
        })
        .when('/caseentries/:caseId', {
          controller:   'CaseOrdersController',
          templateUrl:  viewBase + 'cases/caseEntries.html',
          controllerAs: 'vm'
        })
        .when('/caseedit/:caseId', {
          controller:   'CaseEditController',
          templateUrl:  viewBase + 'cases/caseEdit.html',
          controllerAs: 'vm',
          secure:       true //This route requires an authenticated user
        })
        .when('/entries', {
          controller:   'OrdersController',
          templateUrl:  viewBase + 'entries/entries.html',
          controllerAs: 'vm'
        })
        .when('/about', {
          controller:   'AboutController',
          templateUrl:  viewBase + 'about.html',
          controllerAs: 'vm'
        })
        .when('/login/:redirect*?', {
          controller:   'LoginController',
          templateUrl:  viewBase + 'login.html',
          controllerAs: 'vm'
        })
        .otherwise({redirectTo: '/cases'});
    }])
    .run(['$rootScope', '$location', 'authService', function ($rootScope, $location, authService) {
      //Client-side security. Server-side framework MUST add it's
      //own security as well since client-based security is easily hacked
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next && next.$$route && next.$$route.secure) {
          if (!authService.user.isAuthenticated) {
            $rootScope.$evalAsync(function () {
              authService.redirectToLogin();
            });
          }
        }
      });
    }]);
}());

