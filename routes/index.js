var express     = require("express"),
    router      = express.Router(),
    password = require('password-hash-and-salt'),
    User        = require("../models/user"),
    Family  = require("../models/family"),
    Member     = require("../models/member"),
    Event     = require("../models/event"),
    session = require('express-session'),
    dateFormat = require('dateformat'),
    now = new Date(),
    url = require("url");


    var jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM('')).window;
    global.document = document;
    
    var $ = jQuery = require('jquery')(window);


global.userEmail;
global.sess;
global.user;
global.level;
global.division;
global.events;

//mailer
const nodemailer = require('nodemailer');  
var smtpTransport = require('nodemailer-smtp-transport'); 
let transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'testing.c98@gmail.com',
        pass: '#mathsstudy8#'
      }
}));

// =================== Start Observer Pattern ===============

// handle add event logic ds
router.post("/add-event", isDS, function(req,res){    

    var today = dateFormat(now, "yyyy-mm-dd");               
    if(req.body.date > today){ 
        //observer                           
        function notifyListners() {  
            req.body.type.forEach(function(type){ 
                if(parseInt(type) == 3){
                    User.find({},function(err,allUser){
                        allUser.forEach(function(user){ 
                            var newEvent = new Event({title:req.body.title, date:req.body.date, time: req.body.time, place:req.body.place, requirements: req.body.requirement, user: user._id});
                            Event.find({"title":req.body.title, "date": req.body.date, "time": req.body.time, "place": req.body.place, "requirements": req.body.requirement,"user": user._id}, function(err,allEvents){
                                if(allEvents.length == 0){
                                    Event.create(newEvent, function(err,event){
                                        if(err){
                                            res.send(err);
                                        } 
                                        else{
                                            //send verification email
                                            var mailOptions = {
                                                from: 'charangan.18@cse.mrt.ac.lk',
                                                to: user.email,
                                                subject: 'New Event From DS',
                                                html: '<p class="text-center">There will be an event on ' + req.body.date + ' at ' + req.body.time + ' in ' + req.body.place +'. Requirements are ' + req.body.requirement + '.</p>'
                                            };
                                                                            
                                            transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                    res.send(error);
                                                }
                                            });
                                        }                           
                                    });
                                }
                            });
                        });                       
                    }); 
                }
                else{
                    User.find({"division":parseInt(type)},function(err,allUser){                                               
                        var newEvent = new Event({title:req.body.title, date:req.body.date, time: req.body.time, place:req.body.place, requirements: req.body.requirement, user: allUser[0]._id});
                        Event.find({"title":req.body.title, "date": req.body.date, "time": req.body.time, "place": req.body.place,"requirements": req.body.requirement,"user": allUser[0]._id}, function(err,allEvents){
                            if(allEvents.length == 0){
                                Event.create(newEvent, function(err,event){
                                    if(err){
                                        res.send(err);
                                    } 
                                    else{
                                        //send verification email
                                        var mailOptions = {
                                            from: 'charangan.18@cse.mrt.ac.lk',
                                            to: allUser[0].email,
                                            subject: 'New Event From DS',
                                            html: '<p class="text-center">There will be an event on ' + req.body.date + ' at ' + req.body.time + ' in ' + req.body.place +'. Requirements are ' + req.body.requirement + '.</p>'
                                        };
                                                                        
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                res.send(error);
                                            }
                                        });
                                    }                           
                                });
                            }
                        });
                                               
                    });
                    var newEvent = new Event({title:req.body.title, date:req.body.date, time: req.body.time, place:req.body.place, requirements: req.body.requirement, user: global.user[0]._id});
                    Event.find({"title":req.body.title, "date": req.body.date, "time": req.body.time, "place": req.body.place,"requirements": req.body.requirement,"user": global.user[0]._id}, function(err,allEvents){
                        if(allEvents.length == 0){
                            Event.create(newEvent, function(err,event){
                                if(err){
                                    res.send(err);
                                }
                                else{
                                    //send verification email
                                    var mailOptions = {
                                        from: 'charangan.18@cse.mrt.ac.lk',
                                        to: global.user[0].email,
                                        subject: 'New Event From DS',
                                        html: '<p class="text-center">There will be an event on ' + req.body.date + ' at ' + req.body.time + ' in ' + req.body.place +'. Requirements are ' + req.body.requirement + '.</p>'
                                    };
                                                                    
                                    transporter.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                            res.send(error);
                                        }
                                    });
                                }                            
                            });
                        }
                    });                       
                }  
            });                                    
        };               
        notifyListners();
        res.send("OK");
    }
    else{
        res.send("You cannot add events to past days!");
    }
});

