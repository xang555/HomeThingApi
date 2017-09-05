/**
 * Created by xang on 20/04/2017.
 */

function homethingConfig() {


    this.database = {
        dev : {
            url : "mongodb://localhost/homething"
        },
        product : {
            url : "mongohomething",
            user : "xang",
            passwd : "ilovemongodb",
            port : 27017,
            dbname : 'homething'
        }
    };

    this.admin = {

        user : "admin",
        passwd : "homething2017"

    };

    this.jwt = {
        AdminPrivateKey : "eyJ1YWRtaW4iOiJhZG1pbiIsInBhZG1pbiI6ImFkbWluIiwiaWF0IjoxNDkyNzUyOTAwLCJleHAiOjE0OTI4MzkzMDB9",
        userPrivateKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzY4NTQ1Njg4NSIsImlhdCI6MTQ5MjgzMzUzNywiZXhwIjoxNDkyOTE5OTM3fQ.txsrzK94jID3ph51yl05h7Y7JImKh0yQigEDsD67pMs"
    };

    this.fcm = {
        ServerApiKey : 'AAAAT6-pZT0:APA91bEAJcuS5XVLpZ6F7HfwBqMro2u3yEgra3x61mV24SeLqcgvKb6jLpa6Pi0os9f65acnpEh0UzAPlhgzHjXY5Bg-XZJ2jZXBqi8kWQ8ACrd_U3z3Cw46RaSv5I4_mCgK2ZIt5pN_',
        Auth : 'eyJ1YWRtaW4iOiJhZG1pbiIsInBhZG1pbiI6ImFkbWluIiwiaWF0IjoxNDkyNzUyOTAwLCJleHAiOjE0OTI4MzkzMDB9'
    };


    this.device = {

        smartSwitch :
            {
                "active" : {
                    "ack" : 1,
                    "uplink" : 0
                },
                "scheduler" : {
                    "L1" : {
                        "state" : false,
                        "status" : 1,
                        "time" : {
                            "hour" : 20,
                            "minute" : 0
                        }
                    },
                    "L2" : {
                        "state" : false,
                        "status" : 1,
                        "time" : {
                            "hour" : 20,
                            "minute" : 0
                        }
                    },
                    "L3" : {
                        "state" : false,
                        "status" : 1,
                        "time" : {
                            "hour" : 20,
                            "minute" : 0
                        }
                    },
                    "L4" : {
                        "state" : false,
                        "status" : 1,
                        "time" : {
                            "hour" : 20,
                            "minute" : 0
                        }
                    }
                },
                "status" : {
                    "L1" : {
                        "status" : 1,
                        "ack" : 1
                    },
                    "L2" : {
                        "status" : 1,
                        "ack" : 1
                    },
                    "L3" : {
                        "status" : 1,
                        "ack" : 1
                    },
                    "L4" : {
                        "status" : 1,
                        "ack" : 1
                    }
                },
                "name":{
                    "L1":"Switch 1",
                    "L2":"Switch 2",
                    "L3":"Switch 3",
                    "L4":"Switch 4"
                }

            },
        tempSensor : {
            "active" : {
                "ack" : 45,
                "uplink" : 1
            },
            "sensor" : {
                "values" : {

                    "temp" : {
                        "val" : 20.0,
                    },
                    "hum" : {
                        "val" : 50.0,
                    },
                    "time":{
                        "hour":12,
                        "minute":0
                    }

                }
            }
        },

       gass : {
           "active" : {
               "ack" : 45,
               "uplink" : 1
           },
           "sensor" : {
               "alert" : {},
               "SmartAlarmlinks" : {}
           }
       },

        smartAlarm : {
         "active" : {
             "ack" : 45,
             "uplink" : 1
         },
          alert : false,
          link : ""
     }





    };

    this.UNAME_AND_EMAIL_EXIT = 4000;
}


module.exports = function () {
    return new homethingConfig();
}
