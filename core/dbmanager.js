/**
 * Created by xang on 21/04/2017.
 */

var promise = require('bluebird');
var model = require('../database/model/homethingModel');
var firebasemanager = require('./firebase/firebasemanager')();

function dbmanager() {

    this.adminAddSmartDevice = function (sdid,dtype) {

        return new promise(function (resove, reject) {

            var docs = {
                sdid : sdid,
                type : dtype,
            }

            var devices = new model.smartdevicemodel(docs);

            devices.save().then(function (docs) {
                resove(docs);
            }).catch(function (err) {
                reject(err);
            });

        });

    }


    this.userSigup = function ($uid, $uname, $passwd, $lname, $fname, $email) {

        return new promise(function (resolve, reject) {

            var docs = {

                uid: $uid,
                uname: $uname,
                passwd: $passwd,
                fname: $fname,
                lname: $lname,
                email: $email,
                device: []

            }

            var users = new model.usersmodel(docs);

            users.save().then(function (docs) {

                firebasemanager.createCustomToken(docs.uid)

                    .then(function (token) {
                        resolve(token);
                    }).catch(function (err) {
                        reject(err);
                      })

            }).catch(function (err) {
                reject(err);
            });


        });


    }




}


module.exports = function () {
    return new dbmanager();
}