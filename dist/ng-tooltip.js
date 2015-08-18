/*
 * ng-tooltip
 * a simple replacement for AngularUI tooltip
 * Danny Rankevich <danny.ran@gmail.com>

 * Version: 0.1.0 - 2015-08-18
 * License: MIT
 */

/**
 * Created by dannyr on 8/18/2015.
 */

// module definition
angular.module('ng.tooltip', ['ng.tooltip.tmpl']);


angular.module('ng.tooltip').factory('$position', ["$document", "$window", function ($document, $window) {
  function getStyle(el, cssprop) {
    if (el.currentStyle) { //IE
      return el.currentStyle[cssprop];
    } else if ($window.getComputedStyle) {
      return $window.getComputedStyle(el)[cssprop];
    }
    // finally try and get inline style
    return el.style[cssprop];
  }

  /**
   * Checks if a given element is statically positioned
   * @param element - raw DOM element
   */
  function isStaticPositioned(element) {
    return (getStyle(element, 'position') || 'static') === 'static';
  }

  /**
   * returns the closest, non-statically positioned parentOffset of a given element
   * @param element
   */
  var parentOffsetEl = function (element) {
    var docDomEl = $document[0];
    var offsetParent = element.offsetParent || docDomEl;
    while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || docDomEl;
  };

  return {
    /**
     * Provides read-only equivalent of jQuery's position function:
     * http://api.jquery.com/position/
     */
    position: function (element) {
      var elBCR = this.offset(element);
      var offsetParentBCR = {
        top: 0,
        left: 0
      };
      var offsetParentEl = parentOffsetEl(element[0]);
      if (offsetParentEl != $document[0]) {
        offsetParentBCR = this.offset(angular.element(offsetParentEl));
        offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
        offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
      }

      var boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: elBCR.top - offsetParentBCR.top,
        left: elBCR.left - offsetParentBCR.left
      };
    },

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * http://api.jquery.com/offset/
     */
    offset: function (element) {
      var boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
        left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
      };
    },

    /**
     * Provides coordinates for the targetEl in relation to hostEl
     */
    positionElements: function (hostEl, targetEl, positionStr, appendToBody) {
      var positionStrParts = positionStr.split('-');
      var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

      var hostElPos,
        targetElWidth,
        targetElHeight,
        targetElPos;

      hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

      targetElWidth = targetEl.prop('offsetWidth');
      targetElHeight = targetEl.prop('offsetHeight');

      var shiftWidth = {
        center: function () {
          return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
        },
        left: function () {
          return hostElPos.left;
        },
        right: function () {
          return hostElPos.left + hostElPos.width;
        }
      };

      var shiftHeight = {
        center: function () {
          return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
        },
        top: function () {
          return hostElPos.top;
        },
        bottom: function () {
          return hostElPos.top + hostElPos.height;
        }
      };

      switch (pos0) {
        case 'right':
          targetElPos = {
            top: shiftHeight[pos1](),
            left: shiftWidth[pos0]()
          };
          break;
        case 'left':
          targetElPos = {
            top: shiftHeight[pos1](),
            left: hostElPos.left - targetElWidth
          };
          break;
        case 'bottom':
          targetElPos = {
            top: shiftHeight[pos0](),
            left: shiftWidth[pos1]()
          };
          break;
        default:
          targetElPos = {
            top: hostElPos.top - targetElHeight,
            left: shiftWidth[pos1]()
          };
          break;
      }

      return targetElPos;
    }
  };
}]);

angular.module('ng.tooltip').directive('ngTooltip', ["$position", "$controller", "$compile", "$document", "$timeout", function ($position, $controller, $compile, $document, $timeout) {
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
        ttScope.$$ttConfig = config;
        ttScope.$$ttClose = function () {
          closePopup();
        };
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
        var ttPosition = $position.positionElements(element, popupElem, config.placement || 'bottom', appendToBody);
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
}]);


angular.module('ng.tooltip').directive('ngTooltipContent', function () {
  return {
    transclude: true,
    templateUrl: 'ng-tooltip-template.html'
  };
});
