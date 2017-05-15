/**
 * Created by xang on 21/04/2017.
 */

var mongose = require("mongoose");
var schema = mongose.Schema;


var smartdevice = new schema( {
    sdid: String,
    type: Number,
    nicname : String,
    regis: {type : Boolean , default : false}
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

var permission = new schema({
    sdid:String,
    pcode : String
});


exports.users = users;
exports.smartdevice = smartdevice;
exports.permission = permission;
