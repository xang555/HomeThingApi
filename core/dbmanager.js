/**
 * Created by xang on 21/04/2017.
 */

var promise = require('bluebird');
var model = require('../database/model/homethingModel');
var firebasemanager = require('../core/firebase/firebasemanager')();
var _ = require('lodash');
var config = require('../config')();

function dbmanager() {

    /*admin add device*/
    this.adminAddSmartDevice = function ($sdid,$dpasswd,$dtype) {

        return new promise(function (resove, reject) {

            var device = model.smartdevicemodel.findOne({sdid:$sdid});

            device.exec().then(function (device) {

             if (device) return reject({msg:"device already exist"});

              if (parseInt($dtype) < 0 || parseInt($dtype) > 4) return reject({msg:"no device type"});

                var dname = "";
                switch (parseInt($dtype)){
                    case 0:
                        dname = "Smart Switch";
                        break;
                    case 1 :
                        dname = "Temp and Humi";
                        break;
                    case 2 :
                        dname = "Gas Sensor";
                        break;
                    case 3 :
                        dname = "Smart Alarm";
                        break;
                    case 4 :
                        dname = "Smart Plug";
                        break;

                }

                var docs = {
                    sdid : $sdid,
                    type : $dtype,
                    dname : dname,
                    dpasswd : $dpasswd
                };

                var devices = model.smartdevicemodel;

                devices.update({sdid : $sdid},docs,{upsert:true}).then(function (update) {

                    console.log(update);

                    if (_.isEqual(update.ok,1)){
                        resove(docs);
                    }else {
                        reject({msg : 'add device fail'});
                    }

                }).catch(function (err) {
                    reject(err);
                });

            }).catch(function (err) {
                reject(err);
            });

        });

    };


    /*user sing up*/
    this.userSigup = function ($uid, $uname,$password, $lname, $fname, $email) {

        return new promise(function (resolve, reject) {

         var user = model.usersmodel.findOne({$or:[{uname: $uname},{email:$email}]});

             user.exec().then(function (user) {

                 if (user) return reject({ecode: config.UNAME_AND_EMAIL_EXIT});

                 var docs = {

                     uid: $uid,
                     uname: $uname,
                     passwd: $password,
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


             }).catch(function (err) {
                 reject(err);
             });

        });


    }


    /*user login*/
    this.userlogin = function ($ure,$hashpasswd) {

        return new promise(function (resolve, reject) {

            var users = model.usersmodel.findOne({passwd:$hashpasswd,$or:[{uname:$ure},{email:$ure}]});

            users.exec().then(function (docs) {
                resolve(docs);
            }).catch(function (err) {
                reject(err);
            });

        });

    };

    /* user add smart device*/
    this.UserAddSmartDevice = function ($sdid,$dpasswd,$uid) {

        return new promise(function (resolve, reject) {

            var devices = model.smartdevicemodel.findOne({sdid : $sdid,dpasswd : $dpasswd});
            devices.select('sdid type dname dpasswd');
            devices.exec().then(function (device) {

                if (!device) return reject({error : "device is null "});

                var user = model.usersmodel.findOne({uid:$uid,"device.sdid":$sdid});

                user.exec().then(function (userdoc) {

                    if (!_.isEmpty(userdoc)) return reject({errcode : 400,errmsg:'device already'});

                    var newusermodel = model.usersmodel.findOne({uid:$uid});

                    newusermodel.exec().then(function (newuser) {

                        newuser.device.push(device);
                        newuser.save().then(function (dcos) {
                          resolve(device);
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


    };


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


    };


    /*user delete smart device*/
    this.userDeleteSmartDevice = function ($uid,$sdid) {

       return new promise(function (resolve, reject) {
           var user = model.usersmodel;
           user.update({uid : $uid},{$pull:{device:{sdid:$sdid}}},function (err, update) {
               if (err) return reject(err);
               if (update.nModified === 0) return reject({errmsg : 'Smart device not fond'});
                resolve(update);
           });
       });

    };


    /* user update smart device */
    this.userUpdateSmartDevice = function ($uid,$sdid, $dname) {

      return new promise(function (resolve, reject) {

          var user = model.usersmodel;

          user.update({"uid" : $uid,"device.sdid" : $sdid},{"$set" : {"device.$.dname":$dname}},function (err, update) {

              console.log(update);

              if (err) return reject(err);
              if (update.nModified === 0) return reject({errmsg : 'no modify Smart device'});

              if (_.isEqual(update.ok,1)) {
                  resolve(update);
              }

          });

      });

    };

    /*-------------------- admin ----------------------------*/

    /* admin delete smart device */
    this.adminDeleteSmartDevice = function ($sdid) {

        return new promise(function (resolve, reject) {

            var smartdevice = model.smartdevicemodel;
            
            smartdevice.remove({sdid : $sdid}).then(function (del) {
                resolve(del.result);
            }).catch(function (err) {
                reject(err);
            });

        });

    };


    /* admin update smart device type*/
    this.adminUpdateSmartDeviceType = function ($sdid, $dtype) {

        return new promise(function (resolve, reject) {

            if (parseInt($dtype) < 0 || parseInt($dtype) > 4) return reject({msg:"no device type"});

            var smartdevice = model.smartdevicemodel;

            var dname = "";
            switch (parseInt($dtype)){
                case 0:
                    dname = "Smart Switch";
                    break;
                case 1 :
                    dname = "Temp and Humi";
                    break;
                case 2 :
                    dname = "Gas Sensor";
                    break;
                case 3 :
                    dname = "Smart Alarm";
                    break;
                case 4 :
                    dname = "Smart Plug"

            }

            smartdevice.update({sdid : $sdid},{$set:{type:$dtype,dname:dname}}).then(function (update) {

                if (_.isEqual(update.ok,1)) {
                    resolve(update);
                }else {
                    reject({msg : 'update device fail'});
                }

            }).catch(function (err) {
               reject(err);
            });

        });

    };


    /* admin change password smartdevice */
    this.adminChangePasswdSmartDevice = function ($sdid,$olddpasswd,$newdpasswd) {

        return new promise(function (resolve, reject) {

            var smartdevice = model.smartdevicemodel.findOne({sdid: $sdid});

            smartdevice.exec().then(function (device) {

                if (!_.isEqual(device.dpasswd,$olddpasswd)) return reject({ecode : config.OLD_PASSWORD_NOT_MATCH});

                var smartdevice = model.smartdevicemodel;
                smartdevice.update({sdid : $sdid},{$set:{dpasswd : $newdpasswd}}).then(function (update) {

                    if (_.isEqual(update.ok,1)) {
                        resolve(update);
                    }else {
                        reject({msg : 'change password fail'});
                    }

                }).catch(function (err) {
                    reject(err);
                });

            }).catch(function (err) {
                reject(err);
            });

        });

    };


    /*admin lists smart devices*/
    this.adminListSmartDevices = function () {

        return new promise(function (resolve, reject) {

            var smartdevices = model.smartdevicemodel.find({});
            smartdevices.exec().then(function (devices) {
                resolve(devices);
            }).catch(function (err) {
                reject(err);
            });

        });

    };


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