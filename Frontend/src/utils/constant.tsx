export const FRONT_END_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/";

export const FILE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8001/";
export const apiUrl = import.meta.env.VITE_API_URL;
export const authUrl = import.meta.env.VITE_AUTH_URL;

export const LoadingIcon = (
  <svg
    className="w-5 h-5 mr-2 text-white animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);
