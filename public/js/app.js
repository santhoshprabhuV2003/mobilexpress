var app = angular.module("mobilexpress",['ngMessages', 'ngAnimate', 'ngRoute']); 
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'homectrl'
        })
        .when('/products', {
            templateUrl: 'products.html',
            controller: 'productsctrl'
        })
        .when('/cart', {
            templateUrl: 'cart.html',
            controller: 'cartctrl'
        })
        .when('/aboutus', {
            templateUrl: 'aboutus.html',
            controller: 'aboutusctrl'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'signupctrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginctrl'
        })
        .when('/admin', {
            templateUrl: 'admin.html',
            controller: 'adminctrl'
        })
        .otherwise({ redirectTo: '/' });
}]);

app.controller("homectrl",['$scope', '$location','AuthService', function($scope, $location, AuthService) {
    $scope.username = AuthService.getUsername();
    $scope.home = {imagesource:"images/homeimage.png"};

    var services = [{imagesource:"images/service1.png", title:"Extended waranty", 
                    description:"With our extended warranty program, you can enjoy peace of mind knowing that your device is covered for up to two years from the original purchase date. Our extended warranty also includes free technical support for any issues you may have with your device."},
                    {imagesource:"images/service2.png", title:"Fastest delivery",
                    description:"We offer fast delivery of all products purchased from our store. Your order will be delivered to you quickly, so you can start using your new phone or accessory in no time. Our speedy delivery service makes it easy to get what you need, when you need it."},
                    {imagesource:"images/service3.png", title:"Always first and best!!", 
                    description:"MobileXpress offers the latest and greatest phones from all of the top brands. We are constantly updating our inventory with the newest products, so you can be sure to find the perfect phone for your needs. Our knowledgeable staff are on hand to help you find the right phone for you."}
                ];

    $scope.services = services;

    $scope.logout = function() {
        AuthService.setUsername('');
        $location.path('/login');
    };
}]);

app.controller("productsctrl", ['$scope','$http', 'CartService', 'AuthService', function($scope, $http, CartService, AuthService) { 
    $scope.products = [];
    $scope.username = AuthService.getUsername();

    $http.get('/api/products').then(function(response) {
        $scope.products = response.data;
        $scope.applyFilters();
    });

    $scope.companies = ["Apple","Samsung","Realme","OnePlus","Xiaomi","Oppo"];

    // Price Range Filter
    $scope.selectedPriceRange = "";
    $scope.priceRangeFilter = function (product) {
        if (!$scope.selectedPriceRange) {
            return true;
        }
        var priceRanges = {
            "lt20000": product.price < 20000,
            "20001-40000": product.price >= 20001 && product.price <= 40000,
            "40001-60000": product.price >= 40001 && product.price <= 60000,
            "60001-80000": product.price >= 60001 && product.price <= 80000,
            "gt80000": product.price > 80000
        };
        return priceRanges[$scope.selectedPriceRange];
    };

    // Sort by price
    $scope.sortBy = "default";
    $scope.sortProducts = function (product) {
        if ($scope.sortBy === "lowToHigh") {
            return product.price;
        } else if ($scope.sortBy === "highToLow") {
            return -product.price;
        }
        return 0;
    };

    // Applying Filters
    $scope.applyFilters = function () {
        $scope.filteredProducts = $scope.products
            .filter(function (product) {
                return $scope.priceRangeFilter(product);
            })
            .sort(function (a, b) {
                return $scope.sortProducts(a) - $scope.sortProducts(b);
            });
    };

    $scope.$watchGroup(['selectedPriceRange','sortBy'], function () {
        $scope.applyFilters();
    });

    // Cart
    $scope.addToCart = function(product) {
        CartService.addToCart(product);
        alert(product.name + " added to cart!!");
    };
}]); 

app.controller("aboutusctrl",['$scope','AuthService', function($scope, AuthService) {
    $scope.username = AuthService.getUsername();
    $scope.ourstory = "MobileXpress is committed to providing our customers with the highest quality products and services. We strive to deliver the best customer experience and are proud to be a trusted provider of the latest mobile phones and accessories. Our team of experienced professionals is dedicated to providing fast and reliable delivery of our products, both online and in store. We are passionate about what we do, and we are committed to providing the best mobile phone experience to our customers.";

    $scope.ourstoryimage = "images/story.png";

    $scope.formData = {};
    $scope.submitted = false;

    $scope.submitForm = function () {
        if ($scope.contactForm.$valid) {
            alert("Thank for your message\nWe will contact you shortly!");
            $scope.formData = {};
            $scope.contactForm.$setPristine();
            $scope.contactForm.$setUntouched();
        } else {
            $scope.submitted = true;
        }
    };
}]);

