/*
 *   Nome: Silvanei de Almeida Martins;
 *   E-mail: silvaneimartins_rcc@hotmail.com;
 *   Contato Telegram: (69) 9.8405-2620;
 *   Frase: Estamos em constante mudança no aprendizado;
 *   Assinatura: Silvanei Martins;
 */
const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find((repository) => repository.id === id);
  if (!repository) {
    return response.status(404).send({ error: "Repositório não encontrado!" });
  }
  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request;
  const repoIndex = repositories.indexOf(repository);
  if (repoIndex === -1) {
    return response.status(404).json({ error: "Repositório não encontrado!" });
  }
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { repository } = request;
  repository.likes++;
  return response.status(201).json(repository);
});

module.exports = app;
