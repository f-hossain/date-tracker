"use client"

import { CircularProgress } from "@mui/material";

export default function LoadingOverlay( props : any ) { 

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <CircularProgress size="2.5rem" />
    </div>
  );
}

