var express = require("express");
var mongoose = require("mongoose");

const app = express();
const port = 3000;

const data_base = "mongodb+srv://nigerio_bezerra:nigerio_bezerra@cluster0.pdhkp.mongodb.net/biblioteca?retryWrites=true&w=majority";

//DB conection

mongoose.connect(data_base, { useNewUrlParser: true, useUnifiedTopology: true });
//Criar modelo da colection

const Livros = mongoose.model("livros", {
    titulo: String,
    autor: String,
    editora: String,
    ano: Number,
    quantidade: Number,
})

//ejs mecanismo de view
app.set("view engine", "ejs");
app.set("views", __dirname, "/views");

//json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Acesso à public
app.use("/public", express.static("public"));

//Router
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/teste", (req, res) => {
    res.render("teste");
});

//rota para listagem dos livros
app.get("/lista", (req, res) => {
    let item = Livros.find({}, (err, livro) => {
        if (err) {
            return res.status(500).send("Erro ao consultar livros!")
        }
        else {
            res.render("lista", { item: livro });
        }
    });
});

//router renderiza cadastr livroslivro
app.get("/cadastro", (req, res) => {
    res.render("cadastro");
})

//Router guardar no banco
app.post("/cadastro", (req, res) => {
    let livro = new Livros();// criando objeto do tipo livro
    livro.titulo = req.body.titulo;
    livro.autor = req.body.autor;
    livro.editora = req.body.editora;
    livro.ano = req.body.ano;
    livro.quantidade = req.body.quantidade;

    livro.save((err) => {
        if (err) {
            return res.status(500).send("Erro ao cadastrar!")
        }
        else {
            return res.redirect("/lista")
        }
    })
})

//DELETAR
app.get("/deletar/:id", (req, res) => {
    let chave = req.params.id;

    Livros.deleteOne({ _id: chave }, (err, result) => {
        if (err) {
            return res.status(500).send("Erro ao excluir registro")
        } else {
            res.redirect("/lista")
        }
    });

})

//EDITAR

app.get("/editar/:id", (req, res) => {
    let chave = req.params.id;


    let itens = Livros.find({ _id: chave }, (err, valor) => {
        if (err) {
            return res.status(500).send("Erro ao consultar livro!")
        }
        else {
            res.render("editar", { itens: valor });
        }
    });

})


//UPDATE

app.post("/update", (req, res) => {

    function updateCallback(err, result) {
        if (err) {
            console.log('err')
            res.send(err)
        }
        else {
            console.log('atualizado')
            res.redirect("/lista")
        }
    }

    Livros.findByIdAndUpdate({ _id: req.body._id }, req.body, updateCallback);
})


//pesquisa

// function diacriticSensitiveRegex(string = '') {
//     return string
//         .replace(/a/g, '[a,á,à,ä]')
//         .replace(/c/g, '[c,ç]')
//         .replace(/e/g, '[e,é,ë]')
//         .replace(/i/g, '[i,í,ï]')
//         .replace(/o/g, '[o,ó,ö,ò]')
//         .replace(/u/g, '[u,ü,ú,ù]');
// }

app.get("/pesquisa", (req, res) => {
    let valor = req.query.sh;//Recebe o nema da box pesquisa
    let campo = req.query.campo;
    
    //valor = valor.match(/[\p{Letter}\s]+/gu);
    // valor = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();//Retira os acentos com rejex

    // { $regex : new RegExp(valor, "i") } --> fica case insensitive

    // let qr = {
    //     name:
    //     {
    //         $search: valor,
    //         $caseSensitive: false,
    //         $diacriticSensitive: false
    //     }
    // }

    // qr = { titulo: { $regex: valor, $options: 'i' } };
    qr = `{ "${campo}": { "$regex": "${valor}", "$options": "i" } }`;
    let qro = JSON.parse(qr);
    let item = Livros.find(qro, (err, itens) => {
        if (err) {
            return res.status(500).send("Erro ao consultar livro!");
        }
        else {
            res.render("lista", { item: itens });
        }
    });

});


// /////////////////////////////////////////////

app.get("/teste", (req, res) => {
    if (err) {
        return res.status(500).send("Erro ao consultar livro!");
    }
    else {
        res.render("teste");
    }
});








//Definindo a porta que a aplicação está rodando
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});