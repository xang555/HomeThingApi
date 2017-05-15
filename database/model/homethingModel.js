/**
 * Created by xang on 21/04/2017.
 */

var Schema = require('../schema/schema');
var mongose = require("mongoose");

var smartdeviceModel = mongose.model('smartdevices',Schema.smartdevice); // smart device model
var usersModel = mongose.model('users',Schema.users); //user model
var permissionModel = mongose.model('permission',Schema.permission);

exports.usersmodel = usersModel;
exports.smartdevicemodel = smartdeviceModel;
exports.permissionmodel = permissionModel;