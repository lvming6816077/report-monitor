
<div align="center">
<img src="https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/logo.png" />
</div>

# 【Report Monitor】一款完整、高性能、高可用的打点监控和统计平台
[![Node](https://img.shields.io/badge/Node.js-v14.15.3-brightgreen)](https://nodejs.org/en/)
[![Nest](https://img.shields.io/badge/nestjs-7.5.1-brightgreen)](https://eggjs.org/)
[![Mongodb](https://img.shields.io/badge/mogodb-4.0+-brightgreen.svg?style=plastic)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/redis-5.0+-green.svg?style=plastic)](https://redis.io/)
[![React](https://img.shields.io/badge/React-17.0.0-brightgreen)](https://redis.io/)



## 技术栈

后端：Nest.js+TypeScript+MongoDB+Redis [传送门](https://github.com/lvming6816077/report-monitor-server/tree/main/report-monitor-server)

前端：React.js+Ant Design+TypeScript [传送门](https://github.com/lvming6816077/report-monitor-server/tree/main/report-monitor-frontend)

## 项目说明
* 项目已部署到正式环境，并已稳定运行一段时间，请放心使用。
* 前期推荐使用单机数据库或者Mongodb副本集架构，后期根据自身需求考虑是否使用集群分片
* 目前4核8G单机服务器大概能支撑每日50-100W的pv,8核16G单机服务器可支撑100W-500W的PV流量
* 项目后台查询性能增加合适的索引之后，千万以上的数据量可在100ms-2s之内查询出来，平均100-300ms(单机/副本集)

体验地址：[Report Monitor](https://report.nihaoshijie.com.cn)

## 项目设计思路

<div align="center">
<img src="https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/流程.png" />
</div>

## 打点上报使用说明
### 浏览器

参考上报[SDK](https://github.com/lvming6816077/report-monitor/tree/main/report-monitor-sdk)

### Java

```java

String href = '网站域名'+'/rapi/report/create?code=xxxx'
CloseableHttpClient httpclient = HttpClients.createDefault();
httpclient.execute(new HttpGet(href));

```

### python

```python
import  requests
href = '网站域名'+'/rapi/report/create?code=xxxx'
requests.get(href)

```

其他语言类似，只许发送一条简单的get请求。



## 项目部署和启动

### 安装mongoDB和Redis

MongoDB:

[Windows 平台安装 MongoDB](https://www.runoob.com/mongodb/mongodb-window-install.html)

[Linux 平台安装 MongoDB](https://www.runoob.com/mongodb/mongodb-linux-install.html)

Redis:

[Redis 安装](https://www.runoob.com/redis/redis-install.html)


### 启动(nestjs)

开发：

```bash

npm run start:dev

```

生产：

```bash

npm run build

```

## 展示效果

![](https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/localhost_3002_login.png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/localhost_3002_login1.png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/localhost_3002_%20(1).png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/localhost_3002_%20(2).png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/report-monitor-server/demo/report.nihaoshijie.com.cn_speed_speedlist.png)

## 交流和建议

相关建议+共同开发联系：*441403517@qq.com*

## License

MIT




