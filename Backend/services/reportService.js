const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const { formatDate } = require("../utils/formatting");

async function checkModelAssociations() {
  if (!db.Sale || !db.Sale.associations) {
    throw new Error("Sale model is not properly initialized");
  }

  const requiredAssociations = ["Branch", "Service", "Staff", "Customer"];
  for (const assoc of requiredAssociations) {
    if (!db.Sale.associations[assoc]) {
      throw new Error(`Sale model missing required association: ${assoc}`);
    }
  }
}

const generateReport = async (options) => {
  const { type, startTime, endDate, branchId, staffId, serviceId, search } =
    options;

  const where = {
    // startTime: {
    //   [Op.between]: [startTime, endDate],
    // },
    status: {
      [Op.not]: "cancelled",
    },
  };

  if (branchId) where.branchId = branchId;
  if (staffId) where.staffId = staffId;
  if (serviceId) where.serviceId = serviceId;
  if (search) {
    where[Op.or] = [
      { "$Branch.name$": { [Op.iLike]: `%${search}%` } },
      { "$Service.name$": { [Op.iLike]: `%${search}%` } },
      { "$Staff.name$": { [Op.iLike]: `%${search}%` } },
      { "$Customer.name$": { [Op.iLike]: `%${search}%` } },
      { status: { [Op.iLike]: `%${search}%` } },
    ];
  }

  switch (type) {
    case "appointments":
      return generateAppointmentsReport(where);
    case "staff-performance":
      return generateStaffPerformanceReport(where);
    case "service-analysis":
      return generateServiceAnalysisReport(where);
    case "revenue":
      return generateRevenueReport(where);
    default:
      throw new Error("Invalid report type");
  }
};

const generateAppointmentsReport = async (where) => {
  const appointments = await db.Appointment.findAll({
    where,
    include: [
      { model: db.Branch, as: "branch", attributes: ["name"] },
      {
        model: db.Service,
        as: "service",
        attributes: ["name", "price", "estimatedTimeWomen"],
      },
      { model: db.User, as: "staff", attributes: ["name"] },
      { model: db.User, as: "customer", attributes: ["name"] },
    ],
    order: [["startTime", "DESC"]],
  });

  const data = appointments.map((appt) => ({
    id: appt.id,
    date: appt.startTime, // Use startTime instead of date
    branchName: appt.branch?.name,
    serviceName: appt.service?.name,
    staffName: appt.staff?.name,
    customerName: appt.customer?.name,
    amount: appt.service?.price,
    duration:
      appt.service?.estimatedTimeWomen || appt.service?.estimatedTimeChildren,
    status: appt.status,
  }));

  const summary = {
    totalRevenue: appointments.reduce(
      (sum, appt) =>
        sum + (appt.status === "completed" ? appt?.service?.price : 0),
      0
    ),
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter((a) => a.status === "completed")
      .length,
    cancelledAppointments: appointments.filter((a) => a.status === "cancelled")
      .length,
    averageServiceTime:
      appointments.length > 0
        ? appointments.reduce(
            (sum, appt) => sum + appt.service.estimatedTimeWomen,
            0
          ) / appointments.length
        : 0,
    topPerformingStaff: await getTopPerformingStaff(where),
    mostPopularService: await getMostPopularService(where),
  };

  return { data, summary };
};

const generateRevenueReport = async (where) => {
  const appointments = await db.Appointment.findAll({
    where: {
      ...where,
      status: "completed",
    },
    include: [
      { model: db.Branch, as: "branch", attributes: ["name"] },
      { model: db.Service, as: "service", attributes: ["name", "price"] },
      { model: db.User, as: "staff", attributes: ["name"] },
      { model: db.User, as: "customer", attributes: ["name"] },
    ],
    order: [["startTime", "DESC"]],
  });

  const data = appointments.map((appt) => ({
    id: appt.id,
    date: appt.date,
    branchName: appt.branch.name,
    serviceName: appt.service.name,
    staffName: appt.staff.name,
    customerName: appt.customer.name,
    amount: appt.service?.price,
    status: appt.status,
  }));

  const summary = {
    totalRevenue: appointments.reduce(
      (sum, appt) => sum + appt.service.price,
      0
    ),
    totalAppointments: appointments.length,
    averageRevenuePerAppointment:
      appointments.length > 0
        ? appointments.reduce((sum, appt) => sum + appt.service.price, 0) /
          appointments.length
        : 0,
    revenueByBranch: await getRevenueByBranch(where),
    revenueByService: await getRevenueByService(where),
  };

  return { data, summary };
};

