import React from "react";
import { TextField as MuiTextField } from "@mui/material";

export const TextField = React.forwardRef((props, ref) => (
  <MuiTextField ref={ref} {...props} />
));

TextField.displayName = "TextField";
