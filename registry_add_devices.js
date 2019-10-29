const iothub = require('azure-iothub');
const uuid = require('uuid');
const _ = require("lodash");

function register(config, devices) {
  var connectionString = config["connection-string"];
  var registry = iothub.Registry.fromConnectionString(connectionString);
  deviceAddArray = _.map(devices, (item) => {
    return {
      deviceId: item,
      authentication: {
        symmetricKey: {
          primaryKey: Buffer.from(uuid.v4()).toString('base64'),
          secondaryKey: Buffer.from(uuid.v4()).toString('base64')
        }
      }
    };
  });
  // There is a limit for the maximum devices that can be registered in bulk (100)
  deviceAddArray = _.chunk(deviceAddArray, 100);
  _.forEach(deviceAddArray, (arr) => {
    registry.addDevices(arr, printAndContinue('adding', function next() {
      console.log("Registered 100 devices");
    }));
  });
}

function printAndContinue(op, next) {
  return function printResult(err, resultData) {
    if (err) console.error(op + ' error: ' + err.toString());
    if (resultData) {
      var arrayString = resultData.errors.length === 0 ? 'no errors' : JSON.stringify(resultData.errors);
      console.log(op + ' isSuccessful: ' + resultData.isSuccessful + ', errors returned: ' + arrayString);
    }
    if (next) next();
  };
}

module.exports = register;