const fs = require("fs");
const deviceId = "1234";
const data = "Sent from 1234";
const config = JSON.parse(fs.readFileSync("config.json"));
const connectionString = config["connection-string"] + "DeviceId=" + deviceId;
const clientFromConnectionString = require("azure-iot-device-amqp")
    .clientFromConnectionString;
const client = clientFromConnectionString(connectionString);
const Message = require("azure-iot-device").Message;

const connectCallback = function (err) {
    if (err) {
        console.error("Error while connecting to IoT Hub", err);
        return
    }
    console.log("The device " + deviceId + " is connected successfully");
    var msg = new Message(data);
    client.sendEvent(msg, function (err) {
        if (err) {
            console.log("Error while sending the message", data);
            console.error("The error encountered", err);
        } else {
            console.log("Message sent successfully", data);
        }
    });
};

client.open(connectCallback);