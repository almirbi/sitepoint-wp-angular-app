// app/scripts/controllers/posts.js

angular.module('publicApp')
    .controller('PostsCtrl', function ($http, $scope, $cookies, $httpParamSerializerJQLike) {
        var apiUrl = 'http://sitepoint-wp-rest-api.test/wp-json/wp/v2';

        $scope.post = {
            title: '',
            content: ''
        }

        // Retrieve user permissions
        // First get the current user id
        $http({
            method: 'GET',
            url: apiUrl + '/users/me/?access_token=' + $cookies.get('wordpress_access_token')
        }).then(function successCallback(response) {

            // second API call to get more details about the current user, e.g. capabilities
            $http({
                method: 'GET',
                url: apiUrl + '/users/' + response.data.id + '/?context=edit&access_token=' + $cookies.get('wordpress_access_token')
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

        // Retrieve all posts
        $http({
            method: 'GET',
            url: apiUrl + '/posts'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.posts = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });

        // Edit post button
        $scope.editPost = function(id) {
            document.getElementById('editPost').style.display = 'block';
            $scope.post.title = '';
            $scope.post.content = '';
            $scope.post.id = id;
            for (var i = 0; i < $scope.posts.length; i++) {
                if ($scope.posts[i].id === id) {
                    $scope.post.title = $scope.posts[i].title.rendered;
                    $scope.post.content = $scope.posts[i].content.rendered;
                }
            }
        };

        // Update post
        $scope.updatePost = function() {
            $http({
                url: apiUrl + '/posts/' + $scope.post.id + '/?context=edit&access_token=' + $cookies.get('wordpress_access_token'),
                method: "POST",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike({
                    title: $scope.post.title,
                    content: $scope.post.content
                })
            }).then(function successCallback(response) {
                console.log(response);

                for (var i = 0; i < $scope.posts.length; i++) {
                    if ($scope.posts[i].id == $scope.post.id) {
                        $scope.posts[i] = response.data;
                    }
                }

                document.getElementById('editPost').style.display = 'none';
                document.getElementById('responseMessage').innerHTML = 'Succesfuly updated post.' + $scope.post.id;

            }, function errorCallback(response) {
                console.log(response);
            });
        };
    });