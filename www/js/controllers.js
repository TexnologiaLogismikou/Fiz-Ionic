angular.module('starter.controllers', ['cordovaGeolocationModule'])

    .controller('GeoCtrl', function ($scope, $state, $rootScope, cordovaGeolocationService) {

        var getCurrentPosition = function () {
            cordovaGeolocationService.getCurrentPosition(successHandler, errorHandler);
        };
        var successHandler = function (position) {

            $rootScope.position = position;
            $state.go('login');
        };

        var errorHandler = function (error) {
            alert("GPS is OFF or signal is too weak");
        };

        getCurrentPosition();
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
                    username: $scope.data.username,
                    password: $scope.data.password
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

    .controller('DashCtrl', function ($scope, $http) {
        $scope.message = "hello";

        function joinRoom() {
            var request = $http({
                method: "post",
                url: "http://83.212.105.54:8080/chatroom/findAvailableChatrooms",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    lng: "22",
                    lat: "40"
                }
            });

            request.success(function (data, res) {

                }
            );

            request.error(function (data, res) {
                    alert("Failed connecting to server!\n\n" + JSON.stringify(data));
                }
            );
        }

        function getRooms() {
            var request = $http({
                method: "post",
                url: "http://83.212.105.54:8080/chatroom/findAvailableChatrooms",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    lng: "22",
                    lat: "40"
                }
            });

            request.success(function (data, res) {
                    $scope.chatRooms = [];
                    alert(JSON.stringify(data)); //TODO
                    var chatRoom = {};

                    if (data.size == 0){
                        chatRoom.room = 'There are no available rooms in your area!';
                        $scope.chatRooms.put(chatroom);
                    }
                    else {
                        chatRoom.room = data.chatroom_1;
                        $scope.chatRooms.put(chatRoom);

                        switch(data.size) {
                            case 1:
                                chatRoom.room = data.chatroom_1;
                                $scope.chatRooms.put(chatRoom);
                                break;
                            case 2:
                                chatRoom.room = data.chatroom_1;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_1;
                                $scope.chatRooms.put(chatRoom);
                                break;
                            case 3:
                                chatRoom.room = data.chatroom_1;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_2;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_3;
                                $scope.chatRooms.put(chatRoom);
                                break;
                            case 4:
                                chatRoom.room = data.chatroom_1;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_2;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_3;
                                $scope.chatRooms.put(chatRoom);
                                chatRoom.room = data.chatroom_4;
                                $scope.chatRooms.put(chatRoom);
                                break;
                            default:
                        }

                    }
                }
            );
            request.error(function (data, res) {
                    alert("Failed connecting to server!\n\n" + JSON.stringify(data));
                }
            );
        }
        getRooms();
    })

    .controller("ChatCtrl", function($scope, $rootScope) {

        $scope.messages = [];
        $scope.message = {};
        $scope.max = 140;

        var stompClient = null;

        function connect() {
            var socket = new SockJS('http://83.212.105.54:8080/chat');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/chat', function (chat) {
                    showMessage(JSON.parse(chat.body).message, JSON.parse(chat.body).username, JSON.parse(chat.body).date, JSON.parse(chat.body).chatroom, JSON.parse(chat.body).response);
                });
            });
        }

        function disconnect() {
            if (stompClient != null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }

        function sendMessage() {
            var user = $rootScope.userinfo;
            var longitude = $rootScope.position.coords.longitude;
            var latitude = $rootScope.position.coords.latitude;
            var chatroom = 'first_testing_room';
            var ttl = '10';

            var message = $scope.message.value;
            message = message.trim();
            var lng = $rootScope.position.coords.longitude;
            var a = String(lng);

            if (/\S/.test(message)) {
                stompClient.send("/app/chat", {}, JSON.stringify(
                    {
                        'message': message,
                        'username': $rootScope.userinfo.username,
                        'chatroom_name': 'first_testing_room',
                        'lat': "40",
                        'lng': a,
                        'ttl': "10"
                    }));
            }
            $scope.message.value = "";

        }

        function showMessage(message1, user1, date1, chatroom1, response1) {
            var message = {};
            message.message = message1;
            message.username = user1;
            $scope.messages.push(message);
            $scope.$apply();
        }

        $scope.send = function() {
            sendMessage()
        };

        connect();

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
