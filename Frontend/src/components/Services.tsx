import { Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";
import { FILE_URL } from "../utils/constant";
import LoadingSpinner from "./LoadingSpinner";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          width: "100%",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section id="service" className="features">
      <div className="features-header">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, color: pink[300] }}
        >
          Our Services
        </Typography>
        <p className="features-subtitle">
          We offer a wide range of beauty services to cater to all your needs.
          Our team of experts is dedicated to providing you with the best
          experience possible.
        </p>
      </div>
      <div className="features-grid">
        {services.map((service: any) => (
          <div key={service.id} className="feature-card">
            {service.image && (
              <img
                src={FILE_URL + service.image}
                alt={service.name}
                height={"185px"}
                width={"100%"}
                style={{
                  objectFit: "cover",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  borderBottom: "1px solid #e0e0e0",
                  borderTop: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  width: "100%",
                  height: "185px",
                  objectPosition: "center",
                }}
                className="rounded-t-lg object-cover"
              />
            )}
            <h3 className="feature-title">{service.name}</h3>
            <p className="feature-description">{service.description}</p>
            <div className="feature-category">
              <strong>Category:</strong> {service.category}
            </div>
            {service.tags && Array.isArray(service.tags) && (
              <div className="feature-tags mb-2">
                {service.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded mr-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="feature-time">
              <strong>Women:</strong> {service.estimatedTimeWomen} min
              {service.isForChildren && service.estimatedTimeChildren && (
                <>
                  {" | "}
                  <strong>Children:</strong> {service.estimatedTimeChildren} min
                </>
              )}
            </div>
            <div className="feature-price font-bold mt-2">
              <strong>Price:</strong> {service.price} Br
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
