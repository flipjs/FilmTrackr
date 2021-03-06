'use strict';

(function() {
	// Films Controller Spec
	describe('Films Controller Tests', function() {
		// Initialize global variables
		var FilmsController,
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

			// Initialize the Films controller.
			FilmsController = $controller('FilmsController', {
				$scope: scope
			});
		}));

		it('FilmsController.find() should create an array with at least one Film object fetched from XHR', inject(function(Films) {
			// Create sample Film using the Films service
			var sampleFilm = new Films({
				camera      : 'New Camera',
				catalog     : 'Catalog',
				film        : 'film',
				type        : 'type',
				iso         : 400,
				format      : '35mm',
				description : 'desc',
				start       : new Date(),
				finish      : new Date(),
				develop     : new Date(),
				scan        : new Date()
			});

			// Create a sample Films array that includes the new Film
			var sampleFilms = [sampleFilm];

			// Set GET response
			$httpBackend.expectGET('films').respond(sampleFilms);

			// Run controller functionality
			FilmsController.find();
			$httpBackend.flush();

			// Test scope value
			expect(FilmsController.films).toEqualData(sampleFilms);
		}));

		it('FilmsController.findOne() should create an array with one Film object fetched from XHR using a filmId URL parameter', inject(function(Films) {
			// Define a sample Film object
			var sampleFilm = new Films({
				camera      : 'New Camera',
				catalog     : 'Catalog',
				film        : 'film',
				type        : 'type',
				iso         : 400,
				format      : '35mm',
				description : 'desc',
				start       : new Date(),
				finish      : new Date(),
				develop     : new Date(),
				scan        : new Date()
			});

			// Set the URL parameter
			$stateParams.filmId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/films\/([0-9a-fA-F]{24})$/).respond(sampleFilm);

			// Run controller functionality
			FilmsController.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(FilmsController.film).toEqualData(sampleFilm);
		}));

		xit('FilmsController.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Films) {
			// Create a sample Film object
			var sampleFilmPostData = new Films({
				camera      : 'New Camera',
				catalog     : 'Catalog',
				film        : 'film',
				type        : 'type',
				iso         : 400,
				format      : '35mm',
				description : 'desc',
				start       : new Date(),
				finish      : new Date(),
				develop     : new Date(),
				scan        : new Date()
			});

			// Create a sample Film response
			var sampleFilmResponse = new Films({
				_id: '525cf20451979dea2c000001',
				camera      : 'New Camera',
				catalog     : 'Catalog',
				film        : 'film',
				type        : 'type',
				iso         : 400,
				format      : '35mm',
				description : 'desc',
				start       : new Date(),
				finish      : new Date(),
				develop     : new Date(),
				scan        : new Date()
			});

			// Fixture mock form input values
			FilmsController.filmRoll.camera = 'New Camera';

			// Set POST response
			$httpBackend.expectPOST('films', sampleFilmPostData).respond(sampleFilmResponse);

			// Run controller functionality
			FilmsController.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(FilmsController.filmRoll.camera).toEqual('');

			// Test URL redirection after the Film was created
			expect($location.path()).toBe('/films/' + sampleFilmResponse._id);
		}));

		it('FilmsController.update() should update a valid Film', inject(function(Films) {
			// Define a sample Film put data
			var sampleFilmPutData = new Films({
				_id: '525cf20451979dea2c000001',
				camera      : 'New Camera',
				catalog     : 'Catalog',
				film        : 'film',
				type        : 'type',
				iso         : 400,
				format      : '35mm',
				description : 'desc',
				start       : new Date(),
				finish      : new Date(),
				develop     : new Date(),
				scan        : new Date()
			});

			// Mock Film in scope
			FilmsController.film = sampleFilmPutData;

			// Set PUT response
			$httpBackend.expectPUT(/films\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			FilmsController.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/films/' + sampleFilmPutData._id);
		}));

		xit('FilmsController.remove() should send a DELETE request with a valid filmId and remove the Film from the scope', inject(function(Films) {
			// Create new Film object
			var sampleFilm = new Films({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Films array and include the Film
			FilmsController.films = [sampleFilm];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/films\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			FilmsController.remove(sampleFilm);
			$httpBackend.flush();

			// Test array after successful delete
			expect(FilmsController.films.length).toBe(0);
		}));
	});
}());
