const sequelize=require('sequelize');

const db=new sequelize({
    dialect:'sqlite',
    storage:'todos.db'
})

const list=db.define('todo',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    task:{
      type:sequelize.STRING
    },
    username:{
        type:sequelize.STRING

    },
    striked:{
        type:sequelize.BOOLEAN,
        default:false
    }
    
})


const users=db.define('user',{
    username:{
        type:sequelize.STRING,
    },
    email:{
        type:sequelize.STRING,
    },
    password:{
        type:sequelize.STRING,
    },
    fbAccessToken: {
        type: sequelize.STRING,
      },
     
})




db.sync().then(()=>{
    console.log('db created')
})
module.exports={
    list,db,users
}