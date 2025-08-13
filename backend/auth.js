const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const passport=require('passport');
router.get('/google',passport.authenticate("google", { scope: ['profile', 'email'] }))
router.get('/github',passport.authenticate("github", { scope: ['profile', 'email'] }))
require('dotenv').config()

router.get("/login/success",(req,res)=>{
    if(req.user){
        res.status(200).json({
            success:true,
            message:"Successful",
            user:req.user
        })
    }

})
router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        success:false,
        message:"failure"
    })

})
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect(process.env.CLIENT_URL)
})
router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/login/failed',
      session: true, // must match session setup
    }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign(
          { id: req.user.id, email: req.user.email_address },
          process.env.SECRET_KEY,
          { expiresIn: '7d' }
        );
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production (with HTTPS)
            sameSite: 'Lax',
          });
          res.redirect(process.env.CLIENT_URL + '/');    }
  );

  router.get('/github/callback', 
    passport.authenticate('github',{
        failureRedirect: '/auth/login/failed',
        session: true, // must match session setup
      }),
    (req, res)=> {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email_address },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
          );
      
          res.cookie('token', token, {
              httpOnly: true,
              secure: false, // set to true in production (with HTTPS)
              sameSite: 'Lax',
            });
            res.redirect(process.env.CLIENT_URL + '/'); 
    });

  module.exports=router