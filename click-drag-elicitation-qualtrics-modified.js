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

        let history = [];
        function liveSend(data) {
            history.push(data);
            console.log(history);
        }

        let min = 0;
        let max = 1;

        let step_tick;
        let nb_bins;
        let model_data;
        let min_tick;

        nb_bins = js_vars.nb_bins;
        min_tick = js_vars.min;
        step_tick = js_vars.step;
        model_data = [1, 0];

        let step = (max - min) / (nb_bins - 1);

        let zoom_area = 1.1;
        let startdate;
        let max_val = 1;

        let bins = [];

        let score = 0;

        let point_r = 10; //px

        let sent = false;

        function computevalue(sub) {
            let val = Math.round(100 * (1 - sub.reduce((a, b) => a + b, 0)));
            if (val > 0) {
                return val;
            } else {
                return 0;
            }
        }

        function senddata(delay_ms, serie) {
            liveSend({
                delay_ms: delay_ms,
                xData: serie.xData,
                yData: serie.yData
            });
        }

        function send_first() {
            if (sent == false) {
                senddata(0, chart.series[1]);
                sent = true;
            }
        }

        function settocurve() {
            mode = "curve";

            chart.series[1].setState("inactive", true);

            $('#bins_container').hide();

            chart.series[0].update({
                marker: {
                    enabled: true
                },
                opacity: 0.7,
                dragDrop: {
                    draggableY: true,
                    draggableX: true
                }
            });
        }

        function bindata() {
            let data = [];
            for (i = 0; i < nb_bins; i = i + 1) {
                data.push(0);
            }
            return data;
        }

        function bindata_xy() {
            let data = [];
            for (i = 0; i < nb_bins; i = i + 1) {
                let x = min + i * step;
                data.push([x, 0]);
            }
            return data;
        }

        let initdataspline = [
            [min, 0],
            [max, 0]
        ];
        let initsaved = [[initdataspline.slice(), bindata()]];
        let saved = initsaved.slice();

        function save() {
            senddata(Date.now() - startdate, chart.series[1]);

            let lastserie0 = [];
            let lastserie1 = [];

            chart.series[0].data.forEach(function (i) {
                lastserie0.push([i.x, i.y]);
            });
            chart.series[1].data.forEach(function (i) {
                lastserie1.push([i.x, i.y]);
            });

            saved.push([lastserie0, lastserie1]);

            if (saved.length > 0) {
                $('.undo').eq(chartIndex).prop("disabled", false);
                $('.reset').eq(chartIndex).prop("disabled", false);
            }
        }

        function drawChart(parameters) {
            if (parameters) {
                js_vars = parameters;
            }
            nb_bins = js_vars.nb_bins;
            step = (max - min) / (nb_bins - 1);

            let container = $(".chart")[chartIndex];

            chart = new Highcharts.Chart({
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
                xAxis: [
                    {
                        id: 'first',
                        linkedTo: 1,
                        visible: false
                    },
                    {
                        id: 'second',
                        visible: true,
                        title: {
                            text: js_vars.xAxisTitle
                        },
                        labels: {
                            formatter: function () {
                                let labels = ['Label1', 'Label2', 'Label3', 'Label4', 'Label5', 'Label6', 'Label7', 'Label8', 'Label9'];
                                let index = Math.round(this.value / step);
                                return labels[index] || '';
                            },
                            style: {
                                fontSize: '9px'
                            },
                            y: 30
                        },
                        min: min,
                        max: max
                    }
                ],
                yAxis: {
                    visible: true,
                    title: {
                        text: js_vars.yAxisTitle
                    },
                    labels: {
                        formatter: function () {
                            return Math.round(100 * this.value) + " %";
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
                        data: initdataspline.slice(),
                        zIndex: 3,
                        type: "line",
                        xAxis: 'first',
                        dashStyle: 'dot',
                        opacity: 0.7
                    },
                    {
                        data: bindata_xy(),
                        type: 'column',
                        xAxis: 'second',
                        zIndex: 2
                    }
                ]
            });

            settocurve();
        }

        drawChart();
    }
});
