const reportService = require("../services/reportService");

const getReportData = async (req, res) => {
  try {
    const { type, startDate, endDate, branchId, staffId, serviceId, search } =
      req.query;

    const result = await reportService.generateReport({
      type,
      startDate,
      endDate,
      branchId,
      staffId,
      serviceId,
      search,
    });

    res.json({
      success: true,
      data: result.data,
      summary: result.summary,
      meta: {
        generatedAt: new Date(),
        filters: { type, startDate, endDate, branchId, staffId, serviceId },
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const exportReportData = async (req, res) => {
  try {
    const { type, startDate, endDate, branchId, staffId, serviceId, format } =
      req.query;

    const { data, headers } = await reportService.exportReport({
      type,
      startDate,
      endDate,
      branchId,
      staffId,
      serviceId,
      format,
    });

    res.set(headers);
    res.send(data);
  } catch (error) {
    console.error("Error exporting report:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getReportData,
  exportReportData,
};
