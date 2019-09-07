const express=require('express')
const app=express();
const session=require('express-session')
const {passport}=require('./setupmypassport')
app.set('view engine','hbs')
const {db,list,users}=require('./db')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'abcd efgh ijkl',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60,
    }
}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login'
}))

function checkLoggedIn(req, res, next) {
    if (req.user) {
        console.log(req.user);
        console.log("req.user "+req.user.username)
        return next()
    }
    res.redirect('/login')
  }
  app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.post('/signup',(req,res)=>{
    users.create(
        {
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
        })
        .then((user)=>{
            console.log(user)
            res.redirect('/login')
        })
        .catch((err)=>{
            console.log(err)
            res.redirect('/signup')
        })
    
})

app.get('/login/facebook', passport.authenticate('facebook'))

app.get('/login/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/',checkLoggedIn,(req,res)=>{
    res.render('index')
})



app.use('/',express.static(__dirname+'/public'))

app.post('/todostask',checkLoggedIn,(req,res)=>{
    if(req.body.task){
    list.create({
        username:req.user.username,
        task:req.body.task
    }).then((task)=>{
        list.findAll({
            where:{
                username:req.user.username, 
            }
        }).then((alltask)=>{
            res.json(alltask)
        })
    })
    }
    else
    {
        list.findAll({
            where:{
                username:req.user.username, 
            }
        }).then((alltask)=>{
            res.json(alltask)
        })
    }
})

app.post('/tobedeleted',checkLoggedIn,(req,res)=>{
    list.destroy({
        where:{
            username:req.user.username,
            task:req.body.task
        }
    }).then(()=>{
        res.sendStatus(204)
    })
})

app.post('/striked',checkLoggedIn,(req,res)=>{
    list.update(
        {striked:true},
        {where:{
            task:req.body.task,
            username:req.user.username
        }
        }
    ).then((updated)=>{
        res.json(updated)
    })
})

app.listen(4000,()=>{
    console.log('http://localhost:4000')
})