// =================== End Observer Pattern ===============

// =================== Start Decorator Pattern ===============

// handle make it super logic
router.get("/super-clerk", isGS, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    User.findById(qdata.id, function(err, foundUser){
        if(err){
            res.send(err);
        }else{           
            User.updateOne({"email":foundUser.email}, { $set: {level: 3} },function(err, user){
                User.find({"designation":"Clerk"}, function(err,allClerk){
                    if(allClerk.length > 0){                
                        res.render("users/search-clerk",{clerks : allClerk});
                    }           
                    else{
                        Family.find({},function(err,allFamily){
                            if(err){
                                console.log(err);
                            }else{
                                Member.find({},function(err,allMember){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.render("landing/index", {families : allFamily, members: allMember});
                                    }
                                });  
                            }
                        });             
                    } 
                }) 
            });                           
        }
    });
});

// handle down to normal logic
router.get("/undo-super", isGS, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    User.findById(qdata.id, function(err, foundUser){
        if(err){
            res.send(err);
        }else{           
            User.updateOne({"email":foundUser.email}, { $set: {level: 2} },function(err, user){
                User.find({"designation":"Clerk"}, function(err,allClerk){
                    if(allClerk.length > 0){                
                        res.render("users/search-clerk",{clerks : allClerk});
                    }           
                    else{
                        Family.find({},function(err,allFamily){
                            if(err){
                                console.log(err);
                            }else{
                                Member.find({},function(err,allMember){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.render("landing/index", {families : allFamily, members: allMember});
                                    }
                                });  
                            }
                        });             
                    } 
                }) 
            });                           
        }
    });
});

// =================== End Decorator Pattern ===============


//forbidde
router.get("/forbidden", function(req,res){
    res.render("forbidden");
});

//event route
router.get("/events", isLoggedIn, function(req,res){
    User.find({"email": global.userEmail}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){  
        
                Event.find({"user" : foundUser[0]._id},function(err,allEvents){                    
                    res.render("users/events", {allEvents : allEvents});
                });
            }
            else{
                res.redirect("/");
            }
        }
    });
});

//add event ds route
router.get("/add-event", isDS, function(req,res){
    res.render("users/add-event");
});


// delete gs
router.get("/delete-event", isLoggedIn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
           
    //destroy family
    Event.findByIdAndRemove(qdata.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect
            res.redirect("/events");
        }
    });         
});


// profile update
router.post("/profile",function(req,res){
    User.updateOne({"email":global.userEmail}, { $set: {username:req.body.username, mobile: req.body.mobile} },function(err, user){
        res.send("OK");
    });
});



// profile
router.get("/profile", isLoggedIn, function(req,res){
    User.find({"email":global.userEmail}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("profile", {UserProfile: foundUser});
        }
    });
});

// change password
router.post("/change-password", isLoggedIn, function(req,res){
    User.find({"email":global.userEmail}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                password(req.body.opassword).verifyAgainst(foundUser[0].password, function(error, verified) {
                    if(error){
                        res.send(error);
                    }
                    if(!verified){
                        res.send("Wrong Old Password!");
                    } 
                    else {
                        if(req.body.password == req.body.cpassword){
                            password(req.body.password).hash(function(error, hash) {
                                User.updateOne({"email":global.userEmail}, { $set: {password: hash} },function(err, user){
                                    res.send("OK");
                                });
                            });
                        }
                        else{
                            res.send("New Passwords do not match!");
                        }
                    }
                });
            }else{
                res.send("User does not exist!");
            }
        }
    });
});


// change password route
router.get("/change-password", isLoggedIn, function(req,res){
    res.render("change-password");
});


// // root route
// router.get("/",function(req,res){
//     res.render("login");
// });

//landing route
router.get("/", function(req,res){
    Family.find({},function(err,allFamily){
        if(err){
            console.log(err);
        }else{
            Member.find({},function(err,allMember){
                if(err){
                    console.log(err);
                }else{                    
                    res.render("landing/index", {families : allFamily, members: allMember});
                }
            });  
        }
    });    
});



// forgot password
router.post("/reset-password",function(req,res){
    User.find({"email":global.userEmail}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                if(req.body.password == req.body.cpassword){
                    password(req.body.password).hash(function(error, hash) {
                        User.updateOne({"email":global.userEmail}, { $set: {password: hash} },function(err, user){
                            res.send("/login");
                        });
                    });
                }
                else{
                    res.send("Passwords do not match!");
                }
            }else{
                res.send("User does not exist!");
            }
        }
    });
});

//reset code route
router.get("/reset-password",function(req,res){
    res.render("reset-password");
});