const generateStaffPerformanceReport = async (where) => {
  const results = await db.Appointment.findAll({
    where: {
      ...where,
      // status: "completed",
    },
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("startTime")), "date"],
      [Sequelize.col("Staff.id"), "staffId"],
      [Sequelize.col("Staff.name"), "staffName"],
      [
        Sequelize.fn("COUNT", Sequelize.col("Appointment.id")),
        "appointmentCount",
      ],
      [Sequelize.fn("SUM", Sequelize.col("Service.price")), "totalRevenue"],
      [
        Sequelize.fn("AVG", Sequelize.col("Service.estimatedTimeWomen")),
        "avgServiceTime",
      ],
    ],
    include: [
      { model: db.User, as: "staff", attributes: [] },
      { model: db.Service, as: "service", attributes: [] },
    ],
    group: ["date", "Staff.id", "Staff.name"],
    order: [[Sequelize.literal("totalRevenue"), "DESC"]],
    raw: true,
  });

  const data = results.map((item) => ({
    id: item.staffId,
    date: item.date,
    name: item.staffName,
    appointmentCount: item.appointmentCount,
    totalRevenue: item.totalRevenue,
    avgServiceTime: item.avgServiceTime,
  }));

  const summary = {
    totalRevenue: data.reduce((sum, appt) => sum + (appt.totalRevenue || 0), 0),
    totalAppointments: data.reduce(
      (sum, appt) => sum + (appt.appointmentCount || 0),
      0
    ),
    // completedAppointments: data.reduce(
    //   (sum, appt) => sum + (appt.appointmentCount || 0),
    //   0
    // ),
    // cancelledAppointments: data.filter((a) => a.status === "cancelled").length,
    averageServiceTime: data.reduce(
      (sum, appt) => sum + (Number(appt.avgServiceTime) || 0),
      0
    ),
    topPerformingStaff: await getTopPerformingStaff(where),
    mostPopularService: await getMostPopularService(where),
  };

  return { data, summary: summary };
};

const generateServiceAnalysisReport = async (where) => {
  const results = await db.Appointment.findAll({
    where: {
      ...where,
      status: "completed",
    },
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("startTime")), "date"],
      [Sequelize.col("Service.id"), "serviceId"],
      [Sequelize.col("Service.name"), "serviceName"],
      [
        Sequelize.fn("COUNT", Sequelize.col("Appointment.id")),
        "appointmentCount",
      ],
      [Sequelize.fn("SUM", Sequelize.col("Service.price")), "totalRevenue"],
      [
        Sequelize.fn("AVG", Sequelize.col("Service.estimatedTimeWomen")),
        "avgServiceTime",
      ],
    ],
    include: [{ model: db.Service, as: "service", attributes: [] }],
    group: ["date", "Service.id", "Service.name"],
    order: [[Sequelize.literal("totalRevenue"), "DESC"]],
    raw: true,
  });

  const data = results.map((item) => ({
    id: item.serviceId,
    date: item.date,
    name: item.serviceName,
    appointmentCount: item.appointmentCount,
    totalRevenue: item.totalRevenue,
    avgServiceTime: item.avgServiceTime,
  }));

  const summary = {
    totalRevenue: data.reduce((sum, appt) => sum + (appt.totalRevenue || 0), 0),
    totalAppointments: data.reduce(
      (sum, appt) => sum + (appt.appointmentCount || 0),
      0
    ),
    // completedAppointments: data.reduce(
    //   (sum, appt) => sum + (appt.appointmentCount || 0),
    //   0
    // ),
    // cancelledAppointments: data.filter((a) => a.status === "cancelled").length,
    averageServiceTime: data.reduce(
      (sum, appt) => sum + (Number(appt.avgServiceTime) || 0),
      0
    ),
    topPerformingStaff: await getTopPerformingStaff(where),
    mostPopularService: await getMostPopularService(where),
  };

  return { data, summary: summary };
};

