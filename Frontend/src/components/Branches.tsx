import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Branch } from "../types";
import { pink } from "@mui/material/colors";

const BranchList = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    apiClient
      .get("branches")
      .then((res) => {
        setBranches(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        width="100%"
      >
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    );
  }

  return (
    <Box
      component="section"
      id="branch"
      sx={{
        py: 8,
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, color: pink[300] }}
        >
          Our Branches
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Find a branch near you
        </Typography>
      </Box>

      {branches?.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="body1" color="text.secondary">
            No branches available at the moment
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {branches?.map((branch) => (
            <Grid key={branch?.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                      }}
                    >
                      <LocationIcon />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" component="h3" fontWeight="600">
                      {branch?.name}
                    </Typography>
                  }
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationIcon
                      color="primary"
                      sx={{ mr: 2, fontSize: "1.25rem" }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {branch?.location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PhoneIcon
                      color="primary"
                      sx={{ mr: 2, fontSize: "1.25rem" }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {branch?.phone}
                    </Typography>
                  </Box>
                  {branch?.contactPerson && (
                    <Box display="flex" alignItems="center">
                      <PersonIcon
                        color="primary"
                        sx={{ mr: 2, fontSize: "1.25rem" }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        <Box component="span" fontWeight="500">
                          Contact:
                        </Box>{" "}
                        {branch?.contactPerson.name}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BranchList;
