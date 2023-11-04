const { db } = require("./db");
const { Restaurant, Menu } = require("./models/index");
const { seedRestaurant, seedMenu } = require("./seedData");

console.log(seedMenu);

describe("Restaurant and Menu Models", () => {
    /**
     * Runs the code prior to all tests
     */

    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the
        // test suite is run
        await db.sync({ force: true });
        await Restaurant.bulkCreate(seedRestaurant);
        await Menu.bulkCreate(seedMenu);
    });

    test("can create a restaurant", async () => {
        const restaurant = await Restaurant.create({
            name: "Pink",
            location: "Upminster",
            cuisine: "Indian",
        });
        expect(restaurant.name).toBe("Pink");
        expect(restaurant.location).toBe("Upminster");
        expect(restaurant.cuisine).toBe("Indian");
        expect(restaurant instanceof Restaurant).toBeTruthy();
    });

    test("can create a menu", async () => {
        const menu = await Menu.create({ title: "Breakfast" });
        expect(menu.title).toBe("Breakfast");
        expect(menu instanceof Menu).toBeTruthy();
    });

    test("can find a restaurant", async () => {
        const foundRestaurant = await Restaurant.findOne({
            where: { name: "AppleBees" },
        });
        expect(foundRestaurant instanceof Restaurant).toBeTruthy();
        expect(foundRestaurant).toEqual(
            expect.objectContaining({
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
    });

    test("can find a menu", async () => {
        const foundMenu = await Menu.findOne({
            where: { title: "Breakfast" },
        });
        expect(foundMenu instanceof Menu).toBeTruthy();
        expect(foundMenu).toEqual(
            expect.objectContaining({
                title: "Breakfast",
            })
        );
    });

    test("can update a restaurant", async () => {
        const foundRestaurant = await Restaurant.findByPk(1);
        const updatedRestaurant = await foundRestaurant.update({
            name: "BeesApples",
        });
        expect(updatedRestaurant.name).toBe("BeesApples");
        expect(updatedRestaurant.id).toBe(1);
    });

    test("can update a menu", async () => {
        const foundMenu = await Menu.findByPk(1);
        const updatedMenu = await foundMenu.update({ title: "Dessert" });
        expect(updatedMenu.title).toBe("Dessert");
        expect(updatedMenu.id).toBe(1);
    });

    test("can delete a restaurants", async () => {
        const deletedRestaurant = await Restaurant.findByPk(3);
        const initialLength = (await Restaurant.findAll()).length;
        expect(deletedRestaurant.name).toEqual("Spice Grill");
        await deletedRestaurant.destroy();
        expect((await Restaurant.findAll()).length).toEqual(initialLength - 1);
    });

    test("can delete a menu", async () => {
        const deletedMenu = await Menu.findByPk(3);
        const initialLength = (await Menu.findAll()).length;
        expect(deletedMenu.title).toEqual("Dinner");
        await deletedMenu.destroy();
        expect((await Menu.findAll()).length).toEqual(initialLength - 1);
    });

    test("tests one restaurant has many menues association", async () => {
        const foundRestaurant = await Restaurant.findByPk(1);
        const foundMenu1 = await Menu.findByPk(1);
        const foundMenu2 = await Menu.findByPk(2);

        await foundRestaurant.addMenus([foundMenu1, foundMenu2]);

        const associatedMenus = await foundRestaurant.getMenus();
        expect(associatedMenus.length).toBe(2);
        expect(associatedMenus[0] instanceof Menu).toBe(true);
        expect(associatedMenus[1] instanceof Menu).toBe(true);
        expect(associatedMenus).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "Lunch" }),
            ])
        );
        expect(associatedMenus).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "Dessert" }),
            ])
        );
    });
});
