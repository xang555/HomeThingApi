/**
 * Created by xang on 21/04/2017.
 */

var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');
var promise = require('bluebird');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://laothing-d014b.firebaseio.com"
});



function firebasemanager() {


    this.createCustomToken = function (uid) {

       return new promise(function (resolve, reject) {

           admin.auth().createCustomToken(uid)
               .then(function (token) {
                    resolve(token);
               }).catch(function (err) {
                    reject(err);
                });

       });

    }


    this.verifyCustomtoken = function (token) {

       return new promise(function (resolve, reject) {

           admin.auth().verifyIdToken(token)
               .then(function (detoken) {
                   resolve(detoken);
               })
               .catch(function (err) {
                    reject(err);
               })

       });

    }



}


module.exports = function () {
    return new firebasemanager();
}
