
$(document).ready(function() {
    let chart; 
            
    inChart('line'); 

    $('#chartType').change(function() {
        const selectedType = $(this).val();
        inChart(selectedType); 
    });
    

    $('#backButton').click(function() {
        window.location.href = '/main';
    });
    function inChart(chartType) {
        $.ajax({
            url: "/active_cases_last_month",
            method: 'GET',
            success: function(data) {
                const ctx = $('#activeCasesChart').get(0).getContext('2d');

                if (chart) {
                    chart.destroy();
                }
                chart = new Chart(ctx, {
                    type: chartType, 
                    data: {
                        labels: data.map(item => item.date),
                        datasets: [{
                            label: 'Active COVID-19 Cases',
                            data: data.map(item => item.activeCases),
                            backgroundColor: 'rgba(0, 128, 0, 0.2)',
                            borderColor: 'rgba(0, 128, 0, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    }


});