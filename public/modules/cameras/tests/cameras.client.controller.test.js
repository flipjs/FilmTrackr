'use strict';

(function() {
	// Cameras Controller Spec
	describe('Cameras Controller Tests', function() {
		// Initialize global variables
		var CamerasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Cameras controller.
			CamerasController = $controller('CamerasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Camera object fetched from XHR', inject(function(Cameras) {
			// Create sample Camera using the Cameras service
			var sampleCamera = new Cameras({
				name: 'New Camera'
			});

			// Create a sample Cameras array that includes the new Camera
			var sampleCameras = [sampleCamera];

			// Set GET response
			$httpBackend.expectGET('cameras').respond(sampleCameras);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cameras).toEqualData(sampleCameras);
		}));

		it('$scope.findOne() should create an array with one Camera object fetched from XHR using a cameraId URL parameter', inject(function(Cameras) {
			// Define a sample Camera object
			var sampleCamera = new Cameras({
				name: 'New Camera'
			});

			// Set the URL parameter
			$stateParams.cameraId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cameras\/([0-9a-fA-F]{24})$/).respond(sampleCamera);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.camera).toEqualData(sampleCamera);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cameras) {
			// Create a sample Camera object
			var sampleCameraPostData = new Cameras({
				name: 'New Camera'
			});

			// Create a sample Camera response
			var sampleCameraResponse = new Cameras({
				_id: '525cf20451979dea2c000001',
				name: 'New Camera'
			});

			// Fixture mock form input values
			scope.name = 'New Camera';

			// Set POST response
			$httpBackend.expectPOST('cameras', sampleCameraPostData).respond(sampleCameraResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Camera was created
			expect($location.path()).toBe('/cameras/' + sampleCameraResponse._id);
		}));

		it('$scope.update() should update a valid Camera', inject(function(Cameras) {
			// Define a sample Camera put data
			var sampleCameraPutData = new Cameras({
				_id: '525cf20451979dea2c000001',
				name: 'New Camera'
			});

			// Mock Camera in scope
			scope.camera = sampleCameraPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cameras\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cameras/' + sampleCameraPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cameraId and remove the Camera from the scope', inject(function(Cameras) {
			// Create new Camera object
			var sampleCamera = new Cameras({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cameras array and include the Camera
			scope.cameras = [sampleCamera];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cameras\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCamera);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cameras.length).toBe(0);
		}));
	});
}());