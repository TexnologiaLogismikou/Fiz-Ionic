angular.module('starter.services', [])

    .factory('UserInfo', function () {

        /**
         * Constructor, with class name
         */
        function UserInfo(username, fname, lname, email, birthday, town, photo, role) {
            // Public properties, assigned to the instance ('this')
            this.username = username;
            this.fname = fname;
            this.lname = lname;
            this.email = email;
            this.birthday = birthday;
            this.town = town;
            this.photo = photo;
            this.role = role;
        }

        /**
         * Public method, assigned to prototype
         */
        UserInfo.getFirstName = function () {
            return this.fname;
        };
        UserInfo.getLastName = function () {
            return this.lname;
        };
        UserInfo.getUserName = function () {
            return this.username;
        };
        UserInfo.getEmail = function () {
            return this.email;
        };
        UserInfo.getBirthday = function () {
            return this.birthday;
        };
        UserInfo.getTown = function () {
            return this.town;
        };
        UserInfo.getRole = function () {
            return this.role;
        };
        UserInfo.getPhoto = function () {
            return this.photo;
        };

        return UserInfo;
    })

    .service("ChatService", function ($q, $timeout) {

        var chatR = "", service = {}, listener = $q.defer(), socket = {
            client: null,
            stomp: null
        };

        service.RECONNECT_TIMEOUT = 30000;
        service.SOCKET_URL = "http://83.212.105.54:8080/chat";
        service.CHAT_TOPIC = "/topic/chat";
        service.CHAT_BROKER = "/app/chat";

        service.receive = function () {
            return listener.promise;
        };

        service.send = function (message, username, chatroom, latitude, longitude, ttl) {
            chatR = chatroom;
            socket.stomp.send(service.CHAT_BROKER, {}, JSON.stringify(
                {
                    'message': message,
                    'username': username,
                    'chatroom_name': chatroom,
                    'lat': latitude,
                    'lng': longitude,
                    'ttl': ttl
                }
            ));
        };

        var reconnect = function () {
            $timeout(function () {
                initialize();
            }, this.RECONNECT_TIMEOUT);
        };

        var getMessage = function (data) {
            var message = JSON.parse(data), out = {};
            out.message = message.message;
            out.username = message.username;
            out.time = new Date(message.date);
            out.chatroom = message.chatroom;
            out.response = message.response;
            if (chatR == message.chatroom) {
                out.self = true;
                chatR = "";
            }
            return out;
        };

        var startListener = function () {
            socket.stomp.subscribe(service.CHAT_TOPIC, function (data) {
                alert("subscribe");
                listener.notify(getMessage(data.body));
            });
        };

        var initialize = function () {
            alert("init1");
            socket.client = new SockJS(service.SOCKET_URL);
            socket.stomp = Stomp.over(socket.client);
            socket.stomp.connect({}, function () {
                alert("init2");
                socket.stomp.subscribe(service.CHAT_TOPIC, function (data) {
                    alert("subscribe");
                    listener.notify(getMessage(data.body));
                });
            });
            socket.stomp.onclose = reconnect;
        };

        initialize();
        return service;
    });