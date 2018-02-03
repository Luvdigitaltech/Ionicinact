'use strict';
csDirectives.directive('filterPicker', ["contentTypeDataService", "contentTypeManagerDataService", function (contentTypeDataService, contentTypeManagerDataService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mode: "=", //Popup or inline mode
            contentTypeId: "=", //
            EditMode: "=", //Create or Edit
            operatorData: "="
        },
        template: '<ng-include src="templatePath"></ng-include>',
        link: function ($scope, element, attributes) {

            $scope.$watch("mode", function (templateName) {
                console.log("Mode set is ", templateName);
                switch (templateName) {
                    case "Popup":
                        $scope.templatePath = "/Modules/Common/Picker/pickerTemplatePopup.html";
                        break;
                    case "Inline":
                        $scope.templatePath = "/Modules/Common/Picker/pickerTemplate.html";
                        break;
                    default:
                        $scope.templatePath = "/Modules/Common/Picker/pickerTemplatePopup.html";
                        break;
                }
            });
        },
        controller: function ($scope, $rootScope, $filter) {
            $scope.pickerDetails = [];
            $scope.Operators = [];
            console.log($scope.contentTypeId);
            $scope.onInit = function () {
                console.log("onInit of picker");
                $scope.LoadContentTypeFields();
                $scope.loadOperators();
            };

            $scope.loadOperators = function () {
                $scope.Operators = [
                { "value": 1, "text": "Equal" },
                { "value": 2, "text": "Begins With" },
                { "value": 3, "text": "Does Not Begin With" },
                { "value": 4, "text": "Ends With" },
                { "value": 5, "text": "Equal To" },
                { "value": 6, "text": "Does Not End With" },
                { "value": 7, "text": "Contains" },
                { "value": 8, "text": "Does Not Contain" },
                { "value": 9, "text": "Is Null" },
                { "value": 10, "text": "Is Not Null" },
                { "value": 11, "text": "Is In" },
                { "value": 12, "text": "Is not in" }
                ];
            }

            $scope.LoadContentTypeFields = function () {

                console.log("LoadContentTypeFields....")
                $scope.contentTypeDetailSuccess = function (response) {

                    var result = response.data;
                    console.log("result....", result);
                    $scope.populateContentTypeFields(result.contentTypeFields);

                }

                $scope.populateContentTypeFields = function (contentTypeFields) {
                    console.log("Inside populateContentTypeFields....");
                    var fieldArr = [];

                    for (var i = 0; i < contentTypeFields.length; i++) {
                        console.log("Inside loop....");
                        var contentType =contentTypeFields[i].fieldKey
                        fieldArr.push(contentType);
                    }

                    console.log("fieldArr....", fieldArr);
                    $scope.FieldNames = fieldArr;
                }

                $scope.contentTypeDetailError = function (response) {
                    console.log("contentTypeDetailError....", response.error.message)
                    notifyError(response.error.message);
                }

                //$scope.contentTypeId= "2e9b0c39-1414-4132-aa53-7633d69db6f6";

                var detailRequest = {
                    //id: "2e9b0c39-1414-4132-aa53-7633d69db6f6",
                    id: $scope.contentTypeId,
                    majorVersion: "",
                    minorVersion: ""
                }

                contentTypeManagerDataService.getContentTypeDetailData(detailRequest, $scope.contentTypeDetailSuccess, $scope.contentTypeDetailError);
            }

            $scope.checkEmpty = function (data) {
                if (!data || data == "") {
                    return "Value is required";
                }
            };

            $scope.saveOperatorsData = function (data) {
                console.log("saveOperatorsData...", data)
                //angular.extend(data);
                angular.toJson(data);
                return data;
            };

            $scope.removeOperatorsData = function (index) {
                $scope.pickerDetails.splice(index, 1);

            };

            $scope.addOperatorsData = function () {
                debugger;
                $scope.inserted = {
                    fieldName: "",
                    operator: "",
                    value: null
                };
                console.log("$scope.inserted...", $scope.inserted);
                console.log("$scope.pickerDetails", $scope.pickerDetails)
                $scope.pickerDetails.push($scope.inserted);
            };


            $scope.sendOperatorsData = function () {
                var test = angular.toJson($scope.pickerDetails);
                console.log(test);
                $rootScope.data = JSON.stringify(test);
                $scope.operatorData = JSON.stringify(test);
                console.log(JSON.stringify(test));
            }
        }
    };
}]);