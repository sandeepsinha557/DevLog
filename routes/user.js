const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup");
})
router.post('/signup',async (req,res)=>{
    const {fullName , password , email } = req.body;
    try{
        await User.create({
            fullName,
            email,
            password
        });

        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect('/');
    }catch(err){
        console.error(err);
        return res.render('signup', {
            error: 'Signup failed. Please try again.'
        });
    }
})

router.post('/signin',async(req,res)=>{
    const { password , email  } = req.body;
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);
        console.log("Token",token);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error:"Incorrect Email or Password",
        });
    }
    
})


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.redirect('/user/signin');
});

module.exports=router;