// Helper functions
const getTopPerformingStaff = async (where) => {
  const result = await db.Appointment.findOne({
    where: {
      ...where,
      status: "completed",
    },
    attributes: [
      [Sequelize.col("Staff.name"), "staffName"],
      [
        Sequelize.fn("COUNT", Sequelize.col("Appointment.id")),
        "appointmentCount",
      ],
    ],
    include: [{ model: db.User, as: "staff", attributes: [] }],
    group: ["Staff.id", "Staff.name"],
    order: [[Sequelize.literal("appointmentCount"), "DESC"]],
    raw: true,
  });

  return result?.staffName || "N/A";
};

const getMostPopularService = async (where) => {
  const result = await db.Appointment.findOne({
    where: {
      ...where,
      status: "completed",
    },
    attributes: [
      [Sequelize.col("Service.name"), "serviceName"],
      [
        Sequelize.fn("COUNT", Sequelize.col("Appointment.id")),
        "appointmentCount",
      ],
    ],
    include: [{ model: db.Service, as: "service", attributes: [] }],
    group: ["Service.id", "Service.name"],
    order: [[Sequelize.literal("appointmentCount"), "DESC"]],
    raw: true,
  });

  return result?.serviceName || "N/A";
};

const getRevenueByBranch = async (where) => {
  const results = await db.Appointment.findAll({
    where: {
      ...where,
      status: "completed",
    },
    attributes: [
      [Sequelize.col("Branch.name"), "branchName"],
      [Sequelize.fn("SUM", Sequelize.col("Service.price")), "totalRevenue"],
    ],
    include: [
      { model: db.Branch, as: "branch", attributes: [] },
      { model: db.Service, as: "service", attributes: [] },
    ],
    group: ["Branch.id", "Branch.name"],
    raw: true,
  });

  return results.reduce((obj, item) => {
    obj[item.branchName] = item.totalRevenue;
    return obj;
  }, {});
};

const getRevenueByService = async (where) => {
  const results = await db.Appointment.findAll({
    where: {
      ...where,
      status: "completed",
    },
    attributes: [
      [Sequelize.col("Service.name"), "serviceName"],
      [Sequelize.fn("SUM", Sequelize.col("Service.price")), "totalRevenue"],
    ],
    include: [{ model: db.Service, as: "service", attributes: [] }],
    group: ["Service.id", "Service.name"],
    raw: true,
  });

  return results.reduce((obj, item) => {
    obj[item.serviceName] = item.totalRevenue;
    return obj;
  }, {});
};

const exportReport = async (options) => {
  const { format = "csv" } = options;

  if (format === "pdf") {
    return exportPdfReport(options);
  } else {
    return exportCsvReport(options);
  }
};

const exportCsvReport = async (options) => {
  const { data } = await generateReport(options);
  const fields = Object.keys(data[0] || {});
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  return {
    data: csv,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${options.type}_report_${formatDate(new Date())}.csv`,
    },
  };
};

const exportPdfReport = async (options) => {
  const { data, summary } = await generateReport(options);
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Add PDF content
  doc.fontSize(16).text(`${options.type} Report`, { align: "center" });
  doc.moveDown();
  doc
    .fontSize(12)
    .text(`Date Range: ${options.startTime} to ${options.endDate}`);

  if (options.branchId) {
    const branch = await db.Branch.findByPk(options.branchId);
    doc.text(`Branch: ${branch?.name || options.branchId}`);
  }

  doc.moveDown();

  // Add summary
  if (summary) {
    doc.fontSize(14).text("Summary", { underline: true });
    doc.text(`Total Sales: $${summary.totalSales.toFixed(2)}`);
    doc.text(`Total Appointments: ${summary.totalAppointments}`);
    doc.moveDown();
  }

  // Add table data
  doc.fontSize(14).text("Details", { underline: true });
  doc.moveDown();

  // Simple table implementation
  const table = {
    headers: Object.keys(data[0] || {}),
    rows: data.map((item) => Object.values(item)),
  };

  // Draw table (simplified)
  // In a real implementation, you'd want a proper PDF table library

  doc.end();

  return {
    data: Buffer.concat(buffers),
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${options.type}_report_${formatDate(new Date())}.pdf`,
    },
  };
};

module.exports = {
  generateReport,
  exportReport,
};
