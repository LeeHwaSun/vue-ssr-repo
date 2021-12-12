const pm2 = require('pm2');

pm2.launchBus(function(err, pm2_bus) {
    /*pm2_bus.on('process:msg', function(packet) {
        console.log(packet);
    });*/
    pm2_bus.on('config:update', function({ data }) {
        if (data.cfg_client) {
            clientConfig[data.cfg_key] = data.cfg_val;
        } else {
            siteConfig[data.cfg_key] = data.cfg_val;
        }
    });

    pm2_bus.on('config:remove', function({ data }) {
        delete clientConfig[data];
        delete siteConfig[data];
    });

    pm2_bus.on('config:restart', function( packet ) {
        console.log("SERVER RESTART");
        const exec = require('child_process').exec();
        exec('pm2 reload all', (err) => {
            console.log("SERVER RESTART MSG :", err);
        })
    })
});