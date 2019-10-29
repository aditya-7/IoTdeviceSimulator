var client;

function get_client(config, deviceId) {
    const connectionString = config["connection-string"] + "DeviceId=" + deviceId;
    const clientFromConnectionString = require("azure-iot-device-amqp")
        .clientFromConnectionString;
    client = clientFromConnectionString(connectionString);
}

function send(deviceId, data, callback) {
    const Message = require("azure-iot-device").Message;
    const connectCallback = function (err) {
        if (err) {
            console.error("Error while connecting to IoT Hub", err);
            return callback(new Error("Connection to device " + deviceId + " failed"));
        }
        console.log("The device " + deviceId + " is connected successfully");
        var msg = new Message(data);
        client.sendEvent(msg, function (err) {
            if (err) {
                console.log("Error while sending the message", data);
                console.error("The error encountered", err);
                return callback(new Error("Sending message to device " + deviceId + " failed"));
            }
            console.log("Message sent successfully", data);
            return callback(null);
        });
    };

    client.open(connectCallback);
}

module.exports = {
    "send": send,
    "get_client": get_client
};