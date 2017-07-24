
"use strict";

angular.module('Warcraft3SoundsApp', []).controller('RacesController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	// public

		// attributes

			// race
			$scope.races = [];
			$scope.racesError = "";
			$scope.racesLoading = false;

	// load data

		$scope.racesLoading = true;
		$http({
			method: 'GET',
			url: '/api/v1/fr/races'
		}).then(function(response) {

			$scope.races = response.data;
			$scope.racesError = "";
			$scope.racesLoading = false;

		}).catch(function (err) {

			$scope.racesError = (err.message) ? err.message : err;
			$scope.racesLoading = false;

		});

}]).controller('RaceController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	// public

		// attributes

			// data
			$scope.actions = [];

			// selected
			$scope.music = null;
			$scope.warning = null;
			$scope.character = null;
			$scope.action = null;

			// loading
			$scope.raceError = "";
			$scope.raceLoading = false;

			$scope.actionsError = "";
			$scope.actionsLoading = false;

		// methods

			$scope.playMusic = function() {

				console.log($scope.race);
				console.log($scope.music);

			};

			$scope.playWarning = function() {

				console.log($scope.race);
				console.log($scope.music);

			};

			$scope.loadActions = function() {

				$scope.actionsLoading = true;
				$http({
					method: 'GET',
					url: $scope.character.url
				}).then(function(response) {

					console.log(response);

					$scope.actions = response.data.actions;

					$scope.actionsError = "";
					$scope.actionsLoading = false;

				}).catch(function(err) {

					$scope.actionsError = (err.message) ? err.message : err;
					$scope.actionsLoading = false;

				});

			};

	// load data

		$scope.raceLoading = true;
		$http({
			method: 'GET',
			url: $scope.race.url
		}).then(function(response) {

			$scope.race.characters = response.data.characters;
			$scope.race.musics = response.data.musics;
			$scope.race.warnings = response.data.warnings;

			$scope.raceError = "";
			$scope.raceLoading = false;

		}).catch(function(err) {

			$scope.raceError = (err.message) ? err.message : err;
			$scope.raceLoading = false;

		});

}]);
