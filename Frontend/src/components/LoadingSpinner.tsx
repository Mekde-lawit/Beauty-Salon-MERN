const spinnerStyle: React.CSSProperties = {
  border: "6px solid #f3f3f3",
  borderTop: "6px solid #e91e63",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  animation: "spin 1s linear infinite",
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
      width: "100%",
    }}
  >
    <div className="flex justify-center items-center py-10">
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
    </div>
  </div>
);

export default LoadingSpinner;
