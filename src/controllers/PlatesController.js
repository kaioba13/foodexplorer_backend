const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class PlatesController {
  async create(request, response) {
    const { title, description, ingredients, price } = request.body;

    const { filename: imgFilename } = request.file;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imgFilename);

    const plates_id = await knex("plates").insert({
      img: filename,
      title,
      description,
      price,
    });

    const ingredientsInsert = ingredients.map((name) => ({
      name,
      plates_id,
    }));

    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let plates;

    if (ingredients) {
      const filterIngredients = ingredients.split(",").map((tag) => tag.trim());

      plates = await knex("ingredients")
        .select([
          "plates.id",
          "plates.title",
          "plates.description",
          "plates.price",
          "plates.img",
        ])
        .whereLike("plates.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("plates", "plates.id", "ingredients.plates_id")
        .groupBy("plates.id")
        .orderBy("plates.title");
    } else {
      plates = await knex("plates")
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const listIngredients = await knex("ingredients");

    const platesWithIngredients = plates.map((plate) => {
      const plateIngredients = listIngredients.filter(
        (ingredient) => ingredient.plates_id === plate.id
      );

      return {
        ...plate,
        ingredients: plateIngredients,
      };
    });

    return response.json(platesWithIngredients);
  }

  async show(request, response) {
    const { id } = request.params;

    const plate = await knex("plates").where({ id }).first();
    const ingredient = await knex("ingredients")
      .where({ plates_id: id })
      .orderBy("name");

    return response.json({
      ...plate,
      ingredient,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("plates").where({ id }).delete();

    return response.json();
  }

  async update(request, response) {
    const { title, description, ingredients, price, type } = request.body;
    const { id } = request.params;
    const { filename: imgFilename } = request.file;

    const diskStorage = new DiskStorage();

    const plate = await knex("plates").where({ id }).first();

    if (plate.img) {
      await diskStorage.deleteFile(plate.img);
    }

    const filename = await diskStorage.saveFile(imgFilename);

    plate.img = filename;
    plate.title = title ?? plate.title;
    plate.description = description ?? plate.description;
    plate.price = price ?? plate.price;

    const ingredientsInsert = ingredients.map((name) => ({
      name,
      plates_id: plate.id,
    }));

    await knex("plates").where({ id }).update(plate);
    await knex("ingredients").where({ plates_id: id }).delete();
    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }
}

module.exports = PlatesController;
