import React from 'react';
import {Box, CircularProgress} from "@mui/material";

type LoaderProps = {
  width?: string,
  height?: string
}
const Loader = ({height, width}: LoaderProps) => {
  return (
    <Box sx={{ display: 'flex', width: width ?? '100%', height: height ?? '100%', alignItems: 'center', justifyContent: 'center'}}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
