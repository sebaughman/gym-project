const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = {

    newGoogleStrategy: ()=>{
        new GoogleStrategy({
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
        );
    },

    serializeUser: (user, done) => {
        if (!user) {
            done('No user');
        }
        done(null, user.id);
    },

    deserializeUser: (id, done) => {
        const db = app.get('db');
        db.users.findOne({id: id})
        .then((user)=>{
            if(!user){
                return done(null, false)
            }
            //puts the entire user object on req
            done(null, user)
        })
    },

}