app.controller('cartctrl', ['$scope', 'CartService', 'AuthService', function($scope, CartService, AuthService) {
    $scope.cartItems = CartService.getCartItems();
    $scope.username = AuthService.getUsername();

    $scope.totalPrice = $scope.cartItems.reduce(function(total, item) {
        return total + item.price;
    }, 0);

    $scope.removeItemFromCart = function(index) {
        CartService.removeFromCart(index);
        $scope.cartItems = CartService.getCartItems();

        $scope.totalPrice = $scope.cartItems.reduce(function(total, item) {
            return total + item.price;
        }, 0);
    };
}]);

app.controller('signupctrl', ['$scope', '$http','$location', function($scope, $http, $location) {
    $scope.userData = {};

    $scope.signup = function() {
        if ($scope.userData.password !== $scope.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        $http.post('/api/signup',$scope.userData)
            .then(function(response) {
                alert(response.data.message);
                $location.path('/login');
            })
            .catch(function(error) {
                alert('Account creation failed. Please try again.');
            });
    };
}]);

app.controller('loginctrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {
    $scope.userData = {};

    $scope.login = function() {
        $http.post('/api/login', $scope.userData)
            .then(function(response) {
                if(response.data.success && $scope.userData.username === "admin") {
                    $location.path('/admin');
                }
                else if (response.data.success) {
                    alert("Login Success!!!");
                    AuthService.setUsername($scope.userData.username);
                    $location.path('/home');
                } else {
                    alert('Invalid username or password. Please try again.');
                    $scope.userData = {};
                }
            })
            .catch(function(error) {
                alert('Login failed. Please try again.');
            });
    };
}]);

app.controller('adminctrl', ['$scope', '$http', function($scope,$http) {
    $scope.product = {};
    $scope.delete = {};
    $scope.update = {};

    $scope.addproduct = function() {
        $http.post('/product', $scope.product)
            .then(function(response) {
                alert(response.data.message);
                $scope.product = {};
            })
            .catch(function(error) {
                alert('Failed to add product!!! Please try again');
            });
    };

    $scope.deleteproduct = function() {
        $http.delete('/product', $scope.delete)
            .then(function(response) {
                alert(response.data.message);
                $scope.delete = {};
            })
            .catch(function(error) {
                alert('Failed to delete product!!! Please try again');
            });
    };

    $scope.updateproduct = function() {
        $http.patch('/product', $scope.update)
            .then(function(response) {
                alert(response.data.message);
                $scope.update = {};
            })
            .catch(function(error) {
                alert('Failed to update price!!! Please try again');
            });
    };
}]);

app.directive('product', function () {
    return {
        restrict: 'E',
        scope: {
            product: '=',
            addItemToCheckout: '&'
        },
        template: `
            <div class="product-container">
                <picture class="thumbnail"><img class="product-image" ng-src="{{product.imgsrc}}" alt="{{product.name}}"></picture>
                <div class="product-content">
                    <h2>{{product.name | uppercase}}</h2>
                    <p>{{product.company}}</p>
                    <p>{{product.description}}</p>
                    <p>Rating: {{product.rating | number}}</p>
                    <p>Price: {{ product.price | currency : "Rs." : 2 }}</p>
                    <button class="product-button" ng-click="addItemToCheckout({product: product})">ADD TO CART</button>
                </div>
            </div>
        `
    };
});

app.factory('CartService', function() {
    var cartItems = [];

    return {
        addToCart: function(product) {
            cartItems.push(product);
        },
        removeFromCart: function(index) {
            cartItems.splice(index, 1);
        },
        getCartItems: function() {
            return cartItems;
        }
    };
});

app.factory('AuthService', function() {
    var username = '';

    return {
        getUsername: function() {
            return username;
        },
        setUsername: function(newUsername) {
            username = newUsername;
        }
    };
});