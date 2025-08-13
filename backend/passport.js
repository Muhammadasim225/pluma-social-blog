const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy=require('passport-github2').Strategy;
const passport=require('passport');
const prisma=require('./DB/db.config')
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},

async function(accessToken, refreshToken, profile, done) {

    try{
        const email=profile.emails[0].value;
        const full_name=profile.displayName;
        const profile_pic=profile.photos[0].value;

        let user=await prisma.user.findUnique({
            where:{
                email_address:email
            }
        })
        if(!user){
            user=await prisma.user.create({
                data:{
                    email_address:email,
                    full_name,
                    password: 'google-oauth',
                    profile_pic,
                    createdAt:new Date()
                }
            })

        }
        return done(null,user)

    }
    catch (err) {
        console.error("OAuth error:", err);
        return done(err, null);
      }

  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
   
    try{
        const email=profile.emails[0].value;
        const full_name=profile.displayName;
        const profile_pic=profile.photos[0].value;

        let user=await prisma.user.findUnique({
            where:{
                email_address:email
            }
        })
        if(!user){
            user=await prisma.user.create({
                data:{
                    email_address:email,
                    full_name,
                    password: 'github-oauth',
                    profile_pic,
                    createdAt:new Date()
                }
            })

        }
        return done(null,user)

    }
    catch (err) {
        console.error("OAuth error:", err);
        return done(err, null);
      }
  }
));

 

passport.serializeUser((user,done)=>{
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });