/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */

import {calendarMonth, calendarYear} from './budget_calendar.js';
import myEmitter from './budget_calendar.js';

const generateId = () => `id${Math.round(Math.random() * 1e8).toString(16)}`;

const totalBalance = document.querySelector('.total__balance');
const totalMoneyIncome = document.querySelector('.total__money-income');
const totalMoneyExpenses = document.querySelector('.total__money-expenses');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('#form');
const operationName = document.querySelector('.operation__name');
const operationAmount = document.querySelector('.operation__amount');


let dataBaseOperation = [];


if(localStorage.getItem('calc')){
    dataBaseOperation = JSON.parse(localStorage.getItem('calc'));
}


const renderOperation = (operation) => {

    const className = operation.amount < 0 ? 
        'history__item-minus' : 
        'history__item-plus';
   
    const listItem = document.createElement('li');
	
    listItem.classList.add('history__item');
    listItem.classList.add(className);

    listItem.innerHTML = `${operation.description}
			<span class="history__money">${operation.amount} грн </span>
        	<button class="history__delete" data-id = "${operation.id}">x</button>
		`;
    historyList.append(listItem);

};

const updateBalance = () => {
    const resultIncome = dataBaseOperation
        .filter((item) => item.amount > 0)
        .reduce((result, item) => result + item.amount, 0);

    const resultExpenses = dataBaseOperation
        .filter((item) => item.amount < 0)
        .reduce((result, item) => result + item.amount, 0);

    totalMoneyIncome.textContent = resultIncome + 'грн';
    totalMoneyExpenses.textContent = resultExpenses + 'грн';
    totalBalance.textContent = (resultIncome + resultExpenses) + 'грн';
};

const addOperation = (event) => {
    event.preventDefault();
    const operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;
    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationNameValue && operationAmountValue) {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
            date: new Date()
        };

        console.log(operation);

        dataBaseOperation.push(operation);
        init();
        console.log(dataBaseOperation);
    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    }

    operationName.value  = '';
    operationAmount.value = '';
    drawChart();
};


const deleteOperation = (event) => {
	
    const target = event.target;
	
    if(target.classList.contains('history__delete')) {
        dataBaseOperation = dataBaseOperation
            .filter(operation => operation.id !== target.dataset.id);

        myEmitter.dispatch('renderHistory');
    }
    drawChart();
};



const init = () => {
    historyList.textContent = '';
    for (let i = 0; i < dataBaseOperation.length; i++) {
        let element = dataBaseOperation[i];
        let elementMonth = new Date(element.date).getMonth();
        let elementYear = new Date(element.date).getFullYear();
        if(calendarYear === elementYear && calendarMonth === elementMonth) {
            renderOperation(element);
        }
    }
    updateBalance();
	
    localStorage.setItem('calc', JSON.stringify(dataBaseOperation));
	
};

form.addEventListener('submit', addOperation);

historyList.addEventListener('click', deleteOperation);

myEmitter.addEventListener('renderHistory', init);
myEmitter.dispatch('renderHistory');


// diagrama
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    let dataForDiagram = [];
    dataForDiagram.push(['Name', 'Amount']);

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
        titleTextStyle: {fontSize: 30, bold: true}, 
        is3D: true,
        height: 300,
        width: 400
    };

    let chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
