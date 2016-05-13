'use strict';

/**
 * @ngdoc overview
 * @name wwwApp
 * @description
 * # wwwApp
 *
 * Main module of the application.
 */
angular
    .module('publicApp', [
        'ngRoute',
        'ngCookies'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/posts.html',
                controller: 'PostsCtrl',
                controllerAs: 'posts'
            })
            .otherwise({
                redirectTo: '/'
            });
    });