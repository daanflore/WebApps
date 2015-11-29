var sliderApp = angular.module('sliderApp',[]);

sliderApp.directive('slider',function($timeout){
  return{
    restrict:'AE',
    replace:true,
    scope:{
      images: '='
    },
    link:function(scope,elem,attrs){},
    templateUrl:'partials/templateurl.html'
  }
})
