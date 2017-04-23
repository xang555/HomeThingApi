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
                type : dtype,
                regis : false
            }

            var devices = model.smartdevicemodel;

            devices.update({sdid : sdid},docs,{upsert:true}).then(function (update) {

                console.log(update);

                if (_.isEqual(update.ok,1)){
                    firebasemanager.addDeviceStatusStruc(sdid,dtype)
                        .then(function () {
                            resove(docs);
                        }).catch(function (err) {
                        reject(err);
                    });
                }else
                {
                    reject({msg : 'add device fail'});
                }


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

                if (!device) reject({error : "device is null "});

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
           var user = model.usersmodel;
           user.update({uid : $uid},{$pull:{device:{sdid:$sdid}}},function (err, newuser) {
               if (err) return reject(err);
               resolve(newuser);
           });
       });

    }


    /* admin delete smart device */
    this.adminDeleteSmartDevice = function ($sdid) {

        return new promise(function (resolve, reject) {

            var smartdevice = model.smartdevicemodel;
            
            smartdevice.remove({sdid : $sdid}).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });

        });

    }


    /* admin update smart device */
    this.adminUpdateSmartDevice = function ($sdid,$type) {

        return new promise(function (resolve, reject) {
            var smartdevice = model.smartdevicemodel;
            smartdevice.update({sdid : $sdid},{$set:{type:$type}}).then(function (update) {

                if (_.isEqual(update.ok,1)) {

                    firebasemanager.addDeviceStatusStruc($sdid,$type).then(function () {
                        resolve(update);
                    }).catch(function (err) {
                        reject(err);
                    });

                }else {
                    reject({msg : 'update device fail'});
                }


            }).catch(function (err) {
               reject(err);
            });

        });

    }


    /* get user information */
    this.getUserProfile = function ($uid) {

        return new promise(function (resolve, reject) {

            var user = model.usersmodel.findOne({uid:$uid});

            user.select('uid uname fname lname email');

            user.exec().then(function (user) {
                if (!user) return reject({msg : 'user not fount'});
                resolve(user);
            }).catch(function (err) {
               reject(err);
            });

        });


    }





}


module.exports = function () {
    return new dbmanager();
}