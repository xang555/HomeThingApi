/**
 * Created by xang on 20/04/2017.
 */



exports.url = "mongodb://localhost/homething";
exports.user = "admin";
exports.passwd = "55765567";

function homethingConfig() {


    this.database = {
        dev : {
            url : "mongodb://localhost/homething"
        },
        product : {
            url : "mongodb",
            user : "admin",
            passwd : "admin",
            port : 27017,
            dbname : 'homething'
        }
    };

    this.admin = {

        user : "admin",
        passwd : "admin"

    };

    this.jwt = {
        AdminPrivateKey : "eyJ1YWRtaW4iOiJhZG1pbiIsInBhZG1pbiI6ImFkbWluIiwiaWF0IjoxNDkyNzUyOTAwLCJleHAiOjE0OTI4MzkzMDB9",
        userPrivateKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzY4NTQ1Njg4NSIsImlhdCI6MTQ5MjgzMzUzNywiZXhwIjoxNDkyOTE5OTM3fQ.txsrzK94jID3ph51yl05h7Y7JImKh0yQigEDsD67pMs"
    };

    this.fcm = {
        ServerApiKey : 'AAAAT6-pZT0:APA91bEAJcuS5XVLpZ6F7HfwBqMro2u3yEgra3x61mV24SeLqcgvKb6jLpa6Pi0os9f65acnpEh0UzAPlhgzHjXY5Bg-XZJ2jZXBqi8kWQ8ACrd_U3z3Cw46RaSv5I4_mCgK2ZIt5pN_'
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
                    "L1":"Switch One",
                    "L2":"Switch Two",
                    "L3":"Switch Three",
                    "L4":"Switch Four"
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
                        "val" : 1490.0,
                        "time" : 1491484423
                    },
                    "hum" : {
                        "val" : 1490.0,
                        "time" : 1491484423
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
               "alert" : {
                   "mdId" : "f62XGhMsXVg:APA91bHksqmHpCtW-KTugGfXali_kBGE-tMBHYDR3LR_kAx1RD29k-iZSkatsp3AN7YcEdBoyp4_7m62j4OAMVk5Xf0lqQaRl_tVd-R4eK9FgQuUONBzl0SiBMhtuaJ81dnkybq1XiZt"
               },
               "SmartAlarmlinks" : {
                   "-KgNZp9ULo6PZW-XLOXl" : "797987987987"
               },
               "values" : {
                   "gass" : "1",
                   "time" : 1491484423
               }
           }
       },

        smartAlarm : {
         "active" : {
             "ack" : 45,
             "uplink" : 1
         },
          alert : false
     }





    };


}


module.exports = function () {
    return new homethingConfig();
}