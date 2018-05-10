<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8"> 
		<title>SMA</title>

		<style>

			.legend {
				font-size: 12px;
			}
			rect {
				stroke-width: 2;
			}

		</style>

		<script src="d3.v4.min.js"></script>

	</head>
	<body>

		<div id="chart" align="center"></div>

		<script src="data_converter.js"></script>
		<script src="chart.js"></script>

		<script>
			var stakeholder_detailinfo = <?php 
				echo file_get_contents('http://www3.llinxx.com:3151/stakeholderhh/stakeholders?fields=*');  
			?>  
			var project_name = <?php
				echo file_get_contents('http://www3.llinxx.com:3151/stakeholderhh/case');
			?>

			project_name = project_name[0].label;

			var data_converter = new Data_converter();
			var data = data_converter.get_data(stakeholder_detailinfo);

			var svg = d3.select('#chart')
				.append('svg')
				.attr('width', WIDTH)
				.attr('height', HEIGHT)
				.append('g')
				.attr('transform', 'translate(' + (WIDTH / 2) +  ',' + (HEIGHT / 2) + ')');

			var chart = new Chart(svg, undefined, data);

			chart.add_piechart();
			chart.add_legend();
			chart.add_slice_names();
			chart.add_project_circle(project_name);
		</script>

	</body> 
</html>
