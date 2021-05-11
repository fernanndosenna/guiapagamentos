const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

//configuraçoes do mercado pago

MercadoPago.configure({
    sandbox: true, //se true, "Mercado pago, estou em modo de desenvolvimento"
    access_token: "TEST-8037968047545823-051000-0ba6f275d808e898b12f365c5c8238b0-624215296"
});

//rota principal da aplicacao
app.get("/", (req,res) => {
    res.send("Olá mundo!");
})

//rota - gerando pagamento
app.get("/pagar", async (req,res) => {
    
    /*
        tabela de pagamentos para armazenar dados como;
        id / codigo / pagador / status
        1  / 32132132132 / email / nao foi pago
        2  / 3214214212132 / email / pago

    */
    var id = "" + Date.now();
    var emailDoPagador = "fernando.programador1998@gmail.com"

    var dados = {
        items: [
            item = { // item que eu quero vender
                id: id, //sem esse id, não é possível saber se o pagamento gerado foi pago ou não
                title: "2x video games; 3x camisas", //descricao do produto
                quantity: 1,
                currency_id: 'BRL', //moeda que irá pagar
                unit_price: parseFloat(150)//é necessário calcular o preco de acordo com algum contexto
            }
        ],
        payer: {
            email: emailDoPagador
        },
        external_reference: id//campo de consulta quando o pagamento for concluído
    }

    try {

        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        //após o pagamento com sucesso, é aqui que deveria salvar os status da compra no banco exemplo;
        /*banco.salvarPagamento({ìd: id, pagador: emailDoPagador}) */
        return res.redirect(pagamento.body.init_point); //manda o checkout do pagamento

    } catch (err) {
        return res.send(err.message);
    }

})

app.post("/not", (req,res) => {
    console.log(req.query);
    res.send("OK");
})


const port = 80
app.listen(port, (req,res) => console.log(`app rodando na porta ${port}`))