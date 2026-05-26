const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const app = express();
const cors = require("cors");
const port = 8001;
const Models = require("./models");
require("dotenv").config();
// const { runSeeders } = require("./seeder.js");

// Use body-parser for JSON parsing
app.use(bodyParser.json());
app.use(cors());

// Sync Database
// Models.sequelize
//   .sync({
//     force: false,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Nice! Database looks fine");
//   })
//   .catch(function (err) {
//     console.log(err, "Something went wrong with the Database Update!");
//   });

// runSeeders;

app.use("/uploads", express.static("uploads"));

// routers
const authRouter = require("./routes/authRouter.js");
const roleRoutes = require("./routes/roleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const branchServiceRoutes = require("./routes/branchServiceRoutes");
const branchRoutes = require("./routes/branchRoutes");
const companySettingRoutes = require("./routes/companySettingRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const reportRoute = require("./routes/reportRoute");

app.use("/api/auth", authRouter);
app.use("/api/roles", roleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", branchServiceRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/company-settings", companySettingRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/reports", reportRoute);

//---------------------------------------------//
app.listen(8001, () => {
  const port = "8001";
  console.log("running...");
});
