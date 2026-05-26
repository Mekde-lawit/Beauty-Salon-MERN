const { Sequelize } = require("sequelize");
const db = require("./models");

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/config/config.json")[env];

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Run the seeders
const runSeeders = async () => {
  try {
    // 1. Company Settings
    const CompanySettingData = await db.CompanySetting.findAll();
    if (CompanySettingData?.length === 0) {
      await db.CompanySetting.bulkCreate([
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
    }

    // 2. Roles
    const RolesData = await db.Role.findAll();
    if (RolesData?.length === 0) {
      await db.Role.bulkCreate([
        { name: "Customer", createdAt: new Date(), updatedAt: new Date() },
        { name: "Receptionist", createdAt: new Date(), updatedAt: new Date() },
        { name: "Staff", createdAt: new Date(), updatedAt: new Date() },
        { name: "Manager", createdAt: new Date(), updatedAt: new Date() },
      ]);
    }

    // 3. Users
    const [roles] = await sequelize.query("SELECT id, name FROM Roles");
    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    const UsersData = await db.User.findAll();
    if (UsersData?.length === 0) {
      await db.User.bulkCreate([
        {
          name: "Admin User",
          email: "admin@glamoursalon.com",
          password: "5f4dcc3b5aa765d61d8327deb882cf99", // Replace with actual hash
          roleId: roleMap.Manager,
          phone: "+1 (555) 765-4321",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Main Branch Manager",
          email: "manager@glamoursalon.com",
          password: "5f4dcc3b5aa765d61d8327deb882cf99", // Replace with actual hash
          roleId: roleMap.Manager,
          phone: "+1 (555) 987-6543",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // // 4. Branch
    const [manager] = await sequelize.query(
      "SELECT id FROM Users WHERE email = ? LIMIT 1",
      {
        replacements: ["manager@glamoursalon.com"],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const BranchesData = await db.Branch.findAll();
    if (BranchesData?.length === 0) {
      await db.Branch.bulkCreate([
        {
          name: "Main Branch",
          location: "456 Downtown Plaza, Glam City",
          phone: "+1 (555) 555-1234",
          contactPersonId: manager.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

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

    const ServiceData = await db.Service.findAll();
    if (ServiceData?.length === 0) {
      await db.Service.bulkCreate(servicePromises);
    }

    // 6. Link Services to Branch
    const branch = await sequelize.query("SELECT id FROM Branches LIMIT 1", {
      type: Sequelize.QueryTypes.SELECT,
    });

    const allServices = await sequelize.query("SELECT id FROM Services", {
      type: Sequelize.QueryTypes.SELECT,
    });

    const branchServices = allServices.map((service) => ({
      branchId: branch[0].id,
      serviceId: service.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const BranchServicesData = await db.BranchService.findAll();
    if (BranchServicesData?.length === 0) {
      await db.BranchService.bulkCreate(branchServices);
    }

    console.log("Seeders executed successfully");
  } catch (error) {
    console.error("Error executing seeders:", error);
  } finally {
    // Close the Sequelize connection
    await sequelize.close();
  }
};

// Run the seeders
runSeeders();
