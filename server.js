'use strict';

require('dotenv').config();

const express = require('express');

const superagent = require('superagent');

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const methodOverride = require('method-override');

const server = express();

server.set('view engine', 'ejs');

const PORT = process.env.PORT;

server.use(express.json());

server.use(methodOverride('_method'));

server.use(express.urlencoded({ extended: true }));

server.use(express.static('./public'));


server.get('/',homepagealljokes);

server.post('/add',addtoDBS);

server.get('/showall',showall);

server.post('/details/:id',showdetails);

server.put('/update/:id',updatedata);
server.delete('/delete/:id',deletedata);

server.get('/random',random);



function homepagealljokes(req,res) {
    let URL=`https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(URL)
    .then(apidata=>{
        let jokArr=apidata.body.map(val=>{

            let newjok=new JOKES(val);
            return newjok;
        });
        res.render('index',{jokes:jokArr});
    });
    
}


function random(req,res) {
    let URL=`https://official-joke-api.appspot.com/jokes/programming/random`;
    superagent.get(URL)
    .then(apidata=>{
                
            let jokArr2=new JOKES(apidata.body[0]);
            // console.log(apidata.body)
            res.render('pages/searches/random',{randjok:jokArr2});
        });
    
    
}


function addtoDBS(req,res) {
    let {type,setup,punchline}=req.body;
    
    console.log(req.body.type)

    let SQL=`INSERT INTO myexam (type,setup,punchline) VALUES ($1,$2,$3);`;
    let save=[type,setup,punchline];
    client.query(SQL,save)
    .then(data=>{
        res.redirect('showall');
    });
    
}

function showall(req,res) {
    let SQL=`SELECT * FROM myexam;`;
    client.query(SQL)
    .then(data=>{
        res.render(('pages/myfav'),{myfav:data.rows});
    });
    
}


function showdetails(req,res) {
    let id=req.params.id;
    let SQl=`SELECT * FROM myexam WHERE id=$1 ;`;
    let save=[id];
    client.query(SQl,save)
    .then(data=>{
        res.render('pages/details',{detail:data.rows[0]});
    });
    
}

function updatedata(req,res) {
    let id =req.body.id;
    let {type,setup,punchline}=req.body;
    let SQL=`UPDATE myexam SET type=$1,setup=$2,punchline=$3 WHERE id=$4 ;`;
    let save=[type,setup,punchline,id];
    client.query(SQL,save)
    .then(data=>{
        res.redirect('/showall');

    });
    
}



function deletedata(req,res) {
    let id= req.body.id;
    let SQL=`DELETE FROM myexam WHERE id=$1;`;
    let save=[id];
    client.query(SQL,save)
    .then(data=>{
        res.redirect('/showall');
    });
    
}




function JOKES(data) {
    this.type=data.type;
    this.setup=data.setup;
    this.punchline=data.punchline;

}

client.connect()
.then(
    server.listen(PORT,()=>{
        console.log(`on port ${PORT}`);
    })
);