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


//individual report
router.get("/individual-report", (req, res) => {  
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //find family
    Member.findById(qdata.id, function(err,foundMembers){
        if(err){
            console.log(err);
        }else{ 
            Family.findById(foundMembers.familyID, function(err, foundFamily){ 
                if(err){
                    console.log(err);
                }else{   
                    res.render("member/individual-report", {family:foundFamily, member: foundMembers}, (err, data) => {
                        if (err) {
                            console.log(err)   
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


//add member
router.get("/add-member", isGsClerk, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    //find family by id
    Family.findById(qdata.id,function(err,family){
        if(err){
            console.log(err);
        }else{
            res.render("member/add-member",{family:family});
        }
    });
    
});

router.post("/add-member", isGsClerk, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query;
    //lookup family using id
    Family.findById(qdata.id,function(err,family){
        if(err){
            res.send(err);
        }else{
            //create new member
            var today = dateFormat(now, "yyyy-mm-dd");
            if(today >= req.body.dob){
                var newMember = {relation: req.body.relation, fname:req.body.fname, lname:req.body.lname, dob: req.body.dob, gender:req.body.gender, nic: req.body.nic, email:req.body.email, mobile:req.body.mobile, religion:req.body.religion, ethnic: req.body.ethnic, job:req.body.job, monthlyIncome: req.body.monthlyIncome, temporaryAddress: req.body.temporaryAddress, permanentAddress: req.body.permanentAddress, familyID:qdata.id, division:global.division};
                Member.create(newMember,function(err,member){
                    if(err){
                        res.send(err);
                    }else{
                    
                        member.gs = global.userEmail;
                        // save member
                        member.save(); 
                    
                        //redirect family show page
                        res.send("/show-family?id=" + qdata.id);
                    }
                });
            }
            else{
                res.send("You cannot add future dates!");
            }
        }
    });
});


//search member
router.get("/search-member", isLoggedIn, function(req,res){
    Member.find({"division":global.user[0].division},function(err,allMember){
        if(err){
            res.redirect("/search-member");
        }else{
            res.render("member/search-member",{members:allMember});
        }
    })
});

// edit member route
router.get("/edit-member", isGsClerk, isMemberOwn,  function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    Member.findById(qdata.id,function(err,foundMember){
        Family.findById(foundMember.familyID,function(err,foundfamily){
            res.render("member/edit-member",{member:foundMember, family: foundfamily});
        });
    });
});

// update member
router.post("/edit-member", isGsClerk, isMemberOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    // find and update the correct member
    var today = dateFormat(now, "yyyy-mm-dd");
    if(today >= req.body.member.dob){
        Member.findByIdAndUpdate(qdata.id, req.body.member,function(err,updatedmember){
            if(err){
                res.send(err);
            }else{
                res.send("/show-family?id=" + qdata.fid);
            }
        });
    }
    else{
        res.send("You cannot add future dates!");
    }
});


// delete route
router.get("/delete-member", isGS, isMemberOwn, function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query; 

    //destroy family
    Member.findByIdAndRemove(qdata.id, function(err){
        if(err){
            console.log(err);
        }else{
            //redirect
            res.redirect("/show-family?id=" + qdata.fid);
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
function isMemberOwn(req,res,next){
    var q = url.parse(req.url, true);
    var qdata = q.query; 
    // find and update the correct family
    Member.findById(qdata.id, function(err,foundMember){
        if(err){
            console.log(err);
        }else{
            if(global.division == foundMember.division){
                return next();
            }
            else{
                res.redirect("/forbidden");
            }
        }
    });
}

module.exports = router;