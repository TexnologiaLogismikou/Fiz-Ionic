angular.module('starter.controllers', [])
    .controller('LoginCtrl', function ($scope, auth, $state, store) {
        function doAuth() {
            auth.signin({
                closable: false,
                // This asks for the refresh token
                // So that the user never has to log in again
                authParams: {
                    scope: 'openid offline_access'
                }
            }, function (profile, idToken, accessToken, state, refreshToken) {
                store.set('profile', profile);
                store.set('token', idToken);
                store.set('refreshToken', refreshToken);
                $state.go('tab.dash');
            }, function (error) {
                console.log("There was an error logging in", error);
            });
        }

        $scope.$on('$ionic.reconnectScope', function () {
            doAuth();
        });

        doAuth();


    })

    .controller('DashCtrl', function ($scope, $http) {
        $scope.callApi = function () {
            // Just call the API as you'd do using $http
            $http({
                url: 'http://83.212.105.54:8080/ping',
                method: 'GET'
            }).then(function (data) {
                alert("success" + " - " + JSON.stringify(data));
            }, function (data) {
                alert(JSON.stringify(data));
            });
        };

    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('TestCtrl', function ($scope, auth, store, $http) {

        // I hold the data-dump of the FORM scope from the server-side.
        $scope.test = "test";
        $scope.test1 = "test1";

        $scope.posting = function () {
            var request = $http({
                method: "post",
                url: "http://83.212.105.54:8080/secured/test",
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username: "Andreas",
                    password: "Drouf"
                }
            });
            request.success(function (data,res) {
                    $scope.test = "succes " + data + " - " + res;
                    $scope.test1 = "SParse: " + JSON.stringify(data);
                }
            );
            request.error(function (data,res) {
                    $scope.test = "fail " + data + " - " + res;
                    alert(JSON.stringify(data));
                    $scope.test1 = "FParse: " + JSON.stringify(data);
                }
            );
        };
    })

    .controller('AccountCtrl', function ($scope, auth, store, $state) {
        $scope.email = store.get('profile').email;
        $scope.username = store.get('profile').nickname;
        $scope.picture = store.get('profile').picture;
        $scope.created_at = new Date(store.get('profile').created_at);
        $scope.Token = store.get('token');
        $scope.refreshToken = store.get('refreshToken');

            $scope.logout = function () {
            auth.signout();
            store.remove('token');
            store.remove('profile');
            store.remove('refreshToken');
            $state.go('login', {}, {reload: true});
        };
    });
