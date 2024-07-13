document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les tables
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');

    // Créer des conteneurs pour les graphiques
    const chartContainer1 = document.createElement('div');
    chartContainer1.classList.add('table1');
    const chartContainer2 = document.createElement('div');
    chartContainer2.classList.add('table2');

    // Insérer les conteneurs juste au-dessus des tables
    table1.parentNode.insertBefore(chartContainer1, table1);
    table2.parentNode.insertBefore(chartContainer2, table2);

    // Fonction pour extraire les données des tables HTML
    function extractDataFromTable(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const categories = [];
        const seriesData = [];

        rows.slice(1).forEach(row => { // Slice to skip the header row
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                categories.push(cells[0].innerText);
                seriesData.push(parseFloat(cells[1].innerText));
            }
        });

        return { categories, seriesData };
    }

    // Extraire les données des tables
    const data1 = extractDataFromTable(table1);
    const data2 = extractDataFromTable(table2);

    async function fetchData() {
        try {
            const response = await fetch('https://canvasjs.com/services/data/datapoints.php');
            const data = await response.json();
            return data.map(point => ({ x: new Date(point[0]), y: point[1] }));
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    async function updateChart() {
        const dataPoints = await fetchData();
        const categories = dataPoints.map(point => point.x.toLocaleTimeString());
        const seriesData = dataPoints.map(point => point.y);


        chart.updateOptions({
            data: {
                categories: categories,
                series: [
                    {
                        name: 'Data',
                        data: seriesData
                    }
                ]
            }
        });
    }

    setInterval(updateChart, 1000);

        // Initialiser les graphiques
    const chart1 = toastui.Chart.lineChart({
        el: chartContainer1,
        data: {
            categories: data1.categories,
            series: [
                {
                    name: 'Data1',
                    data: data1.seriesData
                }
            ]
        },
        options: {
            chart: {
                width: chartContainer1.clientWidth,
                height: 400
            }
        }
    });

    const chart2 = toastui.Chart.lineChart({
        el: chartContainer2,
        data: {
            categories: data2.categories,
            series: [
                {
                    name: 'Data2',
                    data: data2.seriesData
                }
            ]
        },
        options: {
            chart: {
                width: chartContainer2.clientWidth,
                height: 400
            }
        }
    });
});

$(document).ready(function(){   
	$('a.statexp-vislet').on('click', function (evt) {
		
		$this = $(this);
		
		var src = $this.attr('href');
		var width = $this.attr('data-width');
		var height = $this.attr('data-height');
		
		var title = '';
		var footpage = '';

		if ($this.attr('data-title') !== undefined) {
			title = '<h4>'+$this.attr('data-title')+'</h4>';
		}

		if ($this.attr('data-footpage') !== undefined) {
			footpage = ''+$this.attr('data-footpage')+'</p>';
		}
		
		if ($this.attr('data-video') === undefined) {
			evt.stopPropagation();
			evt.preventDefault();
			newwindow = window.open('', "vislet", "resizable=yes, scrollbars=yes, titlebar=no, width="+width+", height="+height+", top=10, left=10");
			newwindow.document.write('<div><div>'+title+'</div><iframe src="'+src+'" width="100%" height="100%"></iframe><p style="text-align: right; color: grey; padding-right: 7px; font-size: 10px; font-style: italic;">'+footpage+'</p></div>');
			newwindow.document.close();
		}
	});
});

