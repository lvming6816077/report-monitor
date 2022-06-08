const str = ''+
'<div style="max-width: 600px;margin: 0 auto;">' +
    '<style>svg{width:400px;height:500px}</style>' +

    '<h2 style="text-align: center;">【Report Monitor】【监控告警】</h2>' +


    '<p>数据点code：<%code%></p>' +

    '<p>数据点描述：<%name%></p>' +

    '<p>告警信息：<%message%></p>' +

    '<p>实时数据：</p>' +

    '<p style="width:400px;height:500px"><svg style="width: 400px;height: 500px;"><%chartSvg%></svg></p>' +

    
    '<p style="margin-top:20px;">点击查看：<a href="https://report.nihaoshijie.com.cn">Report Monitor</a></p>' +

    '<p style="margin-top: 40px;text-align: right;">系统邮件，回复无效</p>' +

    '<p style="text-align: right;"><%date %></p>' +
'</div>'

export default function(locals) {
    var html = str.replace(/<%([^%>]+)?%>/g, function (s0, s1) {
        return new Function('locals', 'return locals.' + s1)(locals);
    });

    return html
}


