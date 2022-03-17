const User = require('./user')
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const express = require('express')
const cors = require('cors')

module.exports = function(router){

    // router.post('/',async(req,res)=>{
    //     console.log('hey_________post',req.body);
    //     // let user = new User();
    //     const user = await User();
    //     user.username = req.body.username
    //     user.phonenumber = req.body.phonenumber
    //     user.email = req.body.email
    //     user.password = req.body.password
    //     user.save()
    //     res.send(req.body);

    // })
    // router.get('/',(req,res)=>{
    //     res.send('Hey_____This Is get')
    // })

   

    

    router.post('/', (req, res) => {
        var user = new User();

        user.username = req.body.username
        user.phonenumber = req.body.phonenumber
        user.email = req.body.email
        user.password = req.body.password
        user.temporarytoken = jwt.sign({ email: user.email }, secret, { expiresIn: '1h' });

        if(req.body.username == null || req.body.phonenumber == "" || req.body.email == null || req.body.password == ""){
            res.json({ success: false, message: 'Ensure Username,  password and email were provided'});
        } else {
            user.save(function(err) {
                if(err) {
                    if (err.errors != null) {
                        if(err.errors.username) {
                            res.json({ success: false, message: 'Required minimum digits 3 of User Name' });
                       } else if(err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if(err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        }
                    } else {
                        res.json({success:false, message:err});
                    }
                } else {
                    res.json({ success: true, message: 'Successfully Registered !'});
                }
            })
        }
    });

    router.post('/add', (req, res) => {
        var user = new User();

        user.username = req.body.username
        user.phonenumber = req.body.phonenumber
        user.email = req.body.email
        user.password = 'Test@1234'
        user.temporarytoken = jwt.sign({ email: user.email }, secret, { expiresIn: '1h' });

        if(req.body.username == null || req.body.phonenumber == "" || req.body.email == null || req.body.password == ""){
            res.json({ success: false, message: 'Ensure Username,  password and email were provided'});
        } else {
            user.save(function(err) {
                if(err) {
                    if (err.errors != null) {
                        if(err.errors.username) {
                            res.json({ success: false, message: 'Required minimum digits 3 of User Name' });
                       } else if(err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if(err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        }
                    } else {
                        res.json({success:false, message:err});
                    }
                } else {
                    res.json({ success: true, message: 'Successfully Registered !'});
                }
            })
        }
    });


    router.post('/login', function(req, res){
        User.findOne({ email: req.body.email }).select('email password').exec(function(err, user) {
            if (err) throw err;
            else {
                if (!user) {
                    res.json({ success: false, message: 'email and password not provided !!!' });
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'No password provided' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate password' });
                        } else{
                            //res.send(user);
                            var token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '24h' }); 
                            res.json({ success: true, message: 'User authenticated!', token: token });
                        }             
                    }
                }
            }   
        });
    });

    router.put('/forgate', function(req, res) {
        User.findOne({ email:req.body.email }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else{
                // user.username = req.body.username;
                // user.phonenumber = req.body.phonenumber;
                user.password = req.body.password;
                // user.email = req.body.email;
               user.save(function(err) {
                    if (err) {
                        console.log(err); 
                    } else {
                        res.json({ success: true, message: 'Details has been updated!' });
                    }
                });
            }
        });
    })

    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    router.get('/', function(req, res) { 
        User.find({}, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else {
                res.json({ success: true, user: user });
            }
        });
    });

    router.get('/:id', function(req, res) { 
        User.findOne({ _id: req.params.id }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else {
                res.json({ success: true, user: user });
            }
        });
    });

    router.delete('/:id', function(req, res) {
        User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
            if(err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No user found' });
            } else {
                res.json({ success: true, message: 'Your Account has been delete now !!!' });
            }
        })
    });

    router.put('/:id', function(req, res) {
        User.findOne({ _id: req.params.id }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else{
                user.username = req.body.username;
                user.phonenumber = req.body.phonenumber;
                user.email = req.body.email;
               user.save(function(err) {
                    if (err) {
                        console.log(err); 
                    } else {
                        res.json({ success: true, message: 'Details has been updated!' });
                    }
                });
            }
        });
    })


   

    return router;
}