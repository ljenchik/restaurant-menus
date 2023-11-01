const { db, DataTypes, Model } = require("../db");

class Menu extends Model {}

Menu.init(
    {
        title: DataTypes.STRING,
    },
    { sequelize: db, modelName: "Menu" }
);

module.exports = { Menu };
