// seeders/XXXXXXXXXXXXXX-initial-seed.js
"use strict";

const parseTime = (timeStr) => {
  if (timeStr.toLowerCase().includes("hour")) {
    const [hours, minutes] = timeStr
      .replace("hours", "")
      .split(":")
      .map(Number);
    return hours * 60 + minutes;
  }
  return parseInt(timeStr) || null;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Company Settings
    await queryInterface.bulkInsert("CompanySettings", [
      {
        companyName: "ሳምር የውበት ሳሎን",
        logo: "/images/logo.png",
        description: "Premium beauty services with a touch of elegance",
        contactEmail: "info@glamoursalon.com",
        phone: "+1 (555) 123-4567",
        address: "123 Beauty Avenue, Glam City",
        socialMedia: JSON.stringify({
          facebook: "https://facebook.com/glamoursalon",
          instagram: "https://instagram.com/glamoursalon",
        }),
        businessHours: JSON.stringify({
          Monday: "9:00 AM - 7:00 PM",
          Tuesday: "9:00 AM - 7:00 PM",
          Wednesday: "9:00 AM - 7:00 PM",
          Thursday: "9:00 AM - 8:00 PM",
          Friday: "9:00 AM - 8:00 PM",
          Saturday: "10:00 AM - 6:00 PM",
          Sunday: "Closed",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Roles
    await queryInterface.bulkInsert("Roles", [
      { name: "Customer", createdAt: new Date(), updatedAt: new Date() },
      { name: "Receptionist", createdAt: new Date(), updatedAt: new Date() },
      { name: "Stylist", createdAt: new Date(), updatedAt: new Date() },
      { name: "Manager", createdAt: new Date(), updatedAt: new Date() },
      { name: "Admin", createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 3. Users
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id, name FROM Roles"
    );

    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin User",
        email: "admin@glamoursalon.com",
        password: "$2b$10$ExampleHash", // Replace with actual hash
        roleId: roleMap.Admin,
        phone: "+1 (555) 765-4321",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Main Branch Manager",
        email: "manager@glamoursalon.com",
        password: "$2b$10$ExampleHash", // Replace with actual hash
        roleId: roleMap.Manager,
        phone: "+1 (555) 987-6543",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 4. Branch
    const [manager] = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email = ? LIMIT 1",
      {
        replacements: ["manager@glamoursalon.com"],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    await queryInterface.bulkInsert("Branches", [
      {
        name: "Main Branch",
        location: "456 Downtown Plaza, Glam City",
        phone: "+1 (555) 555-1234",
        contactPersonId: manager[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 5. Services
    const services = [
      // Hair Services
      {
        name: "Haircut",
        category: "hair",
        isForChildren: false,
        estimatedTimeWomen: 45,
        price: 45.0,
        description: "Professional haircut for women",
      },
      {
        name: "Hair Dye",
        category: "hair",
        isForChildren: false,
        estimatedTimeWomen: 120,
        price: 85.0,
        description: "Full hair coloring service",
      },
      // ... Add all other services following the same pattern
      // Example for children-allowed service:
      {
        name: "Hair Styling",
        category: "hair",
        isForChildren: true,
        estimatedTimeWomen: 90,
        estimatedTimeChildren: 75,
        price: 60.0,
        description: "Special occasion hairstyling",
      },
      // Waxing Services
      {
        name: "Full Body Waxing",
        category: "skin",
        isForChildren: false,
        estimatedTimeWomen: 170,
        price: 150.0,
        description: "Complete body waxing service",
      },
    ];

    const servicePromises = services.map((service) => ({
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Services", servicePromises);

    // 6. Link Services to Branch
    const [branch] = await queryInterface.sequelize.query(
      "SELECT id FROM Branches LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [allServices] = await queryInterface.sequelize.query(
      "SELECT id FROM Services",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const branchServices = allServices.map((service) => ({
      branchId: branch[0].id,
      serviceId: service.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("BranchServices", branchServices);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("BranchServices", null, {});
    await queryInterface.bulkDelete("Services", null, {});
    await queryInterface.bulkDelete("Branches", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
    await queryInterface.bulkDelete("CompanySettings", null, {});
  },
};
