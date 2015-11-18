(function () {
  var injectParams = ['breeze', '$q', '$window'];
  var casesBreezeService = function (breeze, $q, $window) {
    var factory = {};
    var EntityQuery = breeze.EntityQuery;
    // configure to use the model library for Angular
    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
    // configure to use camelCase
    breeze.NamingConvention.camelCase.setAsDefault();
    // create entity Manager
    var serviceName = 'breeze/breezedataservice';
    var entityManager = new breeze.EntityManager(serviceName);
    factory.getCases = function (pageIndex, pageSize) {
      return getPagedResource('Cases', 'entries', pageIndex, pageSize);
    };
    factory.getCasesSummary = function (pageIndex, pageSize) {
      return getPagedResource('CasesSummary', '', pageIndex, pageSize);
    };
    factory.getStates = function () {
      return getAll('States');
    };
    factory.getCase = function (id) {
      var query = EntityQuery
        .from('Cases')
        .where('id', '==', id)
        .expand('entries, state');
      return executeQuery(query, true);
    };
    factory.checkUniqueValue = function (id, property, value) {
      var propertyPredicate = new breeze.Predicate(property, "==", value);
      var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;
      var query = EntityQuery.from('Cases').where(predicate).take(0).inlineCount();
      return query.using(entityManager).execute().then(function (data) {
        return (data && data.inlineCount == 0) ? true : false;
      });
    };
    factory.insertCase = function (acase) {
      return entityManager.saveChanges();
    };
    factory.newCase = function () {
      return getMetadata().then(function () {
        return entityManager.createEntity('Case', {firstName: '', lastName: ''});
      });
    };
    factory.deleteCase = function (id) {
      if (!id) {
        $window.alert('ID was null - cannot delete');
        return null;
      }
      var acase = entityManager.getEntityByKey('Case', id);
      /*  When the case is deleted the caseID is set to 0 for each order
       since no parent exists
       Detach entries since the case is being deleted and server
       is set to cascade deletes
       */
      if (acase) {
        var entries = acase.entries.slice(); //Create a copy of the live list
        entries.forEach(function (order) {
          entityManager.detachEntity(order);
        });
        acase.entityAspect.setDeleted();
      }
      else {
        //Really a CaseSummary so we're going to add a new Case
        //and mark it as deleted. That allows us to save some code and avoid having
        //a separate method to deal with the CaseSummary projection
        acase = entityManager.createEntity('Case', {id: id, gender: 'Male'}, breeze.EntityState.Deleted);
      }
      return entityManager.saveChanges();
    };
    factory.updateCase = function (acase) {
      return entityManager.saveChanges();
    };
    function executeQuery(query, takeFirst) {
      return query.using(entityManager).execute().then(querySuccess, queryError);
      function querySuccess(data, status, headers) {
        return takeFirst ? data.results[0] : data.results;
      }

      function queryError(error) {
        $window.alert(error.message);
      }
    }

    function getAll(entityName, expand) {
      var query = EntityQuery.from(entityName);
      if (expand) {
        query = query.expand(expand);
      }
      return executeQuery(query);
    }

    function getMetadata() {
      var store = entityManager.metadataStore;
      if (store.hasMetadataFor(serviceName)) { //Have metadata
        return $q.when(true);
      }
      else { //Get metadata
        return store.fetchMetadata(serviceName);
      }
    }

    function getPagedResource(entityName, expand, pageIndex, pageSize) {
      var query = EntityQuery
        .from(entityName)
        .skip(pageIndex * pageSize)
        .take(pageSize)
        .inlineCount(true);
      if (expand && expand != '') {
        query = query.expand(expand);
      }
      //Not calling the re-useable executeQuery() function here since we need to get to more details
      //and return a custom object
      return query.using(entityManager).execute().then(function (data) {
        return {
          totalRecords: parseInt(data.inlineCount),
          results:      data.results
        };
      }, function (error) {
        $window.alert('Error ' + error.message);
      });
    }

    var OrderCtor = function () {
    };

    function orderInit(order) {
      order.orderTotal = order.quantity * order.price;
    }

    var CaseCtor = function () {
    };

    function caseInit(acase) {
      acase.entriesTotal = entriesTotal(acase);
    }

    function entriesTotal(acase) {
      var total = 0;
      var entries = acase.entries;
      var count = entries.length;
      for (var i = 0; i < count; i++) {
        total += entries[i].orderTotal;
      }
      return total;
    };
    entityManager.metadataStore.registerEntityTypeCtor('Order', OrderCtor, orderInit);
    entityManager.metadataStore.registerEntityTypeCtor('Case', CaseCtor, caseInit);
    return factory;
  };
  casesBreezeService.$inject = injectParams;
  angular.module('casesApp')
    .factory('casesBreezeService', casesBreezeService);
}());