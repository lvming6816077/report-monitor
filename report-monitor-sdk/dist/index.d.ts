export interface Options {
    appid: string;
    reportLogUrl: string;
    reportUrl: string;
    reportSpeedUrl: string;
    host: string;
}
export interface SpeedCodeType {
    code: string;
    d: number;
}
export default class ReportSDK {
    option: Options;
    constructor(config: Options);
    init(): this;
    private sendImage;
    private sendPost;
    reportLog(data?: any): void;
    reportEvent(code: string, data: any): void;
    reportSpeed(data: SpeedCodeType): void;
}
