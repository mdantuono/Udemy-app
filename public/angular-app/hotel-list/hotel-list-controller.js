angular.module('meanhotel').controller('HotelsController', HotelsController);

function HotelsController(hotelDataFactory) {
    var vm = this;
    vm.title = 'MEAN hotel app';
    hotelDataFactory.hotelList().then(function(response) {
        // console.log(response); 
        vm.hotels = response.data;
    });
}