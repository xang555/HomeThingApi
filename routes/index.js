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


/*------------------------------- admin level ---------------------------*/

/* add smart device for admin only */
router.post('/admin/device/add',expressJwt({secret: conf.jwt.AdminPrivateKey}), function(req, res, next) {

    if (!req.user.uadmin) {
        return res.json({err:401,msg : 'authentication unsuccessfully'});
    }

    var sdid = req.body.sdid;
    var  dtype = req.body.dtype;

    if (! _.isEmpty(sdid) && ! _.isEmpty(dtype)){

        dbmanager.adminAddSmartDevice(sdid,dtype)
            .then(function (docs) {
                res.json({err : 0, message : 'add smart device successfully',qrcode : sdid});
            }).catch(function (err) {
                console.error(err);
            res.status(403).json({err : 1, message : 'add smart device unsuccessfully',qrcode : sdid});
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

    if (user === conf.admin.user && passwd === conf.admin.passwd){

        var payload = {
            uadmin : user
        }

        jwt.sign(payload,conf.jwt.AdminPrivateKey,{expiresIn:24*60*60},function (err, token) {

            if (err) {
                return res.status(300).json({err : 1 , token : ""});
            }

            res.status(200).json({err : 0 , token : token});

        });

    }else {
        res.status(300).json({err : 1 , token : ""});
    }

});

router.post('/admin/device/delete',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }

    var $sdid = req.body.sdid;

    if (_.isEmpty($sdid)) return res.status(400).json({err : 1 , msg : 'empty parameter'});


    dbmanager.adminDeleteSmartDevice($sdid).then(function () {
        res.json({err:0,msg:'delete smart device successfully'});
    }).catch(function (err) {
        res.status(403).json({err:1,msg:'delete smart device unsuccessfully',msgerr: err});
    });


});


router.post('/admin/device/update',expressJwt({secret: conf.jwt.AdminPrivateKey}),function (req, res, next) {

    if (!req.user.uadmin) {
        return res.status(401).json({err:401,msg : 'authentication unsuccessfully'});
    }

    var $sdid = req.body.sdid;
    var $dtype = req.body.dtype;

    if (_.isEmpty($sdid) || _.isEmpty($dtype)) return res.status(403).json({err:1,msg : 'empty parameter'});

    dbmanager.adminUpdateSmartDevice($sdid,$dtype).then(function (update) {
        res.json({err : 0 , msg : 'update smart device successfully'});
    }).catch(function (err) {
        res.status(403).json({err : 1 , msg : 'update smart device successfully',issue : err});
    });


});


/*--------------------------- user level --------------------------*/

/* user sign up */
router.post('/user/singup',function (req, res, next) {

    var uname = req.body.uname;
    var lname = req.body.lname;
    var fname = req.body.fname;
    var email = req.body.email;
    var uid = req.body.uid;

    if (! _.isEmpty(uname) && ! _.isEmpty(lname) && ! _.isEmpty(fname) && ! _.isEmpty(email) && ! _.isEmpty(uid)){


        dbmanager.userSigup(uid,uname,lname,fname,email)
            .then(function (docs) {

                var payload = {
                    uid : uid
                }

                jwt.sign(payload,conf.jwt.userPrivateKey,{expiresIn:24*60*60},function (err, token) {

                    if (err) res.status(401).json({err:1,token:""});

                    res.json({err:0,token:token});

                });


            }).catch(function (err) {
            console.error(err);
            res.status(401).json({err:1,token:""});
        });


    }else {
        res.status(501).json({err:1,msg : ' empty user information ',token:""});
    }


});

/* user login */
router.post('/user/login',function (req, res, next) {

    var uid = req.body.uid;

    dbmanager.userlogin(uid).then(function (user) {

        console.log(user);

        if (!user) res.status(401).json({err:1,token:""});

        var payload = {
            uid : uid
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

    if (_.isEmpty($sdid)) return res.status(501).json({err : 1 , msg : 'empty device identify'});

    if (!req.user.uid) {
        return res.json({err:401,msg : 'authentication unsuccessfully'});
    }

    dbmanager.UserAddSmartDevice($sdid,req.user.uid).then(function (device) {
        res.json(device);
    }).catch(function (err) {
        res.status(301).json({err : 1 , msg : err});
    });

});

/* fcm notification */
router.post('/fcm',function (req, res, next) {

    var $sdid = req.body.sdid;

    if (_.isEmpty($sdid)) return res.status(403).json({err:1,msg : 'empty parameter'});

    firebasemanager.FcmNotification($sdid).then(function (result) {
        res.json({err:0,issue : result});
    }).catch(function (err) {
        return res.status(403).json({err:1,issue : err});
    });

});


/* user delete smart device */
router.post('/user/device/delete',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});

    var $sdid = req.body.sdid;

    if (_.isEmpty($sdid)) return res.status(501).json({err : 1 , msg : 'empty device identify'});

    dbmanager.userDeleteSmartDevice(req.user.uid, $sdid).then(function (user) {
        console.log(user);
        res.json({err: 0 , msg: 'delete user successfully'});
    }).catch(function (err) {
        res.status(405).json({err: 1 , msg : err});
    });

});


/* get list of smart device for some users */
router.get('/devices',expressJwt({secret: conf.jwt.userPrivateKey}),function (req, res, next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});

      dbmanager.ListUserSmartDevice(req.user.uid).then(function (devices) {

          if (_.isEmpty(devices)) return res.status(403).json({err: 404,msg : "no device register"});

          res.json({err : 0 , devices : devices});

      }).catch(function (err) {
         res.status(403).json({err:500,msg : err});
      });

});


router.get('/user/profile',expressJwt({secret: conf.jwt.userPrivateKey}),function (req,res,next) {

    if (!req.user.uid) return res.status(401).json({err:1,msg:'authentication fail'});
    dbmanager.getUserProfile(req.user.uid).then(function (user) {
        res.status(200).json(user);
    }).catch(function (err) {
        res.status(403).json({err:1,issue : err});
    })

});



module.exports = router;
