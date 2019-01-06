app.controller('HotelDemoCtrl', function ($uibModal, $scope, $http) {

    $scope.page_size = "6".toString();
    $scope.page_size_ticket = "4".toString();
    $scope.page = 1;
    $scope.no_more = false;
    
    $scope.get_hotels = function (start, limit) {
        if (start == 0) {
            $scope.page = 1;
        }
        $http.get("../hotels?limit=" + limit + "&start=" + start)
            .then(function (response) {
                if (response.data.length < $scope.page_size) {
                    $scope.no_more = true;
                } else {
                    $scope.no_more = false;
                }
                $scope.hotels = response.data;
            });
    };
    $scope.get_hotels(0, $scope.page_size);

    $scope.get_tickets = function (start, limit) {
        if (start == 0) {
            $scope.page = 1;
        }
        $http.get("../tickets?limit=" + limit + "&start=" + start)
            .then(function (response) {
                if (response.data.length < $scope.page_size_ticket) {
                    $scope.no_more = true;
                } else {
                    $scope.no_more = false;
                }
                $scope.tickets = response.data;
            });
    };
    $scope.get_tickets(0, $scope.page_size_ticket);

    $scope.next = function () {
        $scope.page += 1;
        $scope.get_hotels(($scope.page - 1) * $scope.page_size, $scope.page_size);
        $scope.get_tickets(($scope.page - 1) * $scope.page_size_ticket, $scope.page_size_ticket);
    }

    $scope.previous = function () {
        $scope.page -= 1;
        $scope.get_hotels(($scope.page - 1) * $scope.page_size, $scope.page_size);
        $scope.get_tickets(($scope.page - 1) * $scope.page_size_ticket, $scope.page_size_ticket);
    }

    $scope.openModal = function (hotel) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ModalContent.html',
            controller: 'ModalICtrl',
            resolve: {
                hotel: function () {
                    return hotel;
                }
            }
        });

        modalInstance.result.then(function () {

        }, function () {

        });
    };

    $scope.openTicketModal = function (ticket) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'ModalContent.html',
            controller: 'ModalTicketCtrl',
            resolve: {
                ticket: function () {
                    return ticket;
                }
            }
        });

        modalInstance.result.then(function () {

        }, function () {

        });
    };    
});