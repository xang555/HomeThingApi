"use strict";

var express = require('express');
var homethingModel = require('../database/model/homethingModel');
var router = express.Router();
var jwt = require('jsonwebtoken');
var  conf = require('../config')();
var expressJwt = require('express-jwt');
var dbmanager = require('../core/dbmanager')();
var _ = require('lodash');
var firebasemanager = require('../core/firebase/firebasemanager')();
var sha256 = require('crypto-js/sha256');

/*------------------------------- admin level ---------------------------*/

/* add smart device for admin only */
router.post('/admin/device/add',expressJwt({secret: conf.jwt.AdminPrivateKey}), function(req, res, next) {

    if (!req.user.uadmin) {
        return res.json({err:401,msg : 'authentication unsuccessfully'});
    }

    var sdid = req.body.sdid;
    var  dtype = req.body.dtype;
    var dpasswd = req.body.dpasswd;

    if (! _.isEmpty(sdid) && ! _.isEmpty(dtype) && !_.isEmpty(dpasswd)){

        var hashDpasswd = sha256(dpasswd);

        dbmanager.adminAddSmartDevice(sdid,hashDpasswd.toString(),dtype)
            .then(function (docs) {
                res.json({err : 0, message : 'add smart device successfully',qrcode : sdid});
            }).catch(function (err) {
                console.error(err);
            res.status(403).json({err : 1, message : err});
            });

    }else {
        // if empty data
        res.status(403).json({err : 1, message : 'empty some device information'});
    }

});

/* admin login */
router.post('/admin/login',function (req, res, next) {

    var  user = req.body.user;
    var passwd = req.body.passwd;

    var hashuser = sha256(user);

    if (user === conf.admin.user && passwd === conf.admin.passwd){

        var payload = {
            uadmin : hashuser.toString()
        }

        jwt.sign(payload,conf.jwt.AdminPrivateKey,{expiresIn:24*60*60},function (err, token) {

            if (err) {
                return res.status(500).json({err : 1 , token : ""});
            }

            res.status(200).json({err : 0 , token : token});

        });

    }else {
        res.status(500).json({err : 1 , token : ""});
    }

});

router.delete('/admin/device/delete',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }

    var $sdid = req.body.sdid;

    if (_.isEmpty($sdid)) return res.status(400).json({err : 1 , msg : 'empty parameter'});


    dbmanager.adminDeleteSmartDevice($sdid).then(function (del) {

        if(del.ok == 1 && del.n == 1){
            res.json({err:0,msg:'delete smart device successfully'});
        }else {
            res.json({err:1,msg:'delete smart device unsuccessfully, No smart devices'});
        }

    }).catch(function (err) {
        res.status(403).json({err:1,msg:err});
    });


});

/* admin update smartdevice type */
router.post('/admin/device/update/type',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }

    var $sdid = req.body.sdid;
    var $dtype = req.body.dtype;

    if (_.isEmpty($sdid)) return res.status(403).json({err:1,msg : 'no specify smartdevice'});

    dbmanager.adminUpdateSmartDeviceType($sdid,$dtype).then(function (update) {
        res.json({err : 0 , msg : 'update smartdevice type successfully'});
    }).catch(function (err) {
        res.status(403).json({err : 1 , msg : 'update smartdevice type failure',issue : err});
    });

});


/* admin change password smartdevice */
router.post('/admin/device/update/dpasswd',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }

    var $sdid = req.body.sdid;
    var $newdpasswd = req.body.newdpasswd;
    var $olddpasswd = req.body.olddpasswd;

    if (_.isEmpty($sdid)) return res.status(403).json({err:1,msg : 'no specify smartdevice'});

    var $hashnewpasswd = sha256($newdpasswd);
    var $hasholdpasswd = sha256($olddpasswd);

    dbmanager.adminChangePasswdSmartDevice($sdid,$hasholdpasswd.toString(),$hashnewpasswd.toString()).then(function (update) {
        res.json({err : 0 , msg : 'change password smartdevice successfully'});
    }).catch(function (err) {

        if (err.ecode === conf.OLD_PASSWORD_NOT_MATCH){
            return  res.status(403).json({err : conf.OLD_PASSWORD_NOT_MATCH , message : "old password not match"});
        }
        res.status(403).json({err : 1 , msg : 'change password smartdevice failure',issue : err});
    });

});

/*admin List smart Devices*/

router.get('/admin/devices',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }
     dbmanager.adminListSmartDevices().then(function (devices) {
         res.json({err:0,devices:devices});
     }).catch(function (err) {
         res.json({err:1,issue:err});
     });

});


/* verification token */

router.get('/admin/verify',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {
    if (!req.user.uadmin){
        return res.status(401).json({err:401,msg : 'authentication failure'});
    }else {
        return res.json({err:0,msg : 'token is verified'});
    }
});


/*--------------------------- user level --------------------------*/

