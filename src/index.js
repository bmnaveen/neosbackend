
const crypto = require("crypto");
const PORT = process.env.PORT || 5000
const http=require("http");
const fs=require("fs");

var User=fs.readFileSync("./user.json");
var Todo=fs.readFileSync("./todo.json");
var userObject=JSON.parse(User);
var todoObject=JSON.parse(Todo);




http.createServer(async function(req,res){
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    //   res.setHeader('Access-Control-Request-Method', '*');
    //   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, PATCH');
    //   res.setHeader('Access-Control-Allow-Headers', req.header.origin);
    //   res.setHeader("Content-Type", "application/json");
    const headers={
			"Access-Control-Allow-Origin":"*", 
			"Access-Control-Allow-Methods":"GET, POST, DELETE, PUT, PATCH", 
			"Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept" ,
		}
    //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //   res.setHeader ("Access-Control-Expose-Headers", "Content-Length, X-JSON");
    //   res.setHeader ("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    //   res.setHeader ("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Accept-Language, X-Authorization");
    //   res.setHeader('Access-Control-Max-Age','86400');
var url=req.url;
if(url==="/register" && req.method==="POST"){
  
    let data;
    for await (const chunk of req) {
       data=chunk;
      }
      
let newObject=JSON.parse(data);
const id = crypto.randomBytes(16).toString("hex");
newObject["id"]=id;
let check=false;

      userObject.forEach((e)=>{
        if(e["Mobile"]==newObject["Mobile"]){
check=true;
        }
      })

if(check){
    res.writeHead(200,headers);
       //set the response
       res.write(JSON.stringify(null));
       //end the response
        res.end();
        return     
}
      
   let combineArray=[...userObject,newObject];
   let newArray=JSON.stringify(combineArray);
   let errors=null
   fs.writeFile("./user.json", newArray, (err) => {
      //Error checking
     if(err) errors=err
       
     });
if(errors!=null){
    
    
    console.log(errors)
    return
}else{
    //response headers
    res.writeHead(200,headers);
    //set the response
    res.write(JSON.stringify(newObject["id"]));
    //end the response
     res.end();
     return 
}
     
}else if(url==="/signin" && req.method==="POST"){
  
    let data;
    for await (const chunk of req) {
       data=chunk;
      }
      
let newObject=JSON.parse(data);

let check=false;
let id;
      userObject.forEach((e)=>{
        if(e["Mobile"]==newObject["Mobile"]&&e["Email"]==newObject["Email"]){
            id=e["id"]
check=true;
        }
      })
      if(check){
        res.writeHead(200,headers);
           //set the response
           res.write(JSON.stringify(id));
           //end the response
           res.end();   
           return  
    }else{
        res.writeHead(200,headers);
           //set the response
           res.write(JSON.stringify("null"));
           //end the response
            res.end(); 
            return 
    }
}else if(url==="/addtodo" && req.method==="POST"){
    let data;
    for await (const chunk of req) {
       data=chunk;
      }
      let newObject=JSON.parse(data);
      const id = crypto.randomBytes(16).toString("hex");
      newObject["id"]=id;
      
            
         let combineArray=[...todoObject,newObject];
         let newArray=JSON.stringify(combineArray);
         let errors=null
         fs.writeFile("./todo.json", newArray, (err) => {
            //Error checking
           if(err) errors=err
             
           });
      if(errors!=null){
          console.log(errors)
          return
      }else{
          //response headers
          res.writeHead(200,headers);
          //set the response
          res.write(JSON.stringify(newObject["id"]));
          //end the response
           res.end();
           return 
      }

}else if(url==="/gettodo" && req.method==="POST"){
    let tempData=[];
    let data;
    for await (const chunk of req) {
       data=chunk;
       data=JSON.parse(data)
      }
    let id = data["Id"]
    todoObject.forEach((gf)=>{
        if(gf["User"]==id){
tempData.push(gf)
        }
    })


//response headers
res.writeHead(200,headers);

//set the response
res.write(JSON.stringify(tempData));
//end the response
 res.end();
 return 


}else if(url==="/deletetodo" && req.method==="POST"){
 
    let data;
    for await (const chunk of req) {
       data=chunk;
       data=JSON.parse(data)
      }
    let todoid = data["todoId"];
    let userid=data["userId"];
    let find=true;
    todoObject.forEach((gf,i)=>{
        
        if(gf["id"]==todoid){
            todoObject.splice(i,1)
            find=false
        }
    })
    if(find){
        //response headers
     res.writeHead(200,headers);
     //set the response
     res.write(JSON.stringify("Acess Deniend"));
     //end the response
      res.end();
      return 
    }
    let errors=null
    fs.writeFile("./todo.json", JSON.stringify(todoObject), (err) => {
       //Error checking
      if(err) errors=err
        
      });
 if(errors!=null){
     console.log(errors)
     return
 }else{
     //response headers
     res.writeHead(200,headers);
     //set the response
     res.write(JSON.stringify("sucess"));
     //end the response
      res.end();
      return 
 }

} else{
    
    res.writeHead(404,{"Content-Type": "application/json"});
    res.end(JSON.stringify({ message: "Route not found" }));
}

}).listen(PORT,async()=>{
    try{
        console.log(`Port connected on ${PORT}`);
    }catch(err){
        console.log(err);
    }
})




