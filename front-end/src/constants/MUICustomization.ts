export const MUI_RADIO_STYLE = {
  color: "rgb(30, 41, 59)",
};

export const MUI_LABEL_STYLE = {
  "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
};

export const MUI_DATEPICKER_STYLE = {
  // Height customization
  "& .MuiSvgIcon-root": {
    color: "rgb(148, 163, 184)", // Updated Calendar icon color
  },
  "& .MuiInputBase-root": {
    height: "42px",
    color: "rgb(148, 163, 184)", // Text inside input updated
  },
  // Color customization
  "& .MuiOutlinedInput-root": {
    color: "rgb(148, 163, 184)", // Ensure overall field text color matches the icon
    "& fieldset": {
      borderColor: "rgb(30, 41, 59)", // Input border color
    },
    "&:hover fieldset": {
      borderColor: "rgb(30, 41, 59)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgb(30, 41, 59)",
    },
  },
};
