const json = require('./data/movies.json');
const Chart = require('chart.js');

const movieJSON = Object.entries(json)
const allBoxOfficeNumbers = Object.values(json);

const shortest = allBoxOfficeNumbers.reduce((a, c) => a.length > c.length ? c : a,
    { length: 1000 }
);

// const days = (array) => array.map((v, index) => index + 1)

const days = (array) => Array.from({ length: 30 }, (v, k) => k + 1)

const stringsToNumbers = (strings) => Number(strings.replace(/[^0-9\.-]+/g, ''));

// const slicer = (number, shortestArray) => number.slice(0, shortestArray);

const slicer = (number, shortestArray) => number.slice(0, 30);

const incrementalSums = (dailySums, emptyArray) => dailySums.reduce((previousValue, currentValue) => {
    const sum = previousValue + currentValue;
    emptyArray.push(sum);
    return sum;
}, 0);

const parseData = (data) => {
    const arrayToChart = [];
    const alignedBoxOfficeNumbers = slicer(data, shortest).map(stringsToNumbers);
    incrementalSums(alignedBoxOfficeNumbers, arrayToChart);
    return arrayToChart;
}

document.addEventListener('DOMContentLoaded', function () {
    Chart.defaults.global.defaultFontColor = '#ffffff';
    Chart.defaults.global.legend.labels.usePointStyle = true;

    const ctx = document.getElementById('myChart').getContext('2d');

    const createGradient = (gradientStart, gradientEnd) => {
        const gradient = ctx.createLinearGradient(0, 0, window.innerWidth || document.body.clientWidth, 0);
        gradient.addColorStop(0.000, `rgba(${gradientStart}, 1.000)`);
        gradient.addColorStop(1.000, `rgba(${gradientEnd}, 1.000)`);
        return gradient;
    }

    const gradient1 = createGradient('188,94,251', '252,70, 150');
    const gradient2 = createGradient('15,185,200', '0,212,255');
    const gradient3 = createGradient('255, 65, 108', '255, 75, 43');
    const gradient4 = createGradient('255, 183, 94', '237, 143, 3');

    const toolTipColors = ['#bc5efb', '#0fb9c8', '#ff416c', '#ed8f03'];

    const colors = [gradient1, gradient2, gradient3, gradient4];

    const dataToChart = movieJSON.map(([key, value], index) => {
        return {
            label: key,
            data: parseData(value),
            backgroundColor: [...colors][index],
            borderColor: [...colors][index],
            pointColor: [...colors][index],
            pointHoverBackgroundColor: [...colors][index]
        }
    })

    const chartData = {
        labels: days(shortest),
        datasets: dataToChart,
        type: 'line',
        borderWidth: 1
    }

    console.log(chartData);

    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: ['Star Wars Under Disney - Box Office Numbers'],
                fontSize: 24
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Days After Release',
                        fontSize: 18
                    },
                    ticks: {
                        fontSize: 18
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Cumulative Box Office Receipts (USD)',
                        fontSize: 14
                    },
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16,
                        callback: (value, index, values) => '$' + value.toLocaleString('en-US')
                    }
                }]
            },
            elements: {
                line: {
                    fill: false
                },
                point: {
                    hitRadius: 10,
                    hoverRadius: 10
                }
            },
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    fontSize: 16
                }
            },
            tooltips: {
                mode: 'index',
                intersect: true,
                itemSort: (a, b, data) => b.yLabel - a.yLabel,
                callbacks: {
                    title: ([tooltipItems], data) => 'Day ' + tooltipItems.xLabel,
                    label: (tooltipItems, data) => data.datasets[tooltipItems.datasetIndex].label + ': ' + '$' + tooltipItems.yLabel.toLocaleString('en-US'),
                    labelColor: (tooltipItems, chart) => {
                        return {
                            backgroundColor: [...toolTipColors][tooltipItems.datasetIndex]
                        }
                    }
                }
            }
        }
    });
});
