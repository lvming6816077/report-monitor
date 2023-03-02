
<div align="center">
<img src="https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/logo.png" />
</div>

# 【Report Monitor】web端上报专用Sdk


## 使用方法

在HTML中引入

```
<script src="./dist/index.umd.js"></script>

const reportUtil = new ReportSDK({appid:'xxx',host:'www.xx.com'})


reportUtil.reportLog(data:any) // 日志上报


reportUtil.reportEvent(code:string,data?:any) // 自定义事件上报

SpeedCodeType {
    code: string;
    d:number;

}
reportUtil.reportSpeed(SpeedCodeType) // 测速上报

```



## 交流和建议

相关建议+共同开发联系：*441403517@qq.com*

## License

MIT




