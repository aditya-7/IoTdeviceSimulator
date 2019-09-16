const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.1.json"));
const register_device = require("./register_device");
const send_message = require("./send_message");
const async = require("async");

function simulate(deviceId, callback) {

    function simulate_attributes() {
        return {
            "deviceId": deviceId,
            "timestamp": Date.now()
        };
    }

    register_device(config, deviceId, function (err) {
        if (err) {
            console.error(err);
            return
        }
        setInterval(function () {
            const attributes = simulate_attributes();
            send_message(config, deviceId, JSON.stringify(attributes), function (err) {
                if (err) {
                    console.error(err);
                    return
                }
                console.log("Message sent to IoTHub");
                console.log("device= " + deviceId);
                console.log("message= ", attributes);
            });
        }, /*1 * 60 * */ 60 * 1000);
    });
}

function create_devices(n) {
    const devices_simulation = [];
    for (var i = 1; i <= n; i++) {
        var j = i;
        if (i < 10) j = "0000" + i;
        else if (i < 100) j = "000" + i;
        else if (i < 1000) j = "00" + i;
        else j = "0" + i;
        devices_simulation.push(async.apply(simulate, "energyconsmptiondev" + j));
    }
    return devices_simulation;
}

const devices_simulation = create_devices(100);
async.parallel(devices_simulation);

process.stdin.resume();