// check reset code
router.post("/reset-code",function(req,res){
    User.find({"email":global.userEmail}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser[0].code == req.body.code){
                res.send("/reset-password");
            }else{
                res.send("Invalid Code!");
            }
        }
    });
});


//reset code route
router.get("/reset-code",function(req,res){
    res.render("reset-code");
});

//forgot route
router.get("/forgot",function(req,res){
    res.render("forgot");
});

// handle sign up logic
router.post("/forgot",function(req,res){
    userEmail = req.session;
    User.find({"email":req.body.email}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                //code
                var code = Math.floor(100000 + Math.random() * 900000);

                User.updateOne({"email":req.body.email}, { $set: {code: code} },function(err, user){
                    //send verification email
                    var mailOptions = {
                        from: 'charangan.18@cse.mrt.ac.lk',
                        to: req.body.email,
                        subject: 'Forgot Password',
                        html: '<p class="text-center">Your reset code is ' + code + '.</p>'
                    };
                                                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.send(error);
                        } else {
                            global.userEmail = req.body.email;
                            res.send("/reset-code");                                   
                        }
                    });                      
                });                         
            } else{
                res.send("User does not exits");
            }       
        }
    });
});

//activate route
router.get("/activate", function(req,res){
    res.render("activation");
});

// handle sign up logic
router.put("/activate", function(req,res){
    User.find({"email":global.userEmail}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser[0].code == req.body.code){
                User.updateOne({"email":global.userEmail}, { $set: {status: 1} },function(err, user){
                    res.send("/login");
                });
            }else{
                res.send("Invalid Code!");
            }
        }
    });

});


//register ds route
router.get("/register-ds", function(req,res){
    res.render("users/register-ds");
});

// handle sign up logic ds
router.post("/register-ds", function(req,res){
    User.find({"email":req.body.email}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                res.send("Email already Exists!");
            }
            else{
                password(req.body.password).hash(function(error, hash) {
                    userEmail = req.session;

                    //code
                    var code = Math.floor(100000 + Math.random() * 900000);

                    //register
                    var newUser = new User({username:req.body.username, division: '0', designation:req.body.designation, mobile: req.body.mobile, email:req.body.email, password: hash, code:code, level:4, status:0});
                    User.create(newUser, function(err,user){
                        if(err){
                            res.send(err);
                        }else{
                            
                            global.userEmail = req.body.email;

                            //send verification email
                            var mailOptions = {
                                from: 'charangan.18@cse.mrt.ac.lk',
                                to: req.body.email,
                                subject: 'Account Activation',
                                html: '<p class="text-center">Your activation code is ' + code + '.</p>'
                            };
                                                
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    res.send(error);
                                } else {
                                    res.send("/activate");                                    
                                }
                            });           
                        }        
                    });
                });
            }
        }
    });
});


//register gs route
router.get("/register-gs", isDS, function(req,res){
    res.render("users/register-gs");
});

// handle sign up logic
router.post("/register-gs", isDS, function(req,res){
    User.find({"email":req.body.email}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                res.send("Email already Exists!");
            }
            else{
                password(req.body.password).hash(function(error, hash) {
                    userEmail = req.session;

                    //code
                    var code = Math.floor(100000 + Math.random() * 900000);

                    //register
                    var newUser = new User({username:req.body.username, division: req.body.division, designation:req.body.designation, mobile: req.body.mobile, email:req.body.email, password: hash, code:code, level:3, status:0});
                    User.create(newUser, function(err,user){
                        if(err){
                            res.send(err);
                        }else{
                            
                            global.userEmail = req.body.email;

                            //send verification email
                            var mailOptions = {
                                from: 'charangan.18@cse.mrt.ac.lk',
                                to: req.body.email,
                                subject: 'Account Activation',
                                html: '<p class="text-center">Your activation code is ' + code + '.</p>'
                            };
                                                
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    res.send(error);
                                } else {
                                    res.send("/search-clerk");                                    
                                }
                            });           
                        }        
                    });
                });
            }
        }
    });
});

// delete gs
router.get("/delete-gs", isDS, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //destroy family
    User.findByIdAndRemove(qdata.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect
            res.redirect("/search-gs");
        }
    });
});

//search GS
router.get("/search-gs", isDS, function(req,res){
    User.find({"level":3}, function(err,allGs){
        if(allGs.length > 0){                
            res.render("users/search-gs",{gses : allGs});
        }           
        else{
            res.render("landing/index");
        } 
    })
});


//register clerk route
router.get("/register-clerk", isGS, function(req,res){
    res.render("users/register-clerk");
});

