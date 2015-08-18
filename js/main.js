/**
 * Created by dannyr on 8/18/2015.
 */

var app = angular.module('ng-tip-site', ['ng.tooltip']);


app.controller('ngTooltipCtrl', function ($scope) {
    var ctrl = this;

    var dirs = ['top', 'bottom', 'left', 'right' /* 'top-left', 'top-right', 'bottom-left', 'bottom-right' */];

    $scope.tooltips = [];

    for (var i = 0; i < dirs.length; i++) {
        var popupData = {
            opened: false,
            onHover: i % 2 == 0,
            config: {
                width: 300,
                height: 150,
                templateUrl: 'sandbox-tooltip.html',
                controller: 'ngTooltipTestCtrl',
                placement: dirs[i],
                appendToBody: false,
                isolateScope: true
            }
        };

        $scope.tooltips.push(popupData);
    }

    $scope.setPopupOpened = function (index, val) {
        var popupData = $scope.tooltips[index];
        if (!angular.isDefined(val))
            val = !popupData.opened;
        popupData.opened = val;
    };
});

app.controller('ngTooltipTestCtrl', function ($scope, $tooltipInstance) {
    $scope.title = "this is the tooltip title";
    $scope.close = function () {
        $tooltipInstance.close();
    }
});
