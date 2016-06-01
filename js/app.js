//Modules
var footScores = angular.module('footScores', ['ngRoute', 'ngResource', 'ngAnimate']);

//Routes
footScores.config(function($routeProvider, $httpProvider){
  $httpProvider.defaults.headers.get = {'X-Auth-Token' : '31984ab29e694c9cadfc59f781f58348'}

  $routeProvider
  .when('/',{
    templateUrl: 'pages/main.htm',
    controller: 'mainController',
    controllerAs: 'main'
  })
  .when('/league/:leagueName/:uniqId',{
    templateUrl: 'pages/league.htm',
    controller: 'leagueController',
    controllerAs: 'league'
  })
  .when('/team',{
    templateUrl: 'pages/team.htm',
    controller: 'teamController',
    controllerAs: 'team'
  })
  .when('/match',{
    templateUrl: 'pages/match.htm',
    controller: 'matchController',
    controllerAs: 'match'
  })
});

//Services
footScores.service('footService', function($resource,$q){
  var fs = this;

  //Main Page
  fs.getLeagues = function(){
    var resObj = $resource('http://api.football-data.org/v1/soccerseasons');
    var rsp = resObj.query();
    var deferred = $q.defer();
    rsp.$promise.then(function(data){
      console.log(data);
      var len = data.length;
      for(i=0;i<len;i++){
        objLeague = data[i];
        objLeague.caption = objLeague.caption.match(/^\d?\.?\s?(.*)\s[0-9\/]*$/)[1];
      }
      deferred.resolve(data);
    },function(err){
      deffered.reject(err);
    });
    return deferred.promise;
  }

  //League Page
  fs.getFixtures = function (myid){
    var resObj = $resource('http://api.football-data.org/v1/soccerseasons/:id/fixtures');
    var rsp = resObj.get({id:myid});
    var deferred = $q.defer();
    rsp.$promise.then(function(data){
      console.log(data);
      var len = data.fixtures.length;
      console.log(len);
      data.fixtures = data.fixtures.reverse();
      for(i=0;i<len;i++){
        objFixtures = data.fixtures[i];
        // console.log(objFixtures.homeTeamName);
        // console.log(objFixtures.awayTeamName);
      }
      deferred.resolve(data);
    },function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  }

  fs.getTable = function (myid){
    var resObj = $resource('http://api.football-data.org/v1/soccerseasons/:id/leagueTable');
    var rsp =  resObj.get({id:myid});
    var deferred = $q.defer();
    rsp.$promise.then(function(data){
      console.log(data);
      var len = data.standing.length;
      console.log(len);
      for(i=0;i<len;i++){
        objTable = data.standing[i];
        // console.log(objTable.teamName);
      }
      deferred.resolve(data);
    },function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  }

  //Team Page
  fs.Api = '';

  //Match Page

});

//Controllers
footScores.controller('mainController', ['$scope', '$resource', 'footService', function($scope, $resource, footService){
  var main = this;

  var leagueRsp = footService.getLeagues();
  leagueRsp.then(function(data){
    // Got data
    main.getData = data;
  },function(){
    //No Data
    console.log('Error while fetching league information');
  });
  // console.log(main.getData);
}]);

footScores.controller('leagueController', ['$scope', '$resource', '$routeParams', 'footService', function($scope, $resource, $routeParams, footService){
  var league = this;
  league.leagueName = $routeParams.leagueName.toUpperCase();

  var fixturesRsp = footService.getFixtures($routeParams.uniqId);
  fixturesRsp.then(function(data){
    // Got data
    league.getFixturesData = data;
  },function(){
    //No Data
    console.log('Error while fetching league information');
  });

  var tableRsp = footService.getTable($routeParams.uniqId);
  tableRsp.then(function(data){
    // Got data
    league.getTableData = data;
  },function(){
    //No Data
    console.log('Error while fetching league information');
  });

  //function to get api for teams
  league.getApi = function(api){
    console.log("api");
    footService.Api = api;
  }

}]);

footScores.controller('teamController', ['$scope', '$resource', '$routeParams', 'footService', function($scope, $resource, $routeParams, footService){
  var team = this;

  team.Api = footService.Api;
  console.log(team.Api);

  team.getTeamData = $resource(team.Api).get();
  console.log(team.getTeamData);
  // team.getTeamData = footService.getTeams(team.Api);

  team.getTeamSquad = $resource(team.Api + '/players').get();
  console.log(team.getTeamSquad);
  team.getTeamFixtures = $resource(team.Api + '/fixtures').get();
  console.log(team.getTeamFixtures);
}]);

footScores.controller('matchController', ['$scope', '$resource', function($scope, $resource){

}]);
