/**
 * Created by xang on 20/04/2017.
 */



exports.url = "mongodb://localhost/homething";
exports.user = "admin";
exports.passwd = "55765567";

function homethingConfig() {


    this.database = {
        url : "mongodb://localhost/homething",
        user : "admin",
        passwd : "admin",
        port : 27017
    }

    this.admin = {

        user : "admin",
        passwd : "admin"

    }

    this.jwt = {
        PrivateKey : "eyJ1YWRtaW4iOiJhZG1pbiIsInBhZG1pbiI6ImFkbWluIiwiaWF0IjoxNDkyNzUyOTAwLCJleHAiOjE0OTI4MzkzMDB9"
    }

}


module.exports = function () {
    return new homethingConfig();
}