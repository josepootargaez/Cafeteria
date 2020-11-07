const express=require("express");
const bodyParser = require('body-parser');
const path=require("path");
const app=express();
const mongoose=require("mongoose");
const Usuario=require("./models/users");
const Coffe=require("./models/coffes");
const session=require("express-session");
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views",path.join(__dirname+"/views"));
app.use(express.json());
app.use(session({
    secret:'mykey12',
    resave:false,
    saveUninitialized:false
}));
// app.set("view engine","ejs");
//se utiliza para utilizar html sin cambiar la extension a .ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//base de datos
mongoose.connect("mongodb+srv://Admin:Admin-1@cluster0.tymyc.mongodb.net/Cafeteria?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
.then(db=>console.log("conectado")).catch(err=> console.log(err));

var server=app.listen(process.env.port || 3000,function(){
    var port=server.address().port;
    console.log("server on port "+port);
});

app.get("/",  (req, res)=>{

    // console.log(JSON.stringify(usuarios));
    // res.sendFile(path.join(__dirname+"/views/index.html"));
    if(typeof(req.session.user)!="undefined"){
        res.redirect("/Dashboard");
    }else{
        res.render("index");
    }


});


app.get("/Dashboard",(req,res)=>{
    if(typeof(req.session.user)!="undefined"){
        res.render("Dashboard");
    }else{
        res.redirect("/");
    }

});
app.get("/logout",(req,res)=>{
    req.session.destroy(function(err) {
        // cannot access session here
        var result={
            success:true,
            error:'',

        }    
        res.send(result);
    })
});
app.get("/getCoffe", async(req,res)=>{
    var result={
        success:false,
        error:'',
        datos:'',
    }
    if(typeof(req.session.user)!="undefined"){
        const coffes = await Coffe.find({}).exec();
        if(coffes.length>0){
            result.success=true;
            result.datos=coffes;
            console.log(result);
            res.json(result);
        }else{
            result.error="no se encontraron datos";
            res.json(result);
        }
    }else{
        res.redirect("/")
    }
});
app.post("/login", async (req,res,next)=>{
    console.log(req.body);
    const users = await Usuario.find({correo:req.body.user,password:req.body.pass}).exec();
    // // console.log(users[0].correo);
    var result={
        success:false,
        error:''
    }
    if(users.length>0){
        req.session.user=req.body.user;
        result.success=true
        res.send(result);
    }else{
        result.error='Usuario o password incorrecto';
        res.send(result);
    }
});

app.post("/addUser", async (req,res)=>{
    // console.log(new user(req.body));
    const users = await Usuario.find({correo:req.body.correo}).exec();
    var result={
        success:false,
        error:'',
        message:'',
    }
    // console.log(users[0].correo);
    if(users.length>0){
        result.error="el correo ya esta registrado";
        res.send(result);
    }else{
        const usuario=new Usuario(req.body);
        await usuario.save();
        result.message="¡Cuenta creada exitosamente!"
        result.success=true;
        res.send(result);
    }
    // console.log(req.body.newuser);
});

app.post("/addCoffe", async (req,res)=>{
    // console.log(new user(req.body));
    const coffes = await Coffe.find({correo:req.body.Nombre}).exec();
    var result={
        success:false,
        error:''
    }
    // console.log(users[0].correo);
    if(coffes.length>0){
        result.error="esta sucursal ya esta registrada";
        res.send(result);
    }else{
        const coffe=new Coffe(req.body);
        await coffe.save();
        result.success=true;
        res.send(result);
    }
    // console.log(req.body.newuser);
});



app.get("/getDataUser",(req,res)=>{
    var result={
        success:true,
        error:'',
        user:''
    }
    if(typeof(req.session.user)!="undefined"){
    const user=req.session.user;
    result.user=user;
    res.json(result);
    }else{
        res.redirect("/");
    }
});

