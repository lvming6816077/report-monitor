
export interface Options {

    appid: string;

    reportLogUrl: string;

    reportUrl:string;

    reportSpeedUrl:string;

    host:string

}

export interface EventCodeType {

    code: string;

    data?:any

}

export interface SpeedCodeType {

    code: string;

    d:number

}

const base = 'https://report.nihaoshijie.com.cn'

const REPORTLOG_DETAULT_URL = base+'/rapi/log/create'
const REPORT_DETAULT_URL = base+'/rapi/report/create'
const REPORTSPEED_DETAULT_URL = base+'/rapi/report/createspeed'

const default_o:Options = {
    appid:'',
    host:'',
    reportLogUrl:REPORTLOG_DETAULT_URL,
    reportUrl:REPORT_DETAULT_URL,
    reportSpeedUrl:REPORTSPEED_DETAULT_URL

}
export default class ReportSDK {
    option:Options
    constructor(config:Options){

      this.option = {...default_o,...config};
    }

    init(){
        return this
    }
    private sendImage(url:string){
        if (!(window.location.host == this.option.host)) return
        new Image().src = url
    }
    private sendPost(url:string,data:any){
        if (!(window.location.host == this.option.host)) return
        var client = new XMLHttpRequest();
        client.open("POST", url);
        client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        client.setRequestHeader("cookies", document.cookie);
        client.send(JSON.stringify(data));
    }
    reportLog(data:any = {}){
        let appid = this.option.appid
        let reportLogUrl = this.option.reportLogUrl
        this.sendPost(reportLogUrl+'/'+appid,data)
    }
    reportEvent(data:EventCodeType){
        let reportUrl = this.option.reportUrl
        // 带数据的统计上报
        if (data.data) {
            this.sendPost(reportUrl,data.data)
        } else {
            this.sendImage(reportUrl+'?code='+data.code)
        }
    }
    reportSpeed(data:SpeedCodeType){
        let reportSpeedUrl = this.option.reportSpeedUrl
        this.sendImage(reportSpeedUrl+'?code='+data.code+'&d='+data.d)
    }

  }



