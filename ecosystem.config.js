// 서버 무중단 배포용 파일
module.exports = {
    apps : [{
        name: "mydiary",
        script : "./server/server.js",
        instances : 2,
        exec_mode : 'cluster',
        wait_ready : true,
        listen_timeout : 60000,
        kill_timeout : 5000,
    }]
}