// handle sign up logic
router.post("/register-clerk", isGS, function(req,res){
    User.find({"email":req.body.email}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.length > 0){
                res.send("Email already Exists!");
            }
            else{
                password(req.body.password).hash(function(error, hash) {
                    userEmail = req.session;

                    //code
                    var code = Math.floor(100000 + Math.random() * 900000);

                    //register
                    var newUser = new User({username:req.body.username, division: req.body.division, designation:req.body.designation, mobile: req.body.mobile, email:req.body.email, password: hash, code:code, level:2, status:0});
                    User.create(newUser, function(err,user){
                        if(err){
                            res.send(err);
                        }else{
                            
                            global.userEmail = req.body.email;

                            //send verification email
                            var mailOptions = {
                                from: 'charangan.18@cse.mrt.ac.lk',
                                to: req.body.email,
                                subject: 'Account Activation',
                                html: '<p class="text-center">Your activation code is ' + code + '.</p>'
                            };
                                                
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    res.send(error);
                                } else {
                                    res.send("/search-clerk");                                    
                                }
                            });           
                        }        
                    });
                });
            }
        }
    });
});

// delete gs
router.get("/delete-clerk", isClerkOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //destroy family
    User.findByIdAndRemove(qdata.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect
            res.redirect("/search-clerk");
        }
    });
});


//search clerk
router.get("/search-clerk", isGsDs, function(req,res){
    User.find({"designation":"Clerk"}, function(err,allClerk){
        if(allClerk.length > 0){                
            res.render("users/search-clerk",{clerks : allClerk});
        }           
        else{
            Family.find({},function(err,allFamily){
                if(err){
                    console.log(err);
                }else{
                    Member.find({},function(err,allMember){
                        if(err){
                            console.log(err);
                        }else{
                            res.render("landing/index", {families : allFamily, members: allMember});
                        }
                    });  
                }
            });             
        } 
    });
});


// show login
router.get("/login",function(req,res){
    res.render("login");
});

// handling login logic
router.post("/login", function(req,res){
    userEmail = req.session;    
    user = req.session;
    level = req.session;
    division = req.session;
    events = req.session;

    User.find({"email": req.body.email}, function(err, foundUser){   
        if(foundUser.length >0){
            password(req.body.password).verifyAgainst(foundUser[0].password, function(error, verified) {
                if(error){
                    res.send(error);
                }
                if(!verified){
                    res.send("Wrong Password!");
                } 
                else {
                    global.userEmail = req.body.email;   
                    if(foundUser[0].status == 1){
                        global.sess = true;
                        global.user = foundUser; 
                        global.level = foundUser[0].level;  
                        global.division = foundUser[0].division;                                        
    
                        //return to previous page after authenticated
                        if(req.session.returnTo){
                            res.send(req.session.returnTo || '/');
                            delete req.session.returnTo;
                        }else{      
                            Event.find({"user" : foundUser[0]._id},function(err,allEvents){ 
                                global.events = allEvents.length;                                                              
                                res.send("/");
                            });                           
                        }                                 
                    }
                    else{
                        res.send("/activate");
                    }
                }
            }); 
        }else{
            res.send("User does not exists!");
        }            
    });        
});

// logout route
router.get("/logout",isLoggedIn, function(req,res){
    global.sess = false;
    global.userEmail = "";
    req.logOut();
    res.redirect("/login");
});

//check loggedin
function isLoggedIn(req,res,next){
    if(global.sess == true){
        return next();
    }
    else{
        req.session.returnTo = req.originalUrl; 
        res.redirect("/login");
    }
}


//check DS
function isDS(req,res,next){
    if(global.sess == true){
        if(global.level == 4){
            return next();
        }
        else{
            res.redirect("/forbidden");
        }
    }
    else{
        req.session.returnTo = req.originalUrl; 
        res.redirect("/login");
    }    
}

//check GS
function isGS(req,res,next){
    if(global.sess == true){
        if(global.level == 3){
            return next();
        }
        else{
            res.redirect("/forbidden");
        }
    }
    else{
        req.session.returnTo = req.originalUrl; 
        res.redirect("/login");
    }
}

//check own
function isClerkOwn(req,res,next){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    // find and update the correct family
    User.findById(qdata.id, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(global.division == foundUser.division){
                return next();
            }
            else{
                res.redirect("/forbidden");
            }
        }
    });
}

//check GS and Clerk
function isGsDs(req,res,next){
    if(global.sess == true){
        if(global.level == 3 || global.level == 4){
            return next();
        }
        else{
            res.redirect("/forbidden");
        }
    }
    else{
        req.session.returnTo = req.originalUrl; 
        res.redirect("/login");
    }
}

module.exports = router;