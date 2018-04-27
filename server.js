const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session')
const passport = require('passport')
const authConfig = require('./server/controllers/authConfig')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const gymController = require('./server/controllers/gymController');
const commentController = require('./server/controllers/commentController');
const todoController = require('./server/controllers/todoController');
const routeController = require('./server/controllers/routeController');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const tickController = require('./server/controllers/tickController');

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

///-----amazon s3 stuff--------///
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
app.get(`/api/gyms`, gymController.getGyms)

app.get(`/api/users-gyms`, isLoggedIn, gymController.getUsersGyms)

app.post('/api/gym', gymController.postGym)

app.post(`/api/users-gym`, gymController.postUsersGym)


//----------route endpoints-------------//

app.get(`/api/routes/:gym_id`, routeController.getRoutes)

app.get(`/api/route/:route_id`, routeController.getRoute)

app.post(`/api/route`, routeController.postRoute)

app.put(`/api/route`, routeController.updateRoute)

app.post('/api/route-image/:route_id', upload.array('abc',1), (req, res, next)=> {
    req.db.routes.update({id: req.params.route_id, image: req.files[0].location})
        .then(response=>{
            res.send({message: 'uploaded!', route: response})
        })
        .catch(err=>{
            console.log(err)
        })
});

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

app.get(`/api/comments/:route_id`, commentController.getComments)

app.post(`/api/comment`, commentController.postComment)

app.delete(`/api/comment/:route_id/:comment_id`, commentController.deleteComment)

 //------------Tick Endpoints ------------//

 app.get(`/api/ticks`, isLoggedIn, tickController.getTicks)

 app.post(`/api/tick`, tickController.postTick)

 app.delete(`/api/tick/:route_id`, tickController.deleteTick)

 //-----------Todo Endpoints-------------//
 app.get(`/api/todos/`, isLoggedIn, todoController.getTodos)

 app.post(`/api/todo`, todoController.postTodo)

 app.delete(`/api/todo/:route_id`, todoController.deleteTodo)


const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`This server is listening on port ${port}`)
})