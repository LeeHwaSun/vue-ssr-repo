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
});