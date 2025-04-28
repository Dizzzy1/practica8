document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chartForm');
    const chartSection = document.getElementById('chartSection');
    const backButton = document.getElementById('backButton');
    const dataInputs = document.getElementById('dataInputs');
    const periodType = document.getElementById('periodType');
    let myChart = null;
    
    const periods = {
        monthly: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        yearly: ['2018', '2019', '2020', '2021', '2022', '2023']
    };
    
    periodType.addEventListener('change', function() {
        const selectedPeriod = this.value;
        if (!selectedPeriod) return;
        
        dataInputs.innerHTML = '';
        
        periods[selectedPeriod].forEach((month, index) => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'data-input';
            
            const label = document.createElement('label');
            label.textContent = month;
            label.htmlFor = `data-${index}`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `data-${index}`;
            input.placeholder = 'Ingrese valor';
            input.required = true;
            input.step = 'any';
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            dataInputs.appendChild(inputGroup);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const chartType = document.getElementById('chartType').value;
        const period = document.getElementById('periodType').value;
        const title = document.getElementById('graphTitle').value;
        
        if (chartType && period && title) {
            const labels = periods[period];
            const dataValues = [];
            
            // Recoger los valores ingresados
            labels.forEach((_, index) => {
                const value = parseFloat(document.getElementById(`data-${index}`).value);
                dataValues.push(isNaN(value) ? 0 : value);
            });
            
            const chartData = {
                labels: labels,
                datasets: [{
                    label: title,
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };
            
            renderChart(chartType, chartData);
            form.classList.add('hidden');
            chartSection.classList.remove('hidden');
        }
    });
    
    backButton.addEventListener('click', function() {
        chartSection.classList.add('hidden');
        form.classList.remove('hidden');
        if (myChart) {
            myChart.destroy();
        }
    });
    
    function renderChart(type, data) {
        const ctx = document.getElementById('myChart').getContext('2d');
        
        if (myChart) {
            myChart.destroy();
        }
        
        myChart = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {   
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: data.datasets[0].label
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});