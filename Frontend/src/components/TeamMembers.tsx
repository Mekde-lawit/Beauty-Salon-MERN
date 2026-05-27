import { Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";

const teamMembers = [
  {
    name: "Alice Bob",
    role: "Manager",
    image: "/images/photo1.png",
  },
  {
    name: "Sara James",
    role: "Makeup Artist",
    image: "/images/photo2.png",
  },
  {
    name: "Lily Brad",
    role: "Nail Artist",
    image: "/images/photo3.png",
  },
];

const TeamMembers = () => (
  <section id="team" style={{ padding: "4rem 0", background: "#fff" }}>
    <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 700, color: pink[400] }}
      >
        Meet the Team
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", marginBottom: "2.5rem" }}
      >
        Our talented professionals are passionate about beauty and dedicated to
        your satisfaction.
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {teamMembers.map((member) => (
          <Box
            key={member.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 220,
              background: "#fce4ec",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(236, 64, 122, 0.08)",
              padding: "2rem 1rem",
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              style={{
                width: "100%",
                height: 300,
                borderRadius: "2%",
                marginBottom: "1rem",
                objectFit: "cover",
                border: `3px solid ${pink[300]}`,
              }}
            />
            {/* <Avatar
              src={member.image}
              alt={member.name}
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                border: `3px solid ${pink[300]}`,
              }}
            /> */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: pink[700] }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {member.role}
            </Typography>
          </Box>
        ))}
      </div>
    </div>
  </section>
);

export default TeamMembers;
