const echarts = require('echarts');
import * as moment from 'moment'


export const makeCharts = function(_data){

    const xAxis = _data.map((i) => {
        return i.time
    })
    const yAxis = _data.filter((i) => {
        return moment().isAfter(moment(i.time))
    }).map((i) => {
        return i.total
    })

    const option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            axisLabel: {
                formatter: (v)=>{

                    return v
                },
            }
        },

        series: [
            {
                name: '次数',
                type: 'line',
                symbol: 'none',
                // sampling: 'lttb',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },

                data: yAxis
            }
        ]
    };


    // 在 SSR 模式下第一个参数不需要再传入 DOM 对象
    const chart = echarts.init(null, null, {
        renderer: 'svg', // 必须使用 SVG 模式
        ssr: true, // 开启 SSR
        width: 400, // 需要指明高和宽
        height: 500
    });
    
    // 像正常使用一样 setOption
    chart.setOption(option);
    
    // 输出字符串
    const svgStr = chart.renderToSVGString();
    // chart

    return svgStr
}