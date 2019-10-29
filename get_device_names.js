const csvdata = require("csvdata");
const fs = require("fs");

function writeToDevice() {
    csvdata
        .load("./daily_dataset.csv", {
            objName: "LCLid"
        })
        .then(function (data) {
            var keys = Object.keys(data);
            keys = keys.filter(function (elem, pos) {
                return keys.indexOf(elem) == pos;
            });
            fs.writeFile("devices.json", JSON.stringify({
                "devices": keys
            }), function (err) {
                if (err) throw err;
                console.log('Wrote to devices.json');
            });
        });
}

function calculateDeviceCount() {
    fs.readFile('./devices.json', 'utf-8', (err, data) => {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        console.log("Device count=" + jsonData.devices.length);
    });
}

function randomizer() {
    console.log("random", (Math.random() * (0.0 - 1.0) + 1.0).toFixed(4));
}
// calculateDeviceCount();
// randomizer();

console.log("command line args", process.argv[2]);