const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session')
const passport = require('passport')
const authConfig = require('./server/controllers/authConfig')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const gymController = require('./server/controllers/gymController');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(session({
    name: 'GymProject-App',
    secret: process.env.SECRET, 
    cookie: {
        expires:  5 * 24 * 60 * 60 *1000,
    },
    saveUninitialized: false,
    rolling: true,
    resave: false,
}))

massive(process.env.CONNECTION_STRING)
    .then(db =>{
        app.set('db', db)
         //runs the function as soon as the server is started
        disableRoutes();
    })
    .catch(err=>{
        console.error(`can't connect to db: ${err}`)
});

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY,
    region: 'us-west-1'
})

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gym-project',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});



    //---------Authentication---------//
passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback"
  },
    (accessToken, refreshToken, profile, done) =>{
      const db = app.get('db')
      db.users.findOne({google_id: profile.id})
        .then(user=>{
            if(!user){
               return db.users.insert({
                        google_id: profile.id, 
                        first_name: profile.name.givenName, 
                        last_name: profile.name.familyName,
                        image: profile.photos[0].value
                    })
                .then(newUser=>{
                     done(null, newUser)
                  })
                  .catch(err=>{
                      console.error(err)
                  })
            }
             done(null, user)
        })
        .catch(err=>{
            console.error(err)
        })
    }
));

passport.serializeUser((user, done) => {
    if (!user) {
        done('No user');
    }
    done(null, user.id);
});
    
passport.deserializeUser((id, done) => {
    const db = app.get('db');
    db.users.findOne({id: id})
    .then((user)=>{
        if(!user){
            return done(null, false)
        }
        //puts the entire user object on req
        done(null, user)
    })
});

app.use(passport.initialize())
app.use(passport.session())

    
//------custom middleware---------//
 function checkDb() {
        return (req, res, next) => {
            const db = app.get('db');            
                if (db) {
                    req.db = db;
                    next();
                }
                else {
                    res.status(500).send({ message: 'database not connected' });
                }
        };
}
 app.use(checkDb());


 setInterval(disableRoutes, (24 * 60 * 60 * 1000));
 
 function disableRoutes(){
     let date = new Date();
     const db = app.get('db');
     db.CHECK_DATES([date])
        .then(result=>{
         console.log('routes disabled')
        })
        .catch(err=>{
         console.log(err)
        })
 };

 function isLoggedIn(req, res, next){
    if(req.user){
       return next()
    }
    else{
       return res.status(403)
    }
 }




//-------auth endpoints-------//

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    if(req.user.role){
        res.redirect(`//${process.env.HOST}:${process.env.FRONTEND_PORT}/dashboard`);
     } 
     else{
        res.redirect(`//${process.env.HOST}:${process.env.FRONTEND_PORT}/set-role`);
     }
    
});

//---------user endpoints--------//
app.get(`/api/user`, isLoggedIn, (req, res)=>{
    let user = {
        id: req.user.id,
        role: req.user.role,
        first_name: req.user.first_name,
        image: req.user.image
    }
    res.send(user)
})

app.put(`/api/user-role`, (req, res)=>{
    req.db.users.update({id: req.user.id, role: req.body.role})
        .then(user=>{
            let userRoles = {
                role: user.role,
                temporaryRole: user.role
            }
            res.send(userRoles)
        })
        .catch(err=>{
            console.log(err)
        })
})

//------gym endpoints-----//

app.get(`/api/gyms`, (req, res)=>{
    req.db.gym_listings.find()
        .then(gyms =>{
            res.send(gyms)
        })
        .catch(err=>{
            console.log(err)
        })
})

app.get(`/api/users-gyms`, isLoggedIn, (req,res)=>{
    req.db.GET_USERS_GYMS([req.user.id])
        .then(gyms=>{
            res.send(gyms)
        })
        .catch(err=>{
            console.log(err)
        })
})


app.post(`/api/gym`, (req, res)=>{
    req.db.gym_listings.insert(req.body)
        .then(gym_listing =>{
            res.send(gym_listing)
        })
        .catch(err=>{
            console.log(err)
        })
})


