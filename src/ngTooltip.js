angular.module('ng.tooltip').directive('ngTooltip', function ($position, $controller, $compile, $document, $timeout) {
  return {
    scope: {
      ngTooltipConfig: '=',
      ngTooltip: '='
    },
    link: function (scope, element, attrs) {
      var ttElem;
      var config = scope.ngTooltipConfig;
      var appendToBody = angular.isDefined(config.appendToBody) ? config.appendToBody : false;
      var isolateScope = angular.isDefined(config.isolateScope) ? config.isolateScope : true;
      var ttTemplate = '<ng-tooltip-content><ng-include src="\'' + config.templateUrl + '\'"></ng-include></ng-tooltip-content>';
      var linker = $compile(ttTemplate);

      function onBodyClick(event) {
        // close on click outside popup
        var $elem = angular.element(event.target);
        var closest = $elem.closest(ttElem[0]);
        if (!closest.length) {
          $timeout(function () {
            closePopup();
          });
        }
      }

      function openPopup() {
        // scope
        var ttScope = isolateScope ? scope.$new(true) : scope.$parent;

        // controller
        var ctrlLocals = {
          $scope: ttScope,
          $tooltipInstance: {
            config: config,
            close: function () {
              closePopup();
            }
          }
        };

        var ttCtrl = $controller(config.controller, ctrlLocals);
        // elem
        ttElem = linker(ttScope, function cloneAttachFn(clonedElement, scope) {
          if (appendToBody) {
            $document.find('body').append(clonedElement);
          } else {
            element.after(clonedElement);
          }
        });

        // capture click
        $document.find('body')[0].addEventListener('click', onBodyClick, true);

        var popupElem = ttElem.find('.ng-tooltip-element');
        popupElem.css({
          height: config.height,
          width: config.width
        });
        var ttPosition = $position.positionElements(element, popupElem, config.placement || 'bottom', 20, appendToBody);
        popupElem.css(ttPosition);

      }

      function closePopup() {
        // remove capture click
        $document.find('body')[0].removeEventListener('click', onBodyClick, true);
        scope.ngTooltip = false;
        if (ttElem) {
          ttElem.remove();
          ttElem = null;
        }
      }

      scope.$watch('ngTooltip', function onToggle(newVal, oldVal) {
        if (!newVal) {
          closePopup();
        } else {
          openPopup();
        }
      });

    }
  };
});


angular.module('ng.tooltip').directive('ngTooltipContent', function () {
  return {
    transclude: true,
    templateUrl: 'ng-tooltip-template.html'
  };
});
