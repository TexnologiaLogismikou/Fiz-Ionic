angular.module('starter.controllers', ['cordovaGeolocationModule'])

    .controller('GeoCtrl', function ($scope, $state, $rootScope, cordovaGeolocationService) {

        $scope.getCurrentPosition = function () {
            cordovaGeolocationService.getCurrentPosition(successHandler, errorHandler);
        };
        var successHandler = function (position) {

            $rootScope.position = position;
            $state.go('login');
        };

        var errorHandler = function (error) {
            alert("GPS is OFF or signal is too weak");
        };
    })

    .controller('LoginCtrl', function ($scope, $http, $state, UserInfo, $rootScope) {

        $scope.login = function () {
            var request = $http({
                method: "post",
                url: "http://83.212.105.54:8080/login",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: "milenaAz",
                    password: "milena"
                }
            });
            request.success(function (data, res) {
                    var username, fname, lname, email, birthday, town, photo, role;
                    username = data.username;
                    fname = data.fname;
                    lname = data.lname;
                    email = data.email;
                    birthday = data.username;
                    town = data.town;
                    photo = data.photo;
                    role = data.role;

                    $rootScope.userinfo = new UserInfo(username, fname, lname, email, birthday, town, photo, role);

                    $state.go('tab.dash');
                }
            );
            request.error(function (data, res) {
                    alert("Wrong username or password");
                }
            );
        };
    })

    .controller('DashCtrl', function ($scope) {
        $scope.message = "hello";
    })

    .controller("ChatCtrl", function($scope, $rootScope, $timeout) {

        $scope.messages = [];
        $scope.message = {};
        $scope.max = 140;

        var user = $rootScope.userinfo;
        var longitude = $rootScope.position.coords.longitude;
        var latitude = $rootScope.position.coords.latitude;
        var chatroom = "first_testing_room";
        var ttl = '10';

        var socket = {
            client: null,
            stomp: null
        };

        var RECONNECT_TIMEOUT = 30000;
        var SOCKET_URL = "http://83.212.105.54:8080/chat";
        var CHAT_TOPIC = "/topic/chat";
        var CHAT_BROKER = "/app/chat";

        $scope.send = function() {
            var message = $scope.messages.value, username = 'milenaAz';

            socket.stomp.send(CHAT_BROKER, {}, JSON.stringify(
                {
                    'message' : message,
                    'username' : username,
                    'chatroom_name' : chatroom,
                    'lat' : '42',
                    'lng' : '22',
                    'ttl' : '20'
                }
            ));
            $scope.message.value = "";
        };

        var reconnect = function() {
            $timeout(function() {
                initialize();
            }, RECONNECT_TIMEOUT);
        };


        $scope.initialize = function() {
            alert("init");
            socket.client = new SockJS(SOCKET_URL);
            socket.stomp = Stomp.over(socket.client);
            socket.stomp.connect({}, function(){
                socket.stomp.subscribe(CHAT_TOPIC, function(data) {
                    var message = JSON.parse(data.body);
                    alert(JSON.stringify(message));
                    $scope.messages.push(message);
                });
            });
            socket.stomp.onclose = reconnect;
        };




        //
        //$scope.addMessage = function() {
        //    ChatService.send($scope.message.value, 'milenaAz', chatroom, '40', '22', ttl);
        //    $scope.message.value = "";
        //    var a = ChatService.receive();
        //    alert(JSON.stringify(a));
        //
        //};

        //ChatService.receive().then(null, null, function(message) {
        //    alert(JSON.stringify(message));
        //    $scope.messages.push(message);
        //});

    })

    .controller('TestCtrl', function ($scope) {

        // I hold the data-dump of the FORM scope from the server-side.
        $scope.test = "test";
        $scope.test1 = "test1";
    })

    .controller('AccountCtrl', function ($scope, $state, $location) {
        //$scope.email = store.get('profile').email;
        //$scope.username = store.get('profile').nickname;
        //$scope.picture = store.get('profile').picture;
        //$scope.created_at = new Date(store.get('profile').created_at);
        //$scope.Token = store.get('token');
        //$scope.refreshToken = store.get('refreshToken');

        $scope.logout = function () {
            //auth.signout();
            //store.remove('token');
            //store.remove('profile');
            //store.remove('refreshToken');
            $state.go('login', {}, {reload: true});
            //$location.path('/login').replace();
        };
    });
