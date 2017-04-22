/**
 * Created by xang on 21/04/2017.
 */

var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');
var promise = require('bluebird');
var conf = require('../../config')();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://laothing-d014b.firebaseio.com"
});

var db = admin.database();


function firebasemanager() {

    /*add status */
this.addDeviceStatusStruc = function ($sdid,$dtype) {

    return new promise(function (resolve, reject) {

        var ref = db.ref($sdid);

        var $info = null;

        switch ($dtype){

            case 0 :
             $info = conf.device.smartSwitch;
             break;
            case 1 :
                $info = conf.device.tempSensor;
                break;
            case 2 :
                $info = conf.device.gass;
                break;
            case 3 :
                $info = conf.device.smartAlarm;
                break;

        }


        ref.set($info).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });

    });

}


}


module.exports = function () {
    return new firebasemanager();
}
