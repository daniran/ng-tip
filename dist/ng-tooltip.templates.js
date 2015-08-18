angular.module('ng.tooltip.tmpl', ['ng-tooltip-template.html']);

angular.module("ng-tooltip-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-tooltip-template.html",
    "<div class=\"ng-tooltip-element\">\n" +
    "    <div class=\"ng-tooltip-arrow\"></div>\n" +
    "    <div class=\"ng-tooltip-content\">\n" +
    "        <ng-transclude></ng-transclude>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
