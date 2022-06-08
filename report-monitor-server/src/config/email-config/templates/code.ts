const str = ''+
'<div>' +
    '验证码：<%s2msCode%>，5分钟内有效，请务回复，祝您愉快！'+
'</div>'

export default function(locals) {
    var html = str.replace(/<%([^%>]+)?%>/g, function (s0, s1) {
        return new Function('locals', 'return locals.' + s1)(locals);
    });

    return html
}


