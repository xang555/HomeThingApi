/**
 * Created by xang on 21/04/2017.
 */

var promise = require('bluebird');
var model = require('../database/model/homethingModel');
var firebasemanager = require('../core/firebase/firebasemanager')();
var _ = require('lodash');

function dbmanager() {

    /*admin add device*/
    this.adminAddSmartDevice = function (sdid,dtype) {

        return new promise(function (resove, reject) {

            var docs = {
                sdid : sdid,
                type : dtype
            }

            var devices = new model.smartdevicemodel(docs);

            devices.save().then(function (docs) {

                firebasemanager.addDeviceStatusStruc(docs.sdid,docs.type)
                    .then(function () {
                        resove(docs);
                    }).catch(function (err) {
                        reject(err);
                    });

            }).catch(function (err) {
                reject(err);
            });

        });

    }


    /*user sing up*/
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
                resolve(docs);
            }).catch(function (err) {
                reject(err);
            });


        });


    }


    /*user login*/
    this.userlogin = function ($uid) {

        return new promise(function (resolve, reject) {

            var users = model.usersmodel.findOne({uid : $uid});

            users.exec().then(function (docs) {
                resolve(docs);
            }).catch(function (err) {
                reject(err);
            });


        });

    }

    /* user add smart device*/
    this.UserAddSmartDevice = function ($sdid,$uid) {

        return new promise(function (resolve, reject) {

            var devices = model.smartdevicemodel.findOne({sdid : $sdid,regis : false});
            devices.select('sdid type regis');
            devices.exec().then(function (device) {

                if (!device) reject({error : "device is null"});

                device.regis = true;
                device.save().then(function (newdevice) {

                 var user = model.usersmodel.findOne({uid:$uid});

                 user.exec().then(function (userdoc) {

                     userdoc.device.push(newdevice);
                     userdoc.save().then(function (newuser) {
                        resolve(newdevice);
                     }).catch(function (err) {
                         reject(err);
                     });

                 }).catch(function (err) {
                    reject(err);
                 });


                }).catch(function (err) {
                    reject(err);
                });

            }).catch(function (err) {
                reject(err);
            })


        });


    }


    /*list of users smart devices*/
    this.ListUserSmartDevice = function ($uid) {

        return new promise(function (resolve, reject) {

            var user = model.usersmodel.findOne({uid : $uid});

            user.exec().then(function (user) {

                if (!user) return reject({errmsg : 'no user register'});

                resolve(user.device);

            }).catch(function (err) {
                reject(err);
            });

        });


    }


    /*user delete smart device*/
    this.userDeleteSmartDevice = function ($uid,$sdid) {

       return new promise(function (resolve, reject) {

           var user = model.usersmodel.findOne({uid : $uid});

           user.exec().then(function (userdoc) {

            if (!userdoc)  return reject({errmsg : 'user not found'});

           userdoc.device.remove({sdid : $sdid}).then(function (removeuser) {

               userdoc.save().then(function (newuser) {
                   resolve(newuser);
               }).catch(function (err) {
                   reject(err);
               });

           }).catch(function (err) {
               reject(err);
           });


           }).catch(function (err) {
            reject(err);
           });


       });

    }





}


module.exports = function () {
    return new dbmanager();
}