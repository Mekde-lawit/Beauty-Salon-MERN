import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import BranchesTab from "../components/tabs/BranchesTab";
import BranchServicesTab from "../components/tabs/BranchServicesTab";
import RolesTab from "../components/tabs/RolesTab";
import ServicesTab from "../components/tabs/ServicesTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  };
}

const SettingsPage = () => {
  // const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="settings tabs"
            variant="fullWidth"
          >
            <Tab label="Services" {...a11yProps(0)} />
            <Tab label="Branches" {...a11yProps(2)} />
            <Tab label="Branch Services" {...a11yProps(3)} />
            <Tab label="Roles" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <ServicesTab />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <BranchesTab />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <BranchServicesTab />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <RolesTab />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
