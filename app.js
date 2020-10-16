const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash'); //Usando o lodash para facilitar encontrar a url, caso não exista
const mongoose = require('mongoose');
const config = require(__dirname + '/config.js') //Localização do database


const homeStartingContent = "Bem vindo ao meu blog. Ele funciona de forma incremental, ou seja, cada post vai ser adicionado abaixo do post anterior. De forma que você poderá visualizar esse blog em ordem cronológica";
const aboutContent = "Esse blog foi feito ao longo do curso 'The Complete 2020 Web Development Bootcamp' na Udemy. A princípio foi criado para treinar ejs e depois mongodb.";
const contactContent = "Esse blog pertence a Matheus Werneck. Para contato, envie um email para matwer12@gmail.com. Obrigado pela visita!";

const app = express();

const posts = []

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// -------------- Database --------------------

mongoose.connect(config.mongoDB + '/blog', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  titulo: String,
  texto: String
}

const Post = mongoose.model('Post', postSchema);

 // -------------------------------------
app.get('/', function(req, res){
   
  Post.find(function(err, posts){
    if(posts.length === 0){
      console.log('Sem itens')
      res.render('home', {paraHome: homeStartingContent})
    } else{
      res.render('home', {paraHome: homeStartingContent, posts: posts})
    }
  })
})

app.get('/about', function(req, res){
  res.render('about', {
    paraAbout: aboutContent
  })
})

app.get('/contact', function(req, res){
  res.render('contact', {
    paraContato: contactContent
  })
})

app.get('/compose', function(req, res){
  res.render('compose')
})


app.post('/compose', function (req, res){
  const post = new Post({titulo: req.body.titulo, texto:req.body.texto})
  post.save(function(err){
    res.redirect('/')
  })
})



// app.get('/posts/:nomeDoPost', function(req, res){
//   const nome = _.lowerCase(req.params.nomeDoPost)
//   posts.forEach(function(item){
//     let tituloPost = _.lowerCase(item.titulo)
//     if(nome === tituloPost){
//       console.log('Correspondência encontrada')
//       res.render('post', {titulo: item.titulo, texto: item.texto})   
//     }
//     else{
//       console.log('Not found')
//     }
//   })
// })

app.get('/posts/:id', function(req, res){
  const id = req.params.id
  Post.findOne({_id: id}, function(err, post){
    if (!post){
      res.render('404')
    }
    else{
      res.render('post', {titulo: post.titulo, texto: post.texto})
    }
  })
})


app.listen(3000, function() {
  console.log("Servidor rodando na porta 3000");
});
