var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngTouch']);

app.config(function ($routeProvider) {
  $routeProvider.
    when("/home", {
      templateUrl: "../pages/home.html"
    }).
    when("/hotels", {
      templateUrl: "../pages/hotels.html",
    }).
    when("/lift", {
      templateUrl: "../pages/lift.html"
    }).
    when("/about", {
      templateUrl: "../pages/about.html"
    }).
    when("/contact", {
      templateUrl: "../pages/contact.html"
    }).
    when("/loginTicket", {
      templateUrl: "../pages/loginTicket.html"
    }).
    when("/loginHotel", {
      templateUrl: "../pages/loginHotel.html"
    }).
    otherwise({ redirectTo: "/home" });
});

app.controller('navController', function ($scope) {
  $scope.open = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
  }
});

app.controller('ModalDemoCtrl', ['$uibModal', '$scope', '$log', function ($uibModal, $scope, $log) {
  $scope.openLoginModal = function (size, parentSelector) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myLoginModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      appendTo: parentElem,
      resolve: {

      }
    });

    modalInstance.result.then(function (response) {
      $scope.result = `${response} button hitted`;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.openSignupModal = function (size, parentSelector) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'mySignupModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      appendTo: parentElem,
      resolve: {

      }
    });

    modalInstance.result.then(function (response) {
      $scope.result = `${response} button hitted`;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}]);

app.controller('ModalInstanceCtrl', ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
}]);

app.controller('ModalICtrl', ['$uibModalInstance', '$scope', 'hotel', function ($uibModalInstance, $scope, hotel) {
  $scope.hotel = hotel;
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
}]);

app.controller('ModalTicketCtrl', ['$uibModalInstance', '$scope', 'ticket', function ($uibModalInstance, $scope, ticket) {
  $scope.ticket = ticket;
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
}]);

app.controller('myCtrl', function ($scope, $http) {
  $scope.gender = ['Male', 'Female'];
  $scope.register = {
    gender: 'Male'
  }

  $scope.loginUser = function () {
    var loginData = $scope.login;

    $http.post('/login', loginData).then(
      function (response) {
        window.localStorage.setItem('usertoken', response.data);
        window.location = "../pages/login.html";
      }, function (error) {
        alert(error.data.msg);
      });
  };

  $scope.registerUser = function () {
    var registerData = $scope.register;

    $http.post('/register', registerData).then(
      function (response) {
        console.log(response);
      }, function (error) {
        alert(error.data.msg);
      });
  };
});

app.controller('bookTicketCtrl', function ($scope, $http) {
  $scope.qty = ["1 ticket", "2 tickets", "3 tickets", "4 tickets", "5 tickets"];

  $scope.selectedItem = "1 ticket";
  $scope.price = $scope.ticket.price;

  $scope.selectedItemChanged = function () {
    $scope.price = $scope.ticket.price;
    if ($scope.selectedItem == "1 ticket") {
      return $scope.ticket.price;
    } else if ($scope.selectedItem == "2 tickets") {
      return $scope.price *= 2;
    } else if ($scope.selectedItem == "3 tickets") {
      return $scope.price *= 3;
    } else if ($scope.selectedItem == "4 tickets") {
      return $scope.price *= 4;
    } else {
      return $scope.price *= 5;
    }
  }
});

app.controller('bookCtrl', function ($scope, $http, $uibModal) {
  $scope.adults = ["2 adults", "3 adults", "4 adults", "5 adults"];
  $scope.children = ["No children", "1 child", "2 children", "3 children", "4 children", "5 children"];
  $scope.rooms = ["1 room", "2 rooms", "3 rooms", "4 rooms", "5 rooms"];
  $scope.book = {
    adults: "2 adults",
    children: "No children",
    rooms: "1 room"
  };

  $scope.selectedItem = "1 room";
  $scope.price = $scope.hotel.price;

  $scope.selectedItemChanged = function () {
    $scope.price = $scope.hotel.price;
    if ($scope.selectedItem == "1 room") {
      return $scope.hotel.price;
    } else if ($scope.selectedItem == "2 rooms") {
      return $scope.price *= 2;
    } else if ($scope.selectedItem == "3 rooms") {
      return $scope.price *= 3;
    } else if ($scope.selectedItem == "4 rooms") {
      return $scope.price *= 4;
    } else {
      return $scope.price *= 5;
    }
  }

  $scope.openGalleryModal = function (hotel) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'GalleryModal.html',
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

  $scope.bookHotel = function () {

    var bookData = $scope.book;
    console.log(bookData);

    $http.post('/book', bookData).then(
      function (response) {
        console.log(response);
      }, function (error) {
        alert(error.data.msg);
      });
  };

  $scope.photos = [
    { src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01' },
    { src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02' },
    { src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03' },
    { src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04' },
    { src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05' },
    { src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06' }
  ];
  // initial image index
  $scope._Index = 0;
  // if a current image is the same as requested image
  $scope.isActive = function (index) {
    return $scope._Index === index;
  };
  // show prev image
  $scope.showPrev = function () {
    $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
  };
  // show next image
  $scope.showNext = function () {
    $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
  };
  // show a certain image
  $scope.showPhoto = function (index) {
    $scope._Index = index;
  };
});

app.controller('loginCtrl', function ($uibModal, $scope, $log) {
  if (window.localStorage.getItem('usertoken')) {
    $scope.show = true;
  } else {
    $scope.show = false;
    window.location = "../index.html";
  }

  $scope.openProfile = function (size, parentSelector) {
    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myProfileModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      appendTo: parentElem,
      resolve: {

      }
    });

    modalInstance.result.then(function (response) {
      $scope.result = `${response} button hitted`;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

