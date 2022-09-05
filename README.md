# Project18-Valex

#Criação de cartão
POST para a rota "/creation" com um body no formato:

body = {
  "id": 1,
  "type": "health"
}

*Onde id é o id do usuário e type o tipo do cartão, que pode ser 'groceries', 'restaurants', 'transport', 'education' ou 'health'.
*Além disso, deve ser enviado um authorization no header contendo uma chave de API (API Key) válida.

#Ativação de cartão
POST para a rota "/activation" com um body no formato:

body = {
  "id": 8,
  "CVC": "845"
  "password": "1234"
}

*CVC no formato string

#Visualização das transações
GET para a rota "/transactions/:id" informando o id do cartão, ex:
http://localhost:4000/transactions/8

#Bloqueio de cartão
POST para a rota "/block" com um body no formato:

body = {
  "id": 8,
  "password": "1234"
}

#Desbloqueio de cartão
POST para a rota "/unlock" com um body no formato:

body = {
  "id": 8,
  "password": "1234"
}

#Recarga de cartão
POST para a rota "/recharge" com um body no formato:

body = {
  "id": 8,
  "amount": 10000
}

*Onde "id" é o id do cartão que se pretende fazer a recarga e "amount" o valor.
*Além disso, deve ser enviado um authorization no header contendo uma chave de API (API Key) válida.

#Compra no cartão em pontos de vendas (POS, sigla em ingês)
POST para a rota "/purchase" com um body no formato:

body = {
  "cardId": 8,
  "password": "1234",
  "businessId": 2,
  "amount": 5000
}

*Onde "cardId" é o id do cartão que se pretende fazer a compra, "password" a senha do cartão, "businessId", o id da loja que foi realizada a compra e "amount" o valor.

