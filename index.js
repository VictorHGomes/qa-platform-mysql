const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/database.js')
const Pergunta = require('./database/Pergunta.js')
const Resposta = require ('./database/Resposta.js')
//Database 
connection.authenticate().then(() => {
    console.log("Conexão feita com o banco de dados")
}).catch((msgErro) => {
    console.log(msgErro);
})



//Estou dizendo para o express usar o EJS como o View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.get('/', (req, res) => {
    //SELECT * FROM pergunta
    Pergunta.findAll({ raw: true, order: [['id', 'DESC']]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })

    })
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})


app.post("/salvarpergunta", (req, res) => {
    const titulo = req.body.titulo
    const descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then((respostas) => {
                res.render('pergunta', {
                pergunta: pergunta,
                respostas: respostas
            })
            })
        }else{
            res.redirect('/')
        }
    })
})

app.post("/responder", (req,res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    })
})

app.listen(8080, () => {
    console.log("app rodando!")
});