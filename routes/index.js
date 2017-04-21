"use strict";

var express = require('express');
var homethingModel = require('../database/model/homethingModel');
var router = express.Router();
var jwt = require('jsonwebtoken');
var  conf = require('../config')();
var expressJwt = require('express-jwt');
var dbmanager = require('../core/dbmanager')();
var _ = require('lodash');

/* add smart device for admin only */
router.post('/admin/device/add',expressJwt({secret: conf.jwt.PrivateKey}), function(req, res, next) {

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


/* user sign up */
router.post('/user/singup',function (req, res, next) {

    var uname = req.body.uname;
    var passwd = req.body.passwd;
    var lname = req.body.lname;
    var fname = req.body.fname;
    var email = req.body.email;
    var uid = req.body.uid;

     if (! _.isEmpty(uname) && ! _.isEmpty(passwd) && ! _.isEmpty(lname) && ! _.isEmpty(fname) && ! _.isEmpty(email)){


         dbmanager.userSigup(uid,uname,passwd,lname,fname,email)
             .then(function (docs) {

                 var payload = {
                     uname : docs.uname,
                     passwd : docs.passwd
                 }

                 jwt.sign(payload,conf.jwt.PrivateKey,{expiresIn:24*60*60},function (err, token) {

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

});


/* admin login */
router.post('/admin/login',function (req, res, next) {

    var  user = req.body.user;
    var passwd = req.body.passwd;

    if (user === conf.admin.user && passwd === conf.admin.passwd){


        var payload = {
            uadmin : user,
            padmin : passwd
        }

        jwt.sign(payload,conf.jwt.PrivateKey,{expiresIn:24*60*60},function (err, token) {

            if (err) {
                return res.status(300).json({err : 1 , token : ""});
            }

            res.status(200).json({err : 0 , token : token});

        });

    }else {
        res.status(300).json({err : 1 , token : ""});
    }

});


/* application add smart device */
router.post('/app/device/add',function (req, res, next) {

});

/* fcm notification */
router.post('/fcm',function (req, res, next) {


});


/* delete smart device */
router.post('/device/delete',function (req, res, next) {


});


/* get list of smart device for some users */
router.get('device/{token}',function (req, res, next) {


});


module.exports = router;
