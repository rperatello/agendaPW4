
const { body, validationResult } = require("express-validator");
const { read } = require("fs");
const banco = require("../database/conexao")

module.exports = app => {
  
    /*ROTAS DE TELAS*/

    app.route("/").get((req, res) => {

        res.send(`
            <!DOCTYPE html>
            <html lang="PT_BR">
            
            <head>
                <meta charset="UTF-8">
                <title>Bem vindo a sua agenda eletrônica</title>
            </head>
            <body>
                <h1>Acesse sua agenda eletrônica</h1>
                <!-- DEFINIR UMA ROTA PARA TRATAMENTO E VERIFICAÇÃO DE DADOS DE LOGIN -->
                <form method=post action=#>
                    <p> Login:<input type=text name=login /> </p> 
                    <p> Senha:<input type=password name=password /> </p> 
                    <p> <input type=submit value="Login"> </p> 
                    <p><a href="/cadastrarUsuario">Cadastre-se</a></p>
                </form>
            </body>
            </html>
        `);
    });

    app.route("/cadastrarUsuario")
        .get((req, res) => {
            res.send(`
            <!DOCTYPE html>
                <html lang="PT_BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Bem vindo a sua agenda eletrônica</title>
                </head>
                <body>
                    <h1>Por favor preencha os campos abaixo</h1>
                    <form method=post action=registerUser>
                        <p> Login:<input type=text name=login /> </p> 
                        <p> Senha:<input type=password name=password /> </p> 
                        <p> <input type=submit value="Salvar novo usuário"> </p> 
                    </form>
                </body>
                </html>
            `);
    });

    app.route("/minhaAgenda").
        all(app.config.passport.authenticate())
        .post((req, res) => {
            res.send(`
            <!DOCTYPE html>
                <html lang="PT_BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Bem vindo a sua agenda eletrônica</title>
                </head>
                <body>
                    <!-- INDICAR O NOME DO USUÁRIO COM SESSÃO ATIVA -->
                    <p> Seja bem vindo, #### | <a href=logout>Sair</a>	</p>
                    <h1>Menu Principal</h1>
                    <p> <a href=meusContatos>Meus Contatos</a> </p>
                    <p> <a href=meusCompromissos>Meus Compromissos</a> </p>
                    <hr>
                    <p> <a href=novoContato>Adicionar Novo Contato</a> </p>
                    <p> <a href=novoCompromisso>Adicionar Novo Compromisso</a> </p>
                </body>
                </html>
            `);
    });

    app.route("/novoContato")
        .all(app.config.passport.authenticate())
        .get((req, res) => {
            res.send(`
            <!DOCTYPE html>
                <html lang="PT_BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Adicionar Contato - agenda eletrônica</title>
                </head>
                <body>
                    <!-- INDICAR O NOME DO USUÁRIO COM SESSÃO ATIVA -->
                    <p> Bem vindo: #### | <a href=minhaAgenda>Voltar</a>  |  <a href=logout>Sair</a> <p>
                    <h1>Informe os dados do Novo contato</h1>
                    <form method=post action=adicionarContato>
                        <p> Nome: <input type=text name=name /> </p> 
                        <p> Endereço: <input type=text name=adress /> </p>  
                        <p> Telefone: <input type=text name=phone /> </p> 
                        <p> E-mail: <input type=text name=email /> </p> 
                        <p> <input type=submit value="Salvar novo contato"> </p> 
                    </form>
                </body>
                </html>
            `);
    });

    app.route("/novoCompromisso")
        .all(app.config.passport.authenticate())
        .get((req, res) => {
            res.send(`
            <!DOCTYPE html>
                <html lang="PT_BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Adicionar Compromisso - agenda eletrônica</title>
                </head>
                <body>
                    <!-- INDICAR O NOME DO USUÁRIO COM SESSÃO ATIVA -->
                    <p> Bem vindo: #### | <a href=minhaAgenda>Voltar</a>  |  <a href=logout>Sair</a> <p>
                    <h1>Informe os dados do Novo Compromisso</h1>
                    <form method=post action=adicionarCompromisso>
                        <p> Local: <input type=text name=local /> </p> 
                        <p> Data: <input type=date name=date /> </p>  
                        <p> Contato: <input type=text name=contact /> </p> 
                        <p> Descrição: <input type=text width="200" height="100" name=description /> </p> 
                        <p> <input type=submit value="Salvar novo compromisso"> </p> 
                    </form>
                </body>
                </html>
            `);
    });

    app.route("/logout")
        .all(app.config.passport.authenticate())
        .get((req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html lang="PT_BR">
                
                <head>
                    <meta charset="UTF-8">
                    <title>Bem vindo a sua agenda eletrônica</title>
                </head>
                <body>
                    <p>Sessão Encerrada com Sucesso!</p>
                    <h1>Acesse sua agenda eletrônica</h1>
                    <!-- DEFINIR UMA ROTA PARA TRATAMENTO E VERIFICAÇÃO DE DADOS DE LOGIN -->
                    <form method=post action=#>
                        <p> Login:<input type=text name=login /> </p> 
                        <p> Senha:<input type=password name=password /> </p> 
                        <p> <input type=submit value="Login"> </p> 
                        <p><a href="/cadastrarUsuario">Cadastre-se</a></p>
                    </form>
                </body>
                </html>
            `);
    });

    //*ROTAS - Login

    app.post("/login", app.config.auth.login)
    app.post("/validateToken", app.config.auth.validateToken)

    //*ROTAS - CRUD DE USUÁRIOS

    //admin recebe 0 ou 1
    app.route("/adicionarUsuario").post([
            body("nome", "O nome é obrigatório.").trim().isLength({ min: 3, max: 80 }),
            body("login", "O login é obrigatório.").trim().isLength({ min: 3, max: 45 }),
            body("senha", "A senha precisa ter no mínimo 3 dígitos e no máximo 45.").trim().isLength({ min: 3, max: 45 }),
            body("admin").trim(),
        ],
        async (req, res) => {
            console.log("rota utilizada quando o usuário confirmar dados preenchidos em relação novo usuário");
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send(erros.array())
            } else {
                const resultado = await banco.insereUsuario({
                    nome: req.body.nome,
                    login: req.body.login,
                    senha: req.body.senha,
                    admin: req.body.admin,
                });
                res.send(resultado);
            }
        });

    app.route("/alterarUsuario")
        .all(app.config.passport.authenticate())
        .all(app.config.passport.authenticate())
        .put([
            body("id", "O id do usuário é obrigatório.").trim().isLength({ min: 1 }),
            body("nome", "O nome é obrigatório.").trim().isLength({ min: 3, max: 80 }),
            body("senha", "A senha precisa ter no mínimo 3 dígitos e no máximo 45.").trim().isLength({ min: 3, max: 45 }),
            body("admin").trim(),
            ],
            async (req, res) => {
                console.log("rota utilizada quando o usuário alterar dados preenchidos de um usuário");
                const erros = validationResult(req);
                if (!erros.isEmpty()) {
                    res.send(erros.array())
                } else {
                    const resultado = await banco.alteraUsuario({
                        id: req.body.id,
                        nome: req.body.nome,
                        senha: req.body.senha,
                        admin: req.body.admin,
                    });
                    res.send(resultado);
                }
            }
        );

    app.route("/excluirUsuario")
        .all(app.config.passport.authenticate())
        .delete([
            body("id", "O id do usuário é obrigatório.").trim().isLength({ min: 1 }),        
        ],
        async (req, res) => {
        console.log("rota utilizada quando o usuário excluir um usuário");
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.send(erros.array())
        } else {
            const resultado = await banco.excluiUsuario(req.body.id);
            res.send(resultado);
        }
    });

    app.route("/selecionarUsuario/:id?")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada quando o usuário selecionar um usuário");
        if (req.params.id) {
            const resultado = await banco.selecionaUsuario(req.params.id);
            res.send(resultado);
        } else {
            res.send("Favor informar um id de usuário válida!")
        }
    });

    app.route("/listarUsuarios")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada quando o usuário deseja listar todos os usuário.");
        const resultado = await banco.listaTodosUsuarios();
        res.send(resultado);
    });


    //*ROTAS - CRUD DE COMPROMISSOS

    //exemplo de data '2011-12-18 13:17:17'
    app.route("/adicionarCompromisso")
        .all(app.config.passport.authenticate())
        .post([
            body("data", "A data é obrigatória)").trim().isLength({ min: 19 }),
            body("obs").trim(),
            body("participantes").trim(),
            body("endereco").trim(),
            body("status").trim(),
            body("user_id").trim().isLength({ min: 1 }),
        ],
        async (req, res) => {
            console.log("rota utilizada quando o usuário confirmar dados preenchidos em relação novo compromisso");
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send(erros.array())
            } else {
                const resultado = await banco.insereCompromisso({
                    data: req.body.data,
                    obs: req.body.obs,
                    participantes: req.body.participantes,
                    endereco: req.body.endereco,
                    status: req.body.status,
                    user_id: req.body.user_id,
                });
                res.send(resultado);
            }
    });

    app.route("/alterarCompromisso")
        .all(app.config.passport.authenticate())
        .put([
            body("id", "O id do compromisso é obrigatório!").trim().isLength({ min: 1 }),
            body("data", "A data é obrigatória!").trim().isLength({ min: 19 }),
            body("obs").trim(),
            body("participantes").trim(),
            body("endereco").trim(),
            body("status").trim(),
            body("user_id").trim().isLength({ min: 1 }),
        ],
        async (req, res) => {
            console.log("rota utilizada caso o usuário opte por alterar os dados de um compromisso selecionado");
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send(erros.array())
            } else {
                const resultado = await banco.alteraCompromisso({
                    id: req.body.id,
                    data: req.body.data,
                    obs: req.body.obs,
                    participantes: req.body.participantes,
                    endereco: req.body.endereco,
                    status: req.body.status,
                    user_id: req.body.user_id,
                });
                res.send(resultado);
            }
    });

    app.route("/excluirCompromisso")
        .all(app.config.passport.authenticate())
        .delete([
            body("id", "O id do compromisso é obrigatório.").trim().isLength({ min: 1 }),        
        ],
        async (req, res) => {
        console.log("rota utilizada quando o usuário excluir um compromisso");
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.send(erros.array())
        } else {
            const resultado = await banco.excluiCompromisso(req.body.id);
            res.send(resultado);
        }
    });

    app.route("/selecionarCompromisso/:id?")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada quando o usuário selecionar um compromisso");
        if (req.params.id) {
            const resultado = await banco.selecionaCompromisso(req.params.id);
            res.send(resultado);
        } else {
            res.send("Favor informar um id de compromisso válido!")
        }
    });

    app.route("/meusCompromissos/:id?")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada caso o usuário opte por acessar e listar sua agenda de compromissos");
        if (req.params.id) {
            const resultado = await banco.listaTodosCompromissos(req.params.id);
            res.send(resultado);
        } else {
            res.send("Favor informar um id de usuário válida!")
        }
    });


    //*ROTAS - CRUD DE CONTATOS

    app.route("/adicionarContato")
        .all(app.config.passport.authenticate())
        .post([
            body("nome", "O nome é obrigatório.").trim().isLength({ min: 3, max: 80 }),
            body("telefone").trim(),
            body("endereco").trim(),
            body("user_id").trim().isLength({ min: 1 }),
        ],
        async (req, res) => {
            console.log("rota utilizada quando o usuário confirmar dados preenchidos em relação novo contato");
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send(erros.array())
            } else {
                const resultado = await banco.insereContato({
                    nome: req.body.nome,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    endereco: req.body.endereco,
                    user_id: req.body.user_id,
                });
                res.send(resultado);
            }
    });

    app.route("/alterarContato")
        .all(app.config.passport.authenticate())
        .put([
            body("id", "O id do contato é obrigatório.").trim().isLength({ min: 1 }),
            body("nome", "O nome é obrigatório.").trim().isLength({ min: 3, max: 80 }),
            body("telefone").trim(),
            body("endereco").trim(),
            body("user_id").trim().isLength({ min: 1 }),
        ],
        async (req, res) => {
            console.log("rota utilizada caso o usuário opte por alterar os dados de um contato selecionado");
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                res.send(erros.array())
            } else {
                const resultado = await banco.alteraContato({
                    id: req.body.id,
                    nome: req.body.nome,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    endereco: req.body.endereco,
                    user_id: req.body.user_id,
                });
                res.send(resultado);
            }
    });

    app.route("/excluirContato")
        .all(app.config.passport.authenticate())
        .delete([
            body("id", "O id do compromisso é obrigatório.").trim().isLength({ min: 1 }),        
        ],
        async (req, res) => {
        console.log("rota utilizada caso o usuário opte por deletar um contato selecionado");
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.send(erros.array())
        } else {
            const resultado = await banco.excluiContato(req.body.id);
            res.send(resultado);
        }
    });

    app.route("/selecionarContato/:id?")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada quando o usuário selecionar um contato");
        if (req.params.id) {
            const resultado = await banco.selecionaContato(req.params.id);
            res.send(resultado);
        } else {
            res.send("Favor informar o id de um contato válido!")
        }
    });

    app.route("/meusContatos/:id?")
        .all(app.config.passport.authenticate())
        .get(async (req, res) => {
        console.log("rota utilizada caso o usuário opte por acessar e listar sua agenda de contatos");
        if (req.params.id) {
            const resultado = await banco.listaTodosContatos(req.params.id);
            res.send(resultado);
        } else {
            res.send("Favor informar um id de usuário válido!")
        }
    });

}