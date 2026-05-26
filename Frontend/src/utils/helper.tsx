export const DateView = (
  date: Date | string | null | undefined,
  showTime = false
) =>
  date
    ? new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(showTime && {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      })
    : "";

export const errorHandler = (error: {
  response: { data: { detail: any }; status: any; statusText: any };
  request: any;
  message: any;
}): string => {
  // Handle different types of errors
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    return (
      error.response.data?.detail ||
      `Server Error: ${error.response.status} - ${error.response.statusText}`
    );
  } else if (error.request) {
    // Request was made but no response was received
    return "Network Error: No response received from the server.";
  } else {
    // Something else happened while setting up the request
    return `Unexpected Error: ${error.message}`;
  }
};

export const errorHandlerOnForm = (error: {
  response?: {
    data?: Record<string, string[] | string>; // Allow both arrays and strings
    status?: number;
    statusText?: string;
  };
  request?: any;
  message?: string;
}): string => {
  if (error.response && error.response.data) {
    const fieldErrors = error.response.data;

    // Map over the field errors and handle both arrays and strings
    const messages = Object.entries(fieldErrors)
      .map(([field, errors]) => {
        if (Array.isArray(errors)) {
          return `${field}: ${errors.join(", ")}`; // Join array of errors
        } else if (typeof errors === "string") {
          return `${field}: ${errors}`; // Handle string errors
        } else {
          return `${field}: Unknown error format`; // Handle unexpected formats
        }
      })
      .join("\n");

    return messages || "An error occurred while submitting the form.";
  } else if (error.request) {
    return "Network Error: No response received from the server.";
  } else {
    return `Unexpected Error: ${error.message}`;
  }
};

export const hasRole = (
  loginRoles: string[] | undefined,
  roleToCheck: string[] | undefined
): boolean => {
  if (
    !loginRoles ||
    loginRoles.length === 0 ||
    !roleToCheck ||
    roleToCheck.length === 0
  ) {
    return false; // Return false if either array is undefined or empty
  }

  // Check if any role in roleToCheck exists in loginRoles
  return roleToCheck.some((role) => loginRoles.includes(role));
};
