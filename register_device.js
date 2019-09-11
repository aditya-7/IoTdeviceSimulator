// Parameters to be passed for registration of device: deviceId
const deviceId = "test-device-a23k";

var crypto = require("crypto");
var ProvisioningTransport = require("azure-iot-provisioning-device-amqp").Amqp;
var SymmetricKeySecurityClient = require("azure-iot-security-symmetric-key").SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require("azure-iot-provisioning-device").ProvisioningDeviceClient;
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

const provisioningHost = config["provisioning-host"];
const idScope = config["provisioning-id-scope"];
var registrationId = deviceId;
var symmetricKey = config["symmetric-key"];

function computeDerivedSymmetricKey(masterKey, regId) {
  return crypto.createHmac("SHA256", Buffer.from(masterKey, "base64"))
    .update(regId, "utf8")
    .digest("base64");
}

var symmetricKey = computeDerivedSymmetricKey(symmetricKey, registrationId);
var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
var provisioningClient = ProvisioningDeviceClient.create(
  provisioningHost,
  idScope,
  new ProvisioningTransport(),
  provisioningSecurityClient
);

provisioningClient.register(function (err, result) {
  if (err) {
    console.error("error registering device ", err);
  } else {
    console.log("registration succeeded");
    console.log("assigned hub= " + result.assignedHub);
    console.log("deviceId= " + result.deviceId);
  }
});