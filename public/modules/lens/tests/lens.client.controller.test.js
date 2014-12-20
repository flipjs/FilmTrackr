'use strict';

(function() {
	// Lens Controller Spec
	describe('Lens Controller Tests', function() {
		// Initialize global variables
		var LensController,
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

			// Initialize the Lens controller.
			LensController = $controller('LensController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Len object fetched from XHR', inject(function(Lens) {
			// Create sample Len using the Lens service
			var sampleLen = new Lens({
				name: 'New Len'
			});

			// Create a sample Lens array that includes the new Len
			var sampleLens = [sampleLen];

			// Set GET response
			$httpBackend.expectGET('lens').respond(sampleLens);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lens).toEqualData(sampleLens);
		}));

		it('$scope.findOne() should create an array with one Len object fetched from XHR using a lenId URL parameter', inject(function(Lens) {
			// Define a sample Len object
			var sampleLen = new Lens({
				name: 'New Len'
			});

			// Set the URL parameter
			$stateParams.lenId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/lens\/([0-9a-fA-F]{24})$/).respond(sampleLen);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.len).toEqualData(sampleLen);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Lens) {
			// Create a sample Len object
			var sampleLenPostData = new Lens({
				name: 'New Len'
			});

			// Create a sample Len response
			var sampleLenResponse = new Lens({
				_id: '525cf20451979dea2c000001',
				name: 'New Len'
			});

			// Fixture mock form input values
			scope.name = 'New Len';

			// Set POST response
			$httpBackend.expectPOST('lens', sampleLenPostData).respond(sampleLenResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Len was created
			expect($location.path()).toBe('/lens/' + sampleLenResponse._id);
		}));

		it('$scope.update() should update a valid Len', inject(function(Lens) {
			// Define a sample Len put data
			var sampleLenPutData = new Lens({
				_id: '525cf20451979dea2c000001',
				name: 'New Len'
			});

			// Mock Len in scope
			scope.len = sampleLenPutData;

			// Set PUT response
			$httpBackend.expectPUT(/lens\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/lens/' + sampleLenPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid lenId and remove the Len from the scope', inject(function(Lens) {
			// Create new Len object
			var sampleLen = new Lens({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Lens array and include the Len
			scope.lens = [sampleLen];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/lens\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLen);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.lens.length).toBe(0);
		}));
	});
}());