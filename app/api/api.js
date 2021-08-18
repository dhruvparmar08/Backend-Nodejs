var User = require('../model/model');
var path = require("path");
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const fs = require('fs');
const upload = require('../middleware/upload');

module.exports = function(router){
    
    router.get('/', (req, res) => {
        res.send("Hello");
    })

    router.post('/login', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        if(email != null && password != null) {
            if(email == "demo123@gmail.com" && password == "12345678") {
                var token = jwt.sign({ email: email }, secret, { expiresIn: '24h' }); 
                res.status(200).json({ message: 'User authenticated!', token: token });
            } else {
                res.status(401).json({message: "Invalid Email/Password"});
            }
        } else {
            res.status(401).json({message: "Please Enter the Email Address and Password"});
        }
    })
    
    router.post('/add', upload.single('image'), (req , res)=>{

        if(!req.file) {
            res.json({ success: false, message: 'No file selected !!!'});
        } else{
            let user = new User();

            user.name = req.body.name;
            user.desc = req.body.desc;
            user.price = req.body.price;
            user.quantity = req.body.quantity;
            user.image = req.file.filename;
            user.image_path = req.file.path;
            user.save(function(err){
                if(err){
                    if(err.errors.name) {
                        res.status(401).json({ message: "Name is required" });    
                    } else if(err.errors.desc) {
                        res.status(401).json({ message: "Description is required" });    
                    } else if(err.errors.price) {
                        res.status(401).json({ message: "Price is required" });    
                    } else if(err.errors.quantity) {
                        res.status(401).json({ message: "Quantity is required" });    
                    } else {
                        res.status(401).json({ message: err });
                    }
                } else {
                    res.status(200).json({ message: 'Product Registered !!!' });
                }
            });
        }
    })

    router.get('/allproducts', (req, res) => {
        User.find({}).exec(function(err, user) {
            if(err) throw err;
            console.log(user.length);
            if(!user || user.length === 0 ) {
                res.status(401).json({ message: 'Product not found' });
            } else {
                res.status(200).json({ data: user });
            }
        })
    })

    router.get('/product', (req, res) => {
        User.find({ _id: req.query.id }).exec((err, user) => {
            if(err) throw err;
            if(!user) {
                res.status(401).json({ message: 'Product not found' });
            } else {
                res.status(200).json({ data: user });
            }
        })
    })

    router.post('/update',upload.single('image') ,async (req, res) => {
        User.find({ _id: req.body.id }).exec(async(err, product) => {
            if(err) throw err;
             else  {
                if(!req.file) {
                    await User.updateOne({"_id":req.body.id },{"$set" : {"name" : req.body.name,"desc":req.body.desc,
                        "price":req.body.price , "quantity":req.body.quantity }, upsert : true}).exec(function(err, book){
                            if(err) {
                                console.log(err);
                                res.status(401).send(err);
                            } else {
                                res.status(200).json({ message: 'Product Update Succesfully !!!'});
                            }
                    });
                } else{
                    await User.updateOne({"_id":req.body.id },{"$set" : {"name" : req.body.name,"desc":req.body.desc,
                        "price":req.body.price , "quantity":req.body.quantity ,"image": req.file.filename, "image_path": req.file.path }, upsert : true}).exec(function(err, book){
                            if(err) {
                                console.log(err);
                                res.status(401).send(err);
                            } else {
                                res.status(200).json({ message: 'Product Update Succesfully !!!'});
                            }
                    });   
                }
            }
        })
    })

    router.delete('/delete', (req, res) => {
        User.findOneAndRemove({ _id: req.query.id }).exec((err, user) =>{
            if(err) throw err;
            if(!user) {
                res.status(401).json({ message: 'Product not found' });
            } else {
                try {
                    fs.unlinkSync(`upload/${user.image}`);
                    res.status(200).json({ message: 'Product Successfully Deleted !!!' });
                } catch (e) {
                    res.status(400).send({ message: "Error deleting image!", error: e.toString(), req: req.body });
                }
            }
        })
    })

    return router;
}