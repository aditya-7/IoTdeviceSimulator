function register(config, registrationId, callback) {

  var crypto = require("crypto");
  var ProvisioningTransport = require("azure-iot-provisioning-device-amqp").Amqp;
  var SymmetricKeySecurityClient = require("azure-iot-security-symmetric-key").SymmetricKeySecurityClient;
  var ProvisioningDeviceClient = require("azure-iot-provisioning-device").ProvisioningDeviceClient;

  const provisioningHost = config["provisioning-host"];
  const idScope = config["provisioning-id-scope"];
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
      return callback(new Error("Registration of device " + registrationId + " failed"));
    }
    console.log("registration succeeded");
    console.log("assigned hub= " + result.assignedHub);
    console.log("deviceId= " + result.deviceId);
    return callback(null);
  });

}

module.exports = register;