app.post(`/api/users-gym`, (req,res)=>{
    req.db.users_gyms.insert({gym_id: req.body.gym_id, user_id: req.user.id})
        .then(gym=>{
            req.db.GET_USERS_GYMS([req.user.id])
                .then(gyms=>{
                    res.send(gyms)
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
})

//----------route endpoints-------------//

app.get(`/api/routes/:gym_id`, (req, res)=>{
    req.db.GET_ROUTES([req.params.gym_id])
        .then(routes=>{
            let allRoutes = [];
            let settersRoutes = [];
            let disabledRoutes = []
            routes.map(route=>{
                if(route.setter_id === req.user.id){
                    settersRoutes.push(route)
                }
                if(route.disabled === true){
                    disabledRoutes.push(route)
                }
                if(route.disabled === false){
                    allRoutes.push(route)
                }
            })
            res.send({allRoutes: allRoutes, settersRoutes: settersRoutes, disabledRoutes: disabledRoutes})
        })
        .catch(err=>{
            console.log(err)
        })
})


app.get(`/api/route/:route_id`, (req, res)=>{
    req.db.GET_ROUTE([req.params.route_id])
        .then(route=>{
            req.db.GET_RATINGS([route[0].id])
                .then(ratings=>{
                    let values=[];
                    let letters=[]
                    ratings.map(obj=>{
                        let rating = obj.rating.split('')
                        if(route[0].type === 'bouldering'){
                            values.push(Number(rating.slice(1).join('')))
                        }
                        if(route[0].type === 'sport'){
                            letters.push(rating.pop())
                            values.push(Number(rating.slice(2).join('')))
                        }
                    })
               
                    let avgRating = 'No climber ratings';

                    if(values.length > 0){
                        avgRating = Math.round((values.reduce((a=0, b)=> a += b)) / values.length)
                    
                        if(route[0].type === 'bouldering'){
                            avgRating = ('V' + avgRating.toString())
                        }
                        if(route[0].type === 'sport'){
                            let numbers = []

                            // foo = {'a': 1, 'b':2}
                            // numbers.push foo[letter]
                            letters.map(letter=>{
                                switch (letter){
                                    case 'a':
                                    numbers.push(1)
                                    break;
                                    case 'b':
                                    numbers.push(2)
                                    break;
                                    case 'c':
                                    numbers.push(3)
                                    break;
                                    case 'd':
                                    numbers.push(4)
                                    break;
                                    default:
                                    console.log(letter)
                                }
                            })
                        let number = Math.round((numbers.reduce((a, b)=> a += b)) / numbers.length)
                        let letter;
                        switch (number){
                            case 1:
                                letter ='a'
                                break;
                            case 2:
                                letter ='b'
                                break;
                            case 3:
                                letter ='c'
                                break;
                            case 4:
                            letter ='d'
                            break;
                            default: 
                            console.log(number)
                            }

                        avgRating = ('5.' + avgRating.toString() + letter)
                        }
                    }
                    res.send({...route[0], avgRating})
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
})

app.post(`/api/route`, (req, res)=>{
    req.db.routes.insert(req.body)
        .then(route=>{
            disableRoutes();
            res.send(route)
        })
        .catch(err=>{
            console.log(err)
        })
})


app.put(`/api/route`, (req, res)=>{
    req.db.routes.update(req.body)
        .then(route=>{
            disableRoutes()
            res.send(route)
        })
        .catch(err=>{
            console.log(err)
        })
})

app.post('/api/route-image/:route_id', upload.array('abc',1), (req, res, next)=> {
    req.db.routes.update({id: req.params.route_id, image: req.files[0].location})
        .then(response=>{
            res.send({message: 'uploaded!', route: response})
        })
        .catch(err=>{
            console.log(err)
        })
});

function deleteFile(fileName){
    const bucketInstance = new aws.S3();
    var params = {
        Bucket: 'gym-project',
        Key: fileName
    };
    bucketInstance.deleteObject(params, function (err, data) {
        if (data) {
            console.log("File deleted successfully");
        }
        else {
            console.log("Check if you have sufficient permissions : "+err);
        }
    });
};

app.put('/api/route-image', (req, res)=>{
    deleteFile(req.body.fileName)
    req.db.routes.update({id: req.body.route_id, image: null})
        .then(route=>{
            res.send({message: 'deleted!', route: route})
        })
        .catch(err=>{
            console.log(err)
        })
})

//-------------comments endpoints ------------//


 app.get(`/api/comments/:route_id`, (req, res)=>{
     req.db.GET_COMMENTS([req.params.route_id])
        .then(comments=>{
            res.send(comments)
        })
        .catch(err=>{
            console.log(err)
        })
 })

 app.post(`/api/comment`, (req,res)=>{
     req.db.comments.insert({user_id: req.user.id, ...req.body, created_at: new Date()})
        .then(result=>{
            req.db.GET_COMMENTS([req.body.route_id])
                .then(comments=>{
                    res.send(comments)
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
 })

 app.put(`/api/comment`, (req, res)=>{
     req.db.comments.update({...req.body, updated_at: new Date() })
        .then(comment=>{
            res.send(comment)
        })
        .catch(err=>{
            console.log(err)
        })
 })

 app.delete(`/api/comment/:route_id/:comment_id`, (req, res)=>{
     req.db.comments.destroy({id: req.params.comment_id})
        .then(result=>{
            req.db.GET_COMMENTS([req.params.route_id])
                .then(comments=>{
                    res.send(comments)
                })
                .catch(err=>{
                    console.log(err)
                })
         })
         .catch(err=>{
            console.log(err)
        })
})

 //------------Tick Endpoints ------------//
 app.get(`/api/ticks/`, isLoggedIn, (req, res)=>{
     req.db.GET_TICKS([req.user.id])
        .then(ticks=>{
            res.send(ticks)
        })
        .catch(err=>{
            console.log(err)
        })
 })

 app.post(`/api/tick`, (req, res)=>{
     let date = new Date()
     req.db.ticks.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, gym_id: req.body.gym_id})
        .then(tick=>{
            req.db.star_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, stars: req.body.stars})
                .then(stars=>{
                    req.db.difficulty_ratings.insert({date_created: date, user_id: req.user.id, route_id: req.body.route_id, rating: req.body.rating})
                        .then(rating=>{
                            req.db.todos.destroy({user_id: req.user.id, route_id: req.body.route_id})
                                .then(todo=>{
                                    req.db.GET_TICKS([req.user.id])
                                        .then(ticks=>{
                                            res.send(ticks)
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
 })

 app.delete(`/api/tick/:route_id`, (req, res)=>{
    req.db.ticks.destroy({user_id: req.user.id, route_id: req.params.route_id})
        .then(tick=>{
            req.db.star_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
                .then(star=>{
                    req.db.difficulty_ratings.destroy({user_id: req.user.id, route_id: req.params.route_id})
                        .then(rating=>{
                            req.db.GET_TICKS([req.user.id])
                                .then(ticks=>{
                                    res.send({message: 'tick removed', ticks: ticks})
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
 })

 //-----------Todo Endpoints-------------//
 app.get(`/api/todos/`, isLoggedIn, (req, res)=>{
    req.db.GET_TODOS([req.user.id])
       .then(todos=>{
           res.send(todos)
       })
       .catch(err=>{
           console.log(err)
       })
})
app.post(`/api/todo`, (req, res)=>{
    req.db.todos.insert({date_created: new Date(), user_id: req.user.id, route_id: req.body.route_id, gym_id: req.body.gym_id})
        .then(todo=>{
            req.db.GET_TODOS([req.user.id])
                .then(todos=>{
                    res.send(todos)
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        .catch(err=>{
            console.log(err)
        })
})

app.delete(`/api/todo/:route_id`, (req, res)=>{
    req.db.todos.destroy({user_id: req.user.id, route_id: req.params.route_id})
        .then(todo=>{
            req.db.GET_TODOS([req.user.id])
            .then(todos=>{
                res.send(todos)
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
})

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`This server is listening on port ${port}`)
})