/* user sign up */
router.post('/user/singup',function (req, res, next) {

    var uname = req.body.uname;
    var lname = req.body.lname;
    var fname = req.body.fname;
    var email = req.body.email;
    var password = req.body.passwd;

    if (! _.isEmpty(uname) && ! _.isEmpty(lname) && ! _.isEmpty(fname) && ! _.isEmpty(email)){

        var uid = sha256(uname + "-"+lname+"-"+fname+"-"+email);
        var hashPassword = sha256(password);
        var hashure = sha256(uname);

        dbmanager.userSigup(uid.toString(),uname,hashPassword.toString(),lname,fname,email)
            .then(function (docs) {

                var payload = {
                    uid : uid.toString(),
                    uname : hashure.toString(),
                    passwd : hashPassword.toString()
                }

                jwt.sign(payload,conf.jwt.userPrivateKey,{expiresIn:24*60*60},function (err, token) {

                    if (err)return res.status(401).json({err:1,token:""});

                    res.json({err:0,token:token});

                });


            }).catch(function (err) {
            console.error(err);
            if (err.ecode === conf.UNAME_AND_EMAIL_EXIT){
                return res.status(401).json({err:conf.UNAME_AND_EMAIL_EXIT,token:""});
            }
            res.status(401).json({err:1,token:""});
        });


    }else {
        res.status(501).json({err:1,msg : ' empty user information ',token:""});
    }


});

/* user login */
router.post('/user/login',function (req, res, next) {

    var ure = req.body.ure; // username or email
    var passwd = req.body.passwd; // password plain text

    var hashpassword = sha256(passwd);
    var hashure = sha256(ure);

    dbmanager.userlogin(ure,hashpassword.toString()).then(function (user) {
        console.log(user);
        if (!user) return res.status(401).json({err:1,token:""});

        var payload = {
            uid: user.uid,
            uname : hashure.toString(),
            passwd : hashpassword.toString()
        }

        jwt.sign(payload,conf.jwt.userPrivateKey,{expiresIn:24*60*60},function (err, token) {

            if (err) res.status(401).json({err:1,token:""});

            res.json({err:0,token:token});

        });


    }).catch(function (err) {
        console.log(err);
        res.status(401).json({err:1,token:""});
    });


});

/* application add smart device */
router.post('/app/device/add',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    var $sdid = req.body.sdid;
    var $dpasswd = req.body.dpasswd;

    var $hashdpasswd = sha256($dpasswd);

    if (_.isEmpty($sdid) || _.isEmpty($hashdpasswd.toString())) return res.status(200).json({err : 404 , msg : 'empty device identify'});

    if (!req.user) {
        return res.json({err:401,msg : 'authentication unsuccessfully'});
    }

    dbmanager.UserAddSmartDevice($sdid,$hashdpasswd.toString(),req.user.uid).then(function (device) {
        res.json({err : 200, device : device});
    }).catch(function (err) {
       if (err.errcode === 400) return res.status(200).json({err : 400 , msg : err});
        res.status(200).json({err : 403 , msg : err});
    });

});

/* fcm notification */
router.post('/fcm',function (req, res, next) {

    var $sdid = req.body.sdid;

    if(!_.isEqual(req.get('Authorization'),conf.fcm.Auth)){
        return res.json({err : 1 , msg : 'Unionization'});
    }

    if (_.isEmpty($sdid)) return res.status(403).json({err:1,msg : 'empty parameter'});

    firebasemanager.FcmNotification($sdid).then(function (result) {
        res.json({err:0,issue : result});
    }).catch(function (err) {
        return res.status(200).json({err:1,issue : err});
    });

});


/* user delete smart device */
router.delete('/user/device/delete',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});

    var $sdid = req.body.sdid;

    if (_.isEmpty($sdid)) return res.status(200).json({err : 1 , msg : 'empty device identify'});

    dbmanager.userDeleteSmartDevice(req.user.uid, $sdid).then(function (user) {
        console.log(user);
        res.json({err: 0 , msg: 'delete user successfully'});
    }).catch(function (err) {
        res.status(200).json({err: 1 , msg : err});
    });

});

/*user update device*/
router.post('/user/device/update',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});

    var $sdid = req.body.sdid;
    var $nicname = req.body.dname;

    if (_.isEmpty($sdid) || _.isEmpty($nicname)) return res.status(200).json({err : 1 , msg : 'empty device identify'});

     dbmanager.userUpdateSmartDevice(req.user.uid,$sdid,$nicname)
         .then(function (update) {
             console.log(update);
             res.json({err : 0, msg : 'update device success'});
         }).catch(function (err) {
            res.json({err:1,msg : err});
         });

});

/* get list of smart device for some users */
router.get('/devices',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});

      dbmanager.ListUserSmartDevice(req.user.uid).then(function (devices) {

          if (_.isEmpty(devices)) return res.status(200).json({err: 404,msg : "no device register"});

          res.json({err : 0 , devices : devices});

      }).catch(function (err) {
         res.status(403).json({err:500,msg : err});
      });

});

/*user profile*/
router.get('/user/profile',expressJwt({secret: conf.jwt.userPrivateKey}),function (req,res,next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});
    dbmanager.getUserProfile(req.user.uid).then(function (user) {
        res.status(200).json({err:0,user:user});
    }).catch(function (err) {
        res.status(403).json({err:1,issue : err});
    })

});



module.exports = router;
