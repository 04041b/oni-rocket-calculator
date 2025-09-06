import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export function createChart(fuelData: number[], distanceData: number[], currentFuel: number) {
    // Create chart container
    const chartContainer = document.getElementById("chart");
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '<canvas id="fuel-distance-chart" width="800" height="400" class="w-full"></canvas>';
    
    const ctx = document.getElementById('fuel-distance-chart') as HTMLCanvasElement;
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    if (!context) return;
    
    // Destroy existing chart if it exists
    if ((window as any).fuelChart) {
        (window as any).fuelChart.destroy();
    }
    
    // Create datasets
    const chartData = fuelData.map((fuel, index) => ({
        x: fuel,
        y: distanceData[index]
    }));
    
    (window as any).fuelChart = new Chart(context, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Viable Distance',
                data: chartData,
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(37, 99, 235)',
                pointBorderColor: 'rgb(37, 99, 235)',
                pointRadius: 4,
                pointHoverRadius: 8,
                tension: 0.1,
                fill: false
            }, {
                label: 'Current Fuel',
                data: [{x: currentFuel, y: 0}, {x: currentFuel, y: Math.max(...distanceData)}],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Fuel Amount vs Viable Distance',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context: any) {
                            if (context.datasetIndex === 0) {
                                return 'Fuel: ' + context.parsed.x.toLocaleString() + ' kg, Distance: ' + Math.round(context.parsed.y).toLocaleString() + ' km';
                            }
                            return null;
                        },
                        title: function(context: any) {
                            return 'Rocket Performance';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: 'Fuel Amount (kg)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value: any) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: 'Distance (km)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value: any) {
                            return Math.round(value).toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}
