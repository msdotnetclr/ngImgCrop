'use strict';

crop.directive('imgCrop', ['$timeout', 'cropHost', 'cropPubSub', function($timeout, CropHost, CropPubSub) {
  return {
    restrict: 'E',
    scope: {
      image: '=',
      resultImage: '=',

      changeOnFly: '=',
      areaType: '@',
      areaMinWidth: '=',
      areaMinHeight: '=',
      resultImageFormat: '@',
      resultImageQuality: '=',
      resultWidth: "=",
      resultHeight: "=",
      keepAspectRatio: "=",
      allowUpscale: "=",

      onChange: '&',
      onLoadBegin: '&',
      onLoadDone: '&',
      onLoadError: '&'
    },
    template: '<canvas></canvas>',
    controller: ['$scope', function($scope) {
      $scope.events = new CropPubSub();
    }],
    link: function(scope, element/*, attrs*/) {
      // Init Events Manager
      var events = scope.events;

      // Init Crop Host
      var cropHost=new CropHost(element.find('canvas'), {}, events);

      // Store Result Image to check if it's changed
      var storedResultImage;

      var updateResultImage=function(scope) {
        var resultImage=cropHost.getResultImageDataURI();
        if(storedResultImage!==resultImage) {
          storedResultImage=resultImage;
          if(angular.isDefined(scope.resultImage)) {
            scope.resultImage=resultImage;
          }
          scope.onChange({$dataURI: scope.resultImage});
        }
      };

      // Wrapper to safely exec functions within $apply on a running $digest cycle
      var fnSafeApply=function(fn) {
        return function(){
          $timeout(function(){
            scope.$apply(function(scope){
              fn(scope);
            });
          });
        };
      };

      // Setup CropHost Event Handlers
      events
        .on('load-start', fnSafeApply(function(scope){
          scope.onLoadBegin({});
        }))
        .on('load-done', fnSafeApply(function(scope){
          scope.onLoadDone({});
        }))
        .on('load-error', fnSafeApply(function(scope){
          scope.onLoadError({});
        }))
        .on('area-move area-resize', fnSafeApply(function(scope){
          if(!!scope.changeOnFly) {
            updateResultImage(scope);
          }
        }))
        .on('area-move-end area-resize-end image-updated', fnSafeApply(function(scope){
          updateResultImage(scope);
        }));

      // Sync CropHost with Directive's options
      scope.$watch('image',function(){
        cropHost.setNewImageSource(scope.image);
      });
      scope.$watch('areaType',function(){
        cropHost.setAreaType(scope.areaType);
        updateResultImage(scope);
      });
      scope.$watch('areaMinWidth', function () {
          cropHost.setAreaMinWidth(scope.areaMinWidth);
          updateResultImage(scope);
      });
      scope.$watch('areaMinHeight', function () {
          cropHost.setAreaMinHeight(scope.areaMinHeight);
          updateResultImage(scope);
      });
      scope.$watch('resultWidth', function () {
          cropHost.setMaxResultWidth(scope.resultWidth);
          updateResultImage(scope);
      });
      scope.$watch('resultHeight', function () {
          cropHost.setMaxResultHeight(scope.resultHeight);
          updateResultImage(scope);
      });
      scope.$watch('keepAspectRatio', function () {
          cropHost.setKeepAspectRatio(scope.keepAspectRatio);
          updateResultImage(scope);
      });
      scope.$watch('allowUpscale', function () {
          cropHost.setAllowUpscale(scope.allowUpscale);
          updateResultImage(scope);
      });

      scope.$watch('resultImageFormat', function () {
        cropHost.setResultImageFormat(scope.resultImageFormat);
        updateResultImage(scope);
      });
      scope.$watch('resultImageQuality',function(){
        cropHost.setResultImageQuality(scope.resultImageQuality);
        updateResultImage(scope);
      });

      // Update CropHost dimensions when the directive element is resized
      scope.$watch(
        function () {
          return [element[0].clientWidth, element[0].clientHeight];
        },
        function (value) {
          cropHost.setMaxDimensions(value[0],value[1]);
          updateResultImage(scope);
        },
        true
      );

      // Destroy CropHost Instance when the directive is destroying
      scope.$on('$destroy', function(){
          cropHost.destroy();
      });
    }
  };
}]);