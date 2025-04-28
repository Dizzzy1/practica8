document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chartForm');
    const chartSection = document.getElementById('chartSection');
    const backButton = document.getElementById('backButton');
    const dataInputs = document.getElementById('dataInputs');
    const periodType = document.getElementById('periodType');
    const addMonthBtn = document.getElementById('addMonthBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    let myChart = null;
    
    // Datos predefinidos para años
    const yearlyData = {
        labels: ['2021', '2022', '2023', '2024'],
        placeholder: 'Ingrese valor para el año'
    };
    
    // Manejar cambio en el tipo de periodo
    periodType.addEventListener('change', function() {
        const selectedPeriod = this.value;
        dataInputs.innerHTML = '';
        addMonthBtn.classList.add('hidden');
        clearDataBtn.classList.add('hidden'); // Oculta el botón limpiar
        
        if (selectedPeriod === 'yearly') {
            clearDataBtn.classList.remove('hidden'); // Muestra solo para anual
            createYearlyInputs();
        } else if (selectedPeriod === 'custom') {
            addMonthBtn.classList.remove('hidden');
            addCustomInput();
        }
    });
    
    // event listener para el botón limpiar:
    clearDataBtn.addEventListener('click', function() {
        document.querySelectorAll('#dataInputs input[type="number"]').forEach(input => {
            input.value = '';
        });
    });
    
    // Crear inputs para años predefinidos
    function createYearlyInputs() {
        yearlyData.labels.forEach((year, index) => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'data-input';
            
            const label = document.createElement('label');
            label.textContent = year;
            label.htmlFor = `data-${index}`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `data-${index}`;
            input.placeholder = yearlyData.placeholder;
            input.required = true;
            input.step = 'any';
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            dataInputs.appendChild(inputGroup);
        });
    }
    
    // Agregar input personalizado
    function addCustomInput(initial = false) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'data-input';
        
        const monthInput = document.createElement('input');
        monthInput.type = 'text';
        monthInput.placeholder = 'Nombre del mes';
        monthInput.required = initial;
        
        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.placeholder = 'Valor';
        valueInput.required = initial;
        valueInput.step = 'any';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Eliminar';
        removeBtn.onclick = function() {
            inputGroup.remove();
        };
        
        inputGroup.appendChild(monthInput);
        inputGroup.appendChild(valueInput);
        
        if (!initial) {
            inputGroup.appendChild(removeBtn);
        }
        
        dataInputs.appendChild(inputGroup);
    }
    
    // Botón para agregar más meses personalizados
    addMonthBtn.addEventListener('click', function() {
        addCustomInput();
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const chartType = document.getElementById('chartType').value;
        const period = document.getElementById('periodType').value;
        const title = document.getElementById('graphTitle').value;
        
        if (chartType && period && title) {
            const labels = [];
            const dataValues = [];
            
            if (period === 'yearly') {
                // Recoger datos para años
                yearlyData.labels.forEach((_, index) => {
                    const value = parseFloat(document.getElementById(`data-${index}`).value);
                    labels.push(yearlyData.labels[index]);
                    dataValues.push(isNaN(value) ? 0 : value);
                });
            } else {
                // Recoger datos personalizados
                const inputGroups = dataInputs.querySelectorAll('.data-input');
                inputGroups.forEach(group => {
                    const inputs = group.querySelectorAll('input');
                    const periodName = inputs[0].value;
                    const periodValue = parseFloat(inputs[1].value);
                    
                    if (periodName && !isNaN(periodValue)) {
                        labels.push(periodName);
                        dataValues.push(periodValue);
                    }
                });
            }
            
            if (labels.length > 0) {
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
            } else {
                alert('Por favor ingresa datos válidos');
            }
        }
    });
    
    // Botón para volver
    backButton.addEventListener('click', function() {
        chartSection.classList.add('hidden');
        form.classList.remove('hidden');
        if (myChart) {
            myChart.destroy();
        }
    });
    
    // Función para renderizar el gráfico
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}`;
                            }
                        }
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