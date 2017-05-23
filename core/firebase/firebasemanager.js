/**
 * Created by xang on 21/04/2017.
 */

var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');
var promise = require('bluebird');
var conf = require('../../config')();
var fcm = require('node-gcm');

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

        switch (parseInt($dtype)){

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


/*notification message and alert smartAlarm*/
this.FcmNotification = function ($sdid) {

return new promise(function (resolve, reject) {

    var sender = new fcm.Sender(conf.fcm.ServerApiKey);

    var message = new fcm.Message({
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data : {
            title : 'Homething Platform',
            content : 'Gas sensor detect Dangerous gas',
            subcontent : 'warning!! this notification is important. because your gas sensor detect Dangerous gas at your home. please care this notification'
        }

    });


    getdeviceregisters($sdid).then(function (registers) {

        sender.send(message, { registrationTokens: registers }, 10, function (err, response) {
            if(err) return reject(err);

            getSmartAlarmLinks($sdid).then(function (links) {

                for (var i =0 ;i < links.length ; i++){
                    AlertToSmartAlarm(links[i]).then(function () {
                     console.log('update alert to true');
                    }).catch(function (err) {
                        console.error(err);
                    })
                }

                resolve({notify : response , smartlarm : 'send alert to smart alarm is successfully'});

            }).catch(function (err) {
                reject(err);
            })

        });

    }).catch(function (err) {
        return reject(err);
    });


});


}


function getdeviceregisters($sdid) {

    return new promise(function (resolve, reject) {


        var ref = db.ref($sdid);
        var registerTokens = ref.child('sensor/alert');

        var registerdevicevalues = [];

        registerTokens.once('value',function (snapshot) {
            if (!snapshot) return reject([]);

            snapshot.forEach(function (data) {
                registerdevicevalues.push(data.val());
            });

            console.log(registerdevicevalues);

            resolve(registerdevicevalues);

        });

    });

}


function getSmartAlarmLinks($sdid) {

    return new promise(function (resolve, reject) {


        var ref = db.ref($sdid);
        var registerSmartAlarms = ref.child('sensor/SmartAlarmlinks');

        var smartlarmlinks = [];

        registerSmartAlarms.once('value',function (snapshot) {
            if (!snapshot) return reject([]);

            snapshot.forEach(function (data) {
                smartlarmlinks.push(data.val());
            });

            console.log(smartlarmlinks);
            resolve(smartlarmlinks);

        });

    });

}



function AlertToSmartAlarm($sdid) {

    return new promise(function (resolve, reject) {
        var ref = db.ref($sdid);
        ref.update({alert : true}).then(function () {
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
