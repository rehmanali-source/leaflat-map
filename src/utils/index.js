export const statusColor = (status) => {
  switch (status) {
    case "Live":
      return "bg-success text-white";
    case "Stopped":
      return "bg-danger text-white";
    case "Idle":
      return "bg-warning text-dark";
    default:
      return "bg-secondary text-white";
  }
};
