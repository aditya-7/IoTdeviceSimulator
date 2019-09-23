const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.1.json"));
const register_device = require("./register_device");
const send_message = require("./send_message");
const async = require("async");
const _ = require("lodash");

function simulate(deviceId, callback) {

    function simulate_attributes() {
        return {
            "macId": deviceId,
            "tstampval": Date.now(),
            "energy": (Math.random() * (0.0 - 1.0) + 1.0).toFixed(4)
        };
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
    }, config["message-interval-minutes"] * 60 * 1000);
}

function register_devices(devices) {
    _.forEach(devices.devices, deviceId => {
        register_device(config, deviceId, function (err) {
            if (err) {
                console.error(err);
                return
            }
        });
    });
}

function create_devices(devices) {
    const devices_simulation = [];
    for (var i = 1; i <= devices.length; i++) {
        devices_simulation.push(async.apply(simulate, devices[i]));
    }
    return devices_simulation;
}

fs.readFile('./devices.json', 'utf-8', (err, data) => {
    if (err) throw err;
    var devices = JSON.parse(data);
    switch (process.argv[2]) {
        case "REGISTER":
            register_devices(devices);
            break;
        case "SIMULATE":
            const devices_simulation = create_devices(config["number-of-devices"]);
            async.parallel(devices_simulation);
            break;
        default:
            console.log("Please provide valid argument");
    }
});

process.stdin.resume();