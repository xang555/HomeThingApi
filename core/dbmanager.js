/**
 * Created by xang on 21/04/2017.
 */

var promise = require('bluebird');
var model = require('../database/model/homethingModel');


function dbmanager() {

    this.adminAddSmartDevice = function (sdid,dtype,qrcode) {

        return new promise(function (resove, reject) {

            var docs = {
                sdid : sdid,
                type : dtype,
                qrcode : qrcode
            }

            var devices = new model.smartdevicemodel(docs);

            devices.save().then(function (docs) {
                resove(docs);
            }).catch(function (err) {
                reject(err);
            });

        });

    }

}


module.exports = function () {
    return new dbmanager();
}