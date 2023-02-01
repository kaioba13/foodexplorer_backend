const knex = require("../database/knex");
const AppError = require("../utils/ErroApp");

async function ensureAdmin(request, response, next) {
  const { id } = request.user;

  const user = await knex("users").where({ id });

  const isAdmin = user[0].is_admin;

  if (!isAdmin) {
    throw new AppError("Você não é um administrador", 401);
  }

  return next();
}

module.exports = ensureAdmin;
