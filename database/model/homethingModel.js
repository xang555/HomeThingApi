/**
 * Created by xang on 21/04/2017.
 */

var Schema = require('../schema/schema');
var mongose = require("mongoose");

var smartdeviceModel = mongose.model('smartdevices',Schema.smartdevice); // smart device model
var usersModel = mongose.model('users',Schema.users); //user model

exports.usersmodel = usersModel;
exports.smartdevicemodel = smartdeviceModel;
