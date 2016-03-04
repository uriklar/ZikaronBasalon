//= require lib/utils
//= require config/constants

app.controller('ManagerShowController', ['$scope','$uibModal', '$http', '$location', function($scope, $uibModal, $http, $location) {
  $scope.hosts = [];
  $scope.search = {
    host: {},
    witness: {}
  };
  $scope.activeView = 'hosts';
  $scope.formatBool = formatBool;
  $scope.formatDate = formatDate;
  $scope.formatDateTime = formatDateTime;
  $scope.witnessTypes = witnessTypes;

  $scope.sortProp = 'created_at';

  $scope.init = function(hosts, witnesses, cities) {
    $scope.hosts = _.map(hosts, function(host) {
      host.has_survivor = !!host.witness;
      return host;
    });

    $scope.witnesses = witnesses;
    
    $scope.cities = _.map(
      _.uniqBy($scope.hosts, function(host) { return host.city.name }),
      function(host) { return host.city }
    );
  }

  $scope.editHost = function(host) {
    window.open('/hosts/' + host.id, '_blank');
  }

  $scope.editWitness = function(witness) {
    window.open('/witnesses/' + witness.id, '_blank');
  }

  $scope.filterHosts = function(hosts) {
    return _.filter(hosts, function(host) {

      if(activeFilter($scope.search.host.survivor_needed) &&
          $scope.search.host.survivor_needed !== host.survivor_needed) {
        return false;
      }

      if(activeFilter($scope.search.host.has_survivor) &&
          $scope.search.host.has_survivor !== host.has_survivor) {
        return false;
      }

      if(activeFilter($scope.search.host.contacted) &&
          $scope.search.host.contacted !== host.contacted) {
        return false;
      }

      if(activeFilter($scope.search.host.city_id) &&
         $scope.search.host.city_id !== host.city.id) {
        return false;
      }

      if ($scope.search.host.query) { 
        if (!_.includes(host.user.email, $scope.search.host.query) &&
            !_.includes(host.user.full_name, $scope.search.host.query) &&
            !_.includes(host.address, $scope.search.host.query) &&
            !_.includes(host.phone, $scope.search.host.query)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  $scope.sort = function(arr) {
    return _.sortBy(arr, $scope.sortProp);
  }

  $scope.filterWitnesses = function(witnesses) {
    return witnesses;
  }

  $scope.isAccesible = function(host) {
    return host.floor === 0 || host.elevator;
  }

  $scope.onViewToggle = function(view) {
    $scope.activeView = view;
  }

  $scope.setSortProp = function(prop) {
    $scope.sortProp = prop;
  }

  function activeFilter(filter) {
    return !_.isUndefined(filter) && !_.isNull(filter);
  }
}]);