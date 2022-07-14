const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/rapi',
        createProxyMiddleware({
            target: 'https://www.nihaoshijie.com.cn/rapi/',
            //   target: 'http://localhost:3001/rapi/',
            changeOrigin: true,
            pathRewrite: {
                '^/rapi': '/',
            },
        })
    )
}
