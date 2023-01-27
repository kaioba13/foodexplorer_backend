class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    response.send({ name, email, password });
  }
}

module.exports = UserController;
