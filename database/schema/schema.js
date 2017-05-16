/**
 * Created by xang on 21/04/2017.
 */

var mongose = require("mongoose");
var schema = mongose.Schema;


var smartdevice = new schema( {
    sdid: String,
    type: Number,
    nicname : String,
    sharecode : String
});

var users = new schema(
    {
        uid: String,
        uname: String,
        fname: String,
        lname: String,
        email: String,
        device: [smartdevice]
    }

);

exports.users = users;
exports.smartdevice = smartdevice;
