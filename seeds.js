var mongoose = require("mongoose");
var Family = require("./models/family");
var Member   = require("./models/member");
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const _ = require("lodash");
const genders = [1, 2];
const religion = [1,2,3,4];
const ethnics = [1,2,3,4];
const gss = [1,2];
const relations = [1,2,3];
const ic = ["x","v","y"];
const employable = [1,2];

function seedDB(){
    for (let i = 0; i < 100; i += 1) {
        var address =  faker.address.streetAddress();
        var ethnic = faker.random.arrayElement(ethnics);
        newFamily = new Family({
            fname:faker.name.firstName(),
            lname:faker.name.lastName(),
            dob:faker.date.between('1940-01-01', '2020-09-15').toString(),
            gender:faker.random.arrayElement(genders),
            nic:faker.random.number({min:198000000, max: 200200000}).toString() + faker.random.arrayElement(ic),
            email:faker.internet.email(),
            mobile:"07" + faker.random.number({min:0, max:9}).toString() + faker.random.number({min:1000000, max: 9999999}).toString(),
            religion:faker.random.arrayElement(religion),
            ethnic: ethnic,
            jobState : faker.random.arrayElement(employable),
            job:faker.name.jobTitle(),
            monthlyIncome:"Rs." + faker.finance.amount(9000,10000,2).toString(),
            temporaryAddress:faker.address.streetAddress(),
            permanentAddress:address,
            gnDivision:faker.random.arrayElement(gss),
            dsDivision:"Thunukkai",
            division: 1,

        });

        Family.create(newFamily, function(err, family){
                if(err){
                    console.log(err);
                } else {
                    var familyID =  family._id;
                    var division = family.gnDivision;

                    for (let i = 0; i < 6; i += 1) {
                        var newMember = new Member({
                           
                            relation:faker.random.arrayElement(relations),
                            fname:faker.name.firstName(),
                            lname:faker.name.lastName(),
                            dob:faker.date.between('1940-01-01', '2020-09-15').toString(),
                            gender:faker.random.arrayElement(genders),
                            nic:faker.random.number({min:198000000, max: 200200000}).toString() + faker.random.arrayElement(ic),
                            email:faker.internet.email(),
                            mobile:"07" + faker.random.number({min:0, max:9}).toString() + faker.random.number({min:1000000, max: 9999999}).toString(),
                            religion:faker.random.arrayElement(religion),
                            ethnic:ethnic,
                            jobState : faker.random.arrayElement(employable),
                            job:faker.name.jobTitle(),
                            monthlyIncome:"Rs." + faker.finance.amount(9000,100000,2).toString(),
                            temporaryAddress:faker.address.streetAddress(),
                            permanentAddress: address,
                            gnDivision:faker.random.arrayElement(gss),
                            dsDivision:"Thunukkai",
                            division: division,
                            familyID: familyID, 
                        });
                        Member.create(newMember, function(err,member){                            
                            member.save();
                        });
                    }                 
                }
            });   
    
            
            
}
 };
    /*
    for (let i = 0; i < 100; i += 1) {
        Family.create({
            name: faker.name,
            nic_no: faker.Number.number(12),
            per_address:faker.address,
            tem_address:faker.address,
            gs_div:"KN/200",
            about:faker.lorem.words(50),
            
            
        });
      /*  let newPost = {
          title: faker.lorem.words(7),
          body: faker.lorem.words(500),
    
          // use lodash to pick a random user as the author of this post
          author: _.sample(users),
    
          // use lodash to add a random subset of the users to this post
          likes: _.sampleSize(users, Math.round(Math.random * users.length)).map(
            user => user._id
          )
        };
        posts.push(newPost);
    
        // visual feedback again!
        console.log(newPost.title);
      }
    
    
    
              //add a few family
             data.forEach(function(seed){
                 Family.create(seed, function(err, family){
                     if(err){
                         console.log(err)
                     } else {
                         console.log("added a family");
                         //create a member
                         Member.create(
                             {
                                 name:"SSanjeepan",
                                 gender:"male",
                                 relation:"son",
                                 dob:1999/02/14,
                                 nic_no:"123456789",
                                 occupation:"student",
                                 mon_income:0.0,
                                 author: "Homer"
                             }, function(err, member){
                                 if(err){
                                     console.log(err);
                                 } else {
                                     family.members.push(member);
                                     family.save();
                                     console.log("Created new member");
                                 }
                             });
                     }
                 });
             });
         
     
     //add a few members
 }
}*/
  
 module.exports = seedDB;