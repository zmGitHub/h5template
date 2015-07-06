'use strict';

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var UsersCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    UsersCtrl = $controller('UsersCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsersCtrl.awesomeThings.length).toBe(3);
  });
});
