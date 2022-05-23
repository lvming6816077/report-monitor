# Report Monitor一款完整、高性能、高可用的打点监控和统计平台
[![Node](https://img.shields.io/badge/Node.js-v14.15.3-brightgreen)](https://nodejs.org/en/)
[![Nest](https://img.shields.io/badge/nestjs-7.5.1-brightgreen)](https://eggjs.org/)
[![Mongodb](https://img.shields.io/badge/mogodb-4.0+-brightgreen.svg?style=plastic)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/redis-5.0+-green.svg?style=plastic)](https://redis.io/)


# 技术栈

后端：Nest.js+TypeScript+MongoDB+Redis

前端：React.js+TypeScript

## 项目说明
* 项目已部署到正式环境，并已稳定运行一段时间，请放心使用。
* 前期推荐使用单机数据库或者Mongodb副本集架构，后期根据自身需求考虑是否使用集群分片
* 目前4核8G单机服务器大概能支撑每日50-100W的pv,8核16G单机服务器可支撑100W-500W的PV流量
* 项目后台查询性能增加合适的索引之后，千万以上的数据量可在100ms-2s之内查询出来，平均100-300ms(单机/副本集)

## 打点上报使用说明
### 浏览器

一行代码上报：
```javascript

const href = '网站域名'+'/rapi/report/create?code=xxxx'

new Image().src = href

or

navigator.sendBeacon(href)
```

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


### 启动

```bash

开发：npm run start:dev

生产：npm run build

```


## 展示效果

![](https://github.com/lvming6816077/report-monitor-server/blob/main/demo/localhost_3002_login.png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/demo/localhost_3002_%20(1).png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/demo/localhost_3002_%20(2).png)
![](https://github.com/lvming6816077/report-monitor-server/blob/main/demo/localhost_3002_.png)

### 交流和建议群
* 自发布以来有感兴趣的童鞋遇到了各种问题，大部分情况下是通过邮件进行沟通，为了方便解决大家部署中遇到的各种问题，下面贴出一个QQ交流群，有问题或者建议可提出。
![](https://qiniu.nihaoshijie.com.cn/qunmingp.jpg "")






