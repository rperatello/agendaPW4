var express = require('express');
var app = express();
const consign = require('consign')

app.use(express.urlencoded({ extended: true }));

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./config/auth.js')
    .then('./rotas/rotas.js')
    .into(app)

/*LISTEN DO EXPRESS*/

app.listen(8080, function () {
    console.log("Rodando na porta 8080");
});