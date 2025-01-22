$(document).ready(function () {
    $('.chart').each(function (index) {
        chart(index, $(this).data());
        $(this).before('<div style="text-align: right;"><button class="undo btn btn-warning mx-1" disabled type="button">Undo</button><button class="reset btn btn-danger mx-1" disabled type="button">Reset</button></div>');
        $(this).after('<div class="mt-2" style="text-align: center;margin-left:50px"><a class="SubmitDistribution btn btn-success">Submit the distribution</a></div>');
    });

    function chart(chartIndex, params) {
        let js_vars = {
            nb_bins: Number(params.n_bins),
            min: Number(params.min),
            step: Number(params.step),
            xAxisTitle: params.x_axis_title,
            yAxisTitle: params.y_axis_title,
            yMax: Number(params.y_max),
            xUnit: params.x_unit,
            DistributionResult: params.distribution_result,
            DistributionYData: params.distribution_ydata,
            DistributionXData: params.distribution_xdata,
            DistributionHistory: params.distribution_history
        };

        let step = (1 - 0) / (js_vars.nb_bins - 1);

        function drawChart(parameters) {
            if (parameters) {
                js_vars = parameters;
                step = (1 - 0) / (js_vars.nb_bins - 1);
            }

            let container = $(".chart")[chartIndex];

            new Highcharts.Chart({
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: container,
                    className: 'pointChart',
                    margin: [10, 20, 60, 60]
                },
                title: {
                    text: ''
                },
                xAxis: [{
                    id: 'first',
                    linkedTo: 1,
                    visible: false
                }, {
                    id: 'second',
                    visible: true,
                    title: {
                        text: js_vars.xAxisTitle
                    },
                    tickPositions: Array.from({ length: js_vars.nb_bins }, (_, i) => js_vars.min + i * step),
                    labels: {
                        formatter: function () {
                            let labels = ['Label1', 'Label2', 'Label3', 'Label4', 'Label5', 'Label6', 'Label7', 'Label8', 'Label9'];
                            let index = Math.round(this.value / step);
                            if (index >= 0 && index < labels.length) {
                                return labels[index];
                            } else {
                                return '';
                            }
                        },
                        style: {
                            fontSize: '9px'
                        },
                        y: 30
                    },
                    min: 0,
                    max: 1
                }],
                yAxis: {
                    visible: true,
                    title: {
                        text: js_vars.yAxisTitle
                    },
                    labels: {
                        formatter: function () {
                            return Math.round(100 * this.value) + ' %';
                        },
                        style: {
                            fontSize: '10px'
                        },
                        x: -10
                    },
                    tickInterval: 0.05,
                    min: 0
                },
                series: [
                    {
                        data: Array.from({ length: js_vars.nb_bins }, (_, i) => [js_vars.min + i * step, 0]),
                        zIndex: 3,
                        type: 'line',
                        xAxis: 'first',
                        dashStyle: 'dot',
                        opacity: 0.7
                    },
                    {
                        data: Array.from({ length: js_vars.nb_bins }, (_, i) => [js_vars.min + i * step, 0]),
                        type: 'column',
                        xAxis: 'second',
                        zIndex: 2
                    }
                ]
            });
        }

        drawChart();
    }
});
