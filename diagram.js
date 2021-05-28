// diagrama
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	let dataBaseOperation;
    let dataForDiagram = [];
    dataForDiagram.push(['Name', 'Amount']);

    if(localStorage.getItem('calc')){
        dataBaseOperation = JSON.parse(localStorage.getItem('calc'));
    }

    for (let index = 0; index < dataBaseOperation.length; index++) {
        const element = dataBaseOperation[index];
        if(element.amount < 0) {
            var elementForDiagram = [element.description, element.amount * -1];
            dataForDiagram.push(elementForDiagram);
        }
    }

    let data = google.visualization.arrayToDataTable(dataForDiagram);

    let options = {
        title: 'Витрати',
        //backgroundColor: 'lightgrey',
        //legend: {position: 'right', textStyle: {color: 'blue', fontSize: 10}},
        titleTextStyle: {fontSize: 30, bold: true}, 
        is3D: true,
        height: 300,
        width: 400
    };

    let chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
