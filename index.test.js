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
    });

    test("can create a Restaurant", async () => {
        const restaurant = await Restaurant.create({
            name: "Pink",
            location: "Upminster",
            cuisine: "Indian",
        });
        expect(restaurant.name).toBe("Pink");
        expect(restaurant.location).toBe("Upminster");
        expect(restaurant.cuisine).toBe("Indian");
    });

    test("can create a Menu", async () => {
        const menu = await Menu.create({ title: "Breakfast" });
        expect(menu.title).toBe("Breakfast");
    });

    test("can find Restaurants", async () => {
        await Restaurant.bulkCreate(seedRestaurant);
        const foundRestaurant = await Restaurant.findOne({
            where: { name: "AppleBees" },
        });
        expect(foundRestaurant).toEqual(
            expect.objectContaining({
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
    });

    test("can find Menus", async () => {
        await Menu.bulkCreate(seedMenu);
        const foundMenu = await Menu.findOne({
            where: { title: "Breakfast" },
        });
        expect(foundMenu).toEqual(
            expect.objectContaining({
                title: "Breakfast",
            })
        );
    });

    test("can update Restaurants", async () => {
        await Restaurant.bulkCreate(seedRestaurant);
        const found = await Restaurant.findByPk(1);
        const updatedRestaurant = await found.update({ name: "BeesApples" });
        expect(updatedRestaurant).toEqual(
            expect.objectContaining({
                name: "BeesApples",
            })
        );
        const newfoundRestaurant = await Restaurant.findByPk(1);
        expect(newfoundRestaurant).toEqual(
            expect.objectContaining({
                name: "BeesApples",
            })
        );
    });

    test("can delete Restaurants", async () => {
        await Restaurant.bulkCreate(seedRestaurant);
        const deletedRestaurant = await Restaurant.findOne({
            where: { name: "AppleBees" },
        });
        expect(deletedRestaurant).toEqual(
            expect.objectContaining({
                name: "AppleBees",
                location: "Texas",
                cuisine: "FastFood",
            })
        );
    });
});
