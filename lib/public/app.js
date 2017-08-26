
"use strict";

// consts

	const BASEAPI = "/api/v1/";
	const BASEAPILANG = BASEAPI + "fr/";

angular.module("Warcraft3SoundsApp", []).controller("MainController", [
	"$scope", "$http", ($scope, $http) => {

	// public

		// attributes

			// race
			$scope.races = [];
			$scope.racesError = "";
			$scope.racesLoading = false;

	// load data

		$scope.racesLoading = true;
		$http({
			"method": "GET",
			"url": BASEAPILANG + "races"
		}).then((response) => {

			$scope.races = response.data;
			$scope.racesError = "";
			$scope.racesLoading = false;

		}).catch((err) => {

			$scope.racesError = err.message ? err.message : err;
			$scope.racesLoading = false;

		});

	}

]).controller("RaceController", [
	"$scope", "$http", ($scope, $http) => {

	// private

		// attributes

			let sound = null;

		// methods

			/**
			* Stop reading sound
			* @returns {void}
			*/
			function _stopSound () {

				if (sound) {
					sound[0].pause(); sound[0].currentTime = 0;
					sound[0].src = "";
					sound.remove(); sound = null;
				}

			}

			/**
			* Start reading sound
			* @param {string} url : Sound's url
			* @returns {void}
			*/
			function _startSound (url) {

				sound = jQuery(
					"<audio>" +
						"<source src=\"" + url + "\" type=\"audio/" + (-1 < url.indexOf(".mp3") ? "mp3" : "wav") + "\">" +
						"Your browser does not support the audio element." +
					"</audio>"
				);

				sound[0].play();

			}

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

			$scope.playMusic = () => {

				_stopSound();
				_startSound($scope.music.url);

			};

			$scope.playWarning = () => {

				_stopSound();
				_startSound($scope.warning.url);

			};

			$scope.loadActions = () => {

				$scope.actionsLoading = true;
				$http({
					"method": "GET",
					"url": $scope.character.url
				}).then((response) => {

					$scope.actions = response.data.actions;

					$scope.actionsError = "";
					$scope.actionsLoading = false;

				}).catch((err) => {

					$scope.actionsError = err.message ? err.message : err;
					$scope.actionsLoading = false;

				});

			};

			$scope.playAction = () => {

				_stopSound();
				_startSound($scope.action.url);

			};

	// load data

		$scope.raceLoading = true;
		$http({
			"method": "GET",
			"url": $scope.race.url
		}).then((response) => {

			$scope.race.characters = response.data.characters;
			$scope.race.musics = response.data.musics;
			$scope.race.warnings = response.data.warnings;

			$scope.raceError = "";
			$scope.raceLoading = false;

		}).catch((err) => {

			$scope.raceError = err.message ? err.message : err;
			$scope.raceLoading = false;

		});

	}

]).controller("IPsControllers", [
	"$scope", "$http", ($scope, $http) => {

	// public

		// attributes

			// data
			$scope.ips = [];

			// loading
			$scope.ipsError = "";
			$scope.ipsLoading = false;

	// load data

		$scope.ipsLoading = true;
		$http({
			"method": "GET",
			"url": BASEAPI + "ips"
		}).then((response) => {

			$scope.ips = response.data;

			$scope.ipsError = "";
			$scope.ipsLoading = false;

		}).catch((err) => {

			$scope.ipsError = err.message ? err.message : err;
			$scope.ipsLoading = false;

		});

	}

]);
