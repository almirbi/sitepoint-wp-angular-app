'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('PostsCtrl', function ($http, $scope, $cookies, $httpParamSerializerJQLike) {
      $scope.title = '';
      $scope.content = '';
      $scope.id = '';

      $scope.updatePost = function() {

          $http({
              url: "http://sitepoint.local/wp-json/wp/v2/posts/" + $scope.id + "/?access_token=" + $cookies.get('wordpress_access_token'),
              method: "POST",
              headers: {
                  "content-type": "application/x-www-form-urlencoded"
              },
              data: $httpParamSerializerJQLike({
                  title: $scope.title,
                  content: $scope.content
              })
          }).then(function successCallback(response) {
              console.log(response);

              for (var i = 0; i < $scope.posts.length; i++) {
                  if ($scope.posts[i].id == $scope.id) {
                      $scope.posts[i] = response.data;
                  }
              }
          }, function errorCallback(response) {
              console.log(response);
          });
      };

      $scope.editPost = function(id) {
          document.getElementById('editPost').style.display = 'block';
          $scope.title = '';
          $scope.content = '';
          $scope.id = id;
          for (var i = 0; i < $scope.posts.length; i++) {
              if ($scope.posts[i].id == id) {
                  $scope.title = $scope.posts[i].title.rendered;
                  $scope.content = $scope.posts[i].content.rendered;
              }
          }
      };


      $http({
          method: 'GET',
          url: 'http://sitepoint.local/wp-json/wp/v2/posts'
      }).then(function successCallback(response) {
          console.log(response.data);
          $scope.posts = response.data;
      }, function errorCallback(response) {
          console.log(response);
      });

      $http({
          method: 'GET',
          url: 'http://sitepoint.local/wp-json/wp/v2/users/me/?context=edit&access_token=' + $cookies.get('wordpress_access_token')
      }).then(function successCallback(response) {
          var user = response.data;

          $http({
              method: 'GET',
              url: 'http://sitepoint.local/wp-json/wp/v2/users/' + user.id + '/?context=edit&access_token=' + $cookies.get('wordpress_access_token')
          }).then(function successCallback(response) {
              console.log(response.data);
              $scope.user = response.data;
          }, function errorCallback(response) {
              console.log(response);
          });
          $scope.user = response.data;
      }, function errorCallback(response) {
          console.log(response);
      });
  });
