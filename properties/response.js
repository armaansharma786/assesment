
const constants                = require('./constants');

exports.actionCompleteResponse = actionCompleteResponse;
exports.sendError              = sendError;

function actionCompleteResponse(res, data, msg) {
    let response = {
      message: msg || constants.DEFAULT_RESPONSE_MESSAGE,
      status : constants.responseFlags.ACTION_COMPLETE,
      data   : data || {}
    };
    res.send(JSON.stringify(response));
}


function sendError(res, msg, data) {
  let response = {
    message:  msg || constants.ERROR_RESPONSE_MESSAGE,
    status : constants.responseFlags.ERROR_IN_EXECUTION,
    data   : data || {}
  };
  res.send(JSON.stringify(response));
}