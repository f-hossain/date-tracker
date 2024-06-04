"use client"

import * as React from 'react';
import { Typography } from '@mui/material';
import Image from 'next/image';
import logoImg from '../assets/logo.png'
import AuthForm from "../components/auth-form"

export default function LoginForm() {
  return (

    <div className="flex min-h-screen place-content-center">
      <div className="flex flex-col place-content-center gap-3 w-1/5">
          <div className="flex flex-col items-center gap-16 pb-4">
            <Image
            src={logoImg}
            width={75}
            height={75}
            alt="logo"
            ></Image>

            <Typography
              variant="h6"
              noWrap
              component="a"
              color="primary"
              sx={{
                display: { xs: 'none', md: 'flex' },
                // fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                // color: 'salmon',
                textDecoration: 'none',
              }}
            >
              sign in
            </Typography>
          </div>
          <AuthForm />
          {/* <TextField 
            required 
            id="email" 
            label="Email address" 
            variant="outlined"
            size="small"
            helperText="We will send a link to verify your login" />

          <Button variant="contained">Send Magic Link</Button> */}

      </div>
      
    </div>
  );
}