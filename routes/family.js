const { EDESTADDRREQ } = require("constants");

var express     = require("express"),
    router      = express.Router(),
    Family  = require("../models/family"),
    Member     = require("../models/member"),
    dateFormat = require('dateformat'),
    now = new Date(),
    url = require("url");

//html to pdf
let pdf = require("html-pdf");
let path = require("path");
let ejs = require("ejs");


//full report
router.get("/full-report", (req, res) => {  
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //find family
    Family.findById(qdata.id, function(err,foundFamily){
        if(err){
            console.log(err);
        }else{ 
            Member.find({"familyID": qdata.id}, function(err, foundMembers){ 
                if(err){
                    console.log(err);
                }else{   
                    res.render("family/full-report", {family:foundFamily, members: foundMembers}, (err, data) => {
                        if (err) {
                            res.send(err);      
                        } else {
                            let options = {
                                "height": "11.25in",
                                "width": "8.5in",
                                "header": {
                                    "height": "20mm"
                                },
                                "footer": {
                                    "height": "20mm",
                                },
                            };
                            pdf.create(data, options).toStream((err, stream) => {
                                if (err) {                            
                                    console.error(err);
                                    res.status(500);
                                    res.end(JSON.stringify(err));                            
                                    return;
                                }                            
                                res.setHeader('Content-Type', 'application/pdf');
                                res.setHeader('Content-Disposition', 'attachment; filename=full-report-' + foundFamily.fname +Date.now() +'.pdf;');                            
                                stream.pipe(res);
                            });
                        }
                    });
                }
            });
        }
    });
});

//individual report
router.get("/family-report", (req, res) => {  
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //find family
    Family.findById(qdata.id, function(err,foundFamily){
        if(err){
            console.log(err);
        }else{ 
            res.render("family/family-report", {family:foundFamily}, (err, data) => {
                if (err) {
                    res.send(err);      
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    };
                    pdf.create(data, options).toStream((err, stream) => {
                        if (err) {                            
                            console.error(err);
                            res.status(500);
                            res.end(JSON.stringify(err));                            
                            return;
                        }                            
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=full-report-' + foundFamily.fname +Date.now() +'.pdf;');                            
                        stream.pipe(res);
                    });
                }
            });
        }
    });
});

//add famlily
router.get("/add-family", isGsClerk, function(req,res){
    res.render("family/add-family");
});


//add family post
router.post("/add-family",isGsClerk, function(req,res){
    // get data from form and add to FAMILY array
    var today = dateFormat(now, "yyyy-mm-dd");
    if(today >= req.body.dob){
        var newFamily = {fname:req.body.fname, lname:req.body.lname, dob: req.body.dob, nic: req.body.nic, gender:req.body.gender, email:req.body.email, mobile:req.body.mobile, religion:req.body.religion, ethnic: req.body.ethnic, job:req.body.job, monthlyIncome: req.body.monthlyIncome, temporaryAddress: req.body.temporaryAddress, permanentAddress: req.body.permanentAddress, gnDivision:global.division, dsDivision: "Thunukkai", division:global.division};
        //create a new FAMILY and save to db
        Family.create(newFamily,function(err,newlyCreated){
            if(err){
                res.send(err);
            }else{
                //redirect back to FAMILY page
                res.send("OK");
            }
        })
    }
    else{
        res.send("You cannot add future dates!");
    }
});


// edit family route
router.get("/edit-family", isGsClerk, isFamilyOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    Family.findById(qdata.id,function(err,foundFamily){
        //render show template with that family
        res.render("family/edit-family",{family:foundFamily});
    });
});


// update family
router.post("/edit-family", isGsClerk, isFamilyOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    // find and update the correct family
    var today = dateFormat(now, "yyyy-mm-dd");
    if(today >= req.body.family.dob){
        Family.findByIdAndUpdate(qdata.id, req.body.family,function(err,updatedFamily){
            if(err){
                res.send(err);
            }else{
                res.send("/show-family?id=" + qdata.id);
            }
        });
    }
    else{
        res.send("You cannot add future dates!");
    }
});
    
// show family
router.get("/show-family", isLoggedIn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    
    //find family
    Family.findById(qdata.id, function(err,foundFamily){
        if(err){
            console.log(err);
        }else{ 
            Member.find({"familyID": qdata.id}, function(err, foundMembers){ 
                if(err){
                    console.log(err);
                }else{ 
                    res.render("family/show-family",{family:foundFamily, members: foundMembers});
                }
            });
        }
    });
});


//search famlily
router.get("/search-family", isLoggedIn, function(req,res){
    Family.find({"gnDivision": global.user[0].division},function(err,allFamily){
        if(err){
            res.redirect("/search-family");
        }else{
            if(allFamily.length > 0){                
                res.render("family/search-family",{families:allFamily});
            }           
            else{
                res.render("landing/index");
            } 
        }
    })
});


// delete route
router.get("/delete-family", isGS, isFamilyOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //destroy family
    Family.findByIdAndRemove(qdata.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect
            res.redirect("/search-family");
        }
    });
});

function checkGn(req,res,next){
     //otherwise redirect
    Family.findById(req.params.id,function(err,foundFamily){
        if(err){
            res.send(err);
        }else{
            //does user own the family
            if(foundFamily.gs == global.userEmail){
                return next();
            }else{
                res.send("/search-family");
            }
        }
    });
}


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

//check GS and Clerk
function isGsClerk(req,res,next){
    if(global.sess == true){
        if(global.level == 3 || global.level == 2){
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
function isFamilyOwn(req,res,next){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    // find and update the correct family
    Family.findById(qdata.id, function(err,foundFamily){
        if(err){
            console.log(err);
        }else{
            if(global.division == foundFamily.gnDivision){
                return next();
            }
            else{
                res.redirect("/forbidden");
            }
        }
    });
}


module.exports = router;