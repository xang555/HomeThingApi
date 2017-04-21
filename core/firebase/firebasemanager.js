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



}


module.exports = function () {
    return new firebasemanager();
}
