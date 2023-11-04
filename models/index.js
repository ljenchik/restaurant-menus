const { Restaurant } = require("./Restaurant");
const { Menu } = require("./Menu");

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

module.exports = { Restaurant, Menu };
