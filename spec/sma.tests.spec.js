const d3 = require("d3");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// Setup fake page

var Chart = require('../chart.js');
var Data_converter = require('../data_converter.js');

describe('chart tests', ()=>
{

	describe("A spec", function() {

		beforeEach(function() {
			this.dom = new JSDOM(`
			<!DOCTYPE html>
			<html>
				<head>
				</head>
				<body>
				</body>
			</html>
			`);
			this.document = this.dom.window.document;

			this.WIDTH = 500;
			this.HEIGHT = 500;

			this.svg = d3.select(this.dom.window.document.body)
				.append('svg')
				.attr('width', this.WIDTH)
				.attr('height', this.HEIGHT)
				.append('g')
				.attr('transform', 'translate(' + (this.WIDTH / 2) +  ',' + (this.HEIGHT / 2) + ')');

			var fs = require("fs");
			var content = fs.readFileSync("./spec/test_data.json");
			this.obj = JSON.parse(content);

			this.data_converter = new Data_converter();
			this.data = this.data_converter.get_data(this.obj);
			this.chart = new Chart(this.svg, d3, this.data);
		});

		it("SVG basic tests", function() {
			// Arrange

			// Act


			// Assert
			expect(this.document.querySelector("svg")).toBeDefined();

			// Has to come after, or else unit test will crash if "svg" tag does not exist.
			// Expect dom to have an svg 
			const _svg = this.document.querySelector("svg");

			// Expect svg width and height to be 500
			expect(_svg.getAttribute('width')).toEqual('500');
			expect(_svg.getAttribute('height')).toEqual('500');


		});

		it("Add project circle tests", function() {
			// Arrange

			// Act
			this.chart.add_project_circle("Unit tests");

			// Assert
			expect(this.document.querySelector("circle")).toBeDefined();
			expect(this.document.querySelector("text")).toBeDefined();

			const drawn_circle = this.document.querySelector("circle");
			const drawn_circle_text = this.document.querySelector("text");

			// Expect the circle to be drawn at the right place
			expect(drawn_circle.getAttribute('cx')).toEqual('0');
			expect(drawn_circle.getAttribute('cy')).toEqual('0');
			expect(drawn_circle.getAttribute('r')).toEqual('100');

			// Expect the right text to be drawn in the circle
			expect(drawn_circle_text.innerHTML).toEqual("Unit tests");
		});

		it("Add piechart tests", function() {
			// Arrange

			// Act
			this.chart.add_piechart();
			this.chart.add_legend();
			this.chart.add_slice_names();
			const slices = this.document.querySelectorAll(".arc");
			const legend_count = this.document.querySelectorAll(".legend");
			const text_slices = this.document.querySelectorAll(".categoryText");

			// Assert

			// Expect there to have been made 13 slices.
			expect(slices.length).toEqual(13);
			expect(text_slices.length).toEqual(13);
			expect(legend_count.length).toEqual(15);
		});

	});

});
