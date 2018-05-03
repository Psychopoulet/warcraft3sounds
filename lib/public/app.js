
"use strict";

// consts

	const BASEAPI = "/api/";

// private

	// attributes

		let _sound = null;

// module

angular.module("Warcraft3SoundsApp", []).controller("MainController", [
	"$scope", "$http", ($scope, $http) => {

	// public

		// attributes

			$scope.notWorded = false;

			// race
			$scope.races = [];
			$scope.racesError = "";
			$scope.racesLoading = false;

	// load data

		$scope.racesLoading = true;
		$http({
			"method": "GET",
			"url": BASEAPI + "races"
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

			$scope.play = (url) => {

				if (_sound) {

					if (_sound[0]) {

						_sound[0].pause();
						_sound[0].currentTime = 0;
						_sound[0].src = "";

					}

					_sound.remove();
					_sound = null;

				}

				_sound = jQuery(
					"<audio>" +
						"<source src=\"" + url + "\" type=\"audio/" + (-1 < url.indexOf(".mp3") ? "mp3" : "wav") + "\">" +
						"Your browser does not support the audio element." +
					"</audio>"
				);

				_sound[0].play();

			};

			$scope.loadActions = () => {

				$scope.actionsLoading = true;
				$http({
					"method": "GET",
					"url": $scope.character.url + (jQuery("#notworded").prop("checked") ? "?notworded=true" : "")
				}).then((response) => {

					$scope.actions = response.data.actions;

					$scope.actionsError = "";
					$scope.actionsLoading = false;

				}).catch((err) => {

					$scope.actionsError = err.message ? err.message : err;
					$scope.actionsLoading = false;

				});

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
