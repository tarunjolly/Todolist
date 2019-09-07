const passport=require('passport')
const localstrategy=require('passport-local').Strategy
const {db,users,list}=require('./db')
const FacebookStrategy = require('passport-facebook').Strategy


passport.use(
    new localstrategy((username,password,done)=>{
        users.findOne({
            where:{
                username,
            },
        }).then((user)=>{
            if(!user)
            return done(new Error('invalid username'))

            if(user.password!=password)
            return done(null,false)

            return done(null,user)
        })
        .catch(done)
    })
)
passport.use(
    new FacebookStrategy(
      {
        clientID: '',
        clientSecret: '7e4ddb1f2e52fcf81f274ce7af4e29bb',
        callbackURL: 'http://localhost:4000/login/facebook/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        users.create({
          
          
            username: profile.id,
            fbAccessToken: accessToken,
          
        })
          .then((user) => {
            done(null, user)
          })
          .catch(done)
      },
    ),
  )
  
  


passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((userid,done)=>{
    users.findOne({
        where:{
            id:userid
        }
    }).then((user)=>{done(null,user)})
        .catch(done)
})


module.exports={passport}