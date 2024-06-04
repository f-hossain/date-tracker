"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { FavoriteBorderRounded } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

function Header(props: any) {

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  // TODO: refactor this var and other occurences to isViewMode so the logic makes more sense
  const isOwner = props.isOwner ?? true

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="static"
      color="transparent"
      elevation={0}
      sx={{ 
        borderBottom: 1,
        borderColor: '#ffe4e4' }}
      // sx={{
      //   mr: 2,
      //   display: { xs: 'none', md: 'flex' },
      //   // fontFamily: 'monospace',
      //   fontWeight: 700,
      //   letterSpacing: '.3rem',
      //   color: 'white'
      // }}
      >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            {/* DESKTOP */}
          <FavoriteBorderRounded sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white', fontSize: '1rem' }} />
          <Typography
            variant="h6"
            color="primary"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              // fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              // color: 'salmon',
              textDecoration: 'none',
            }}
          >
            \ove\ist
          </Typography>

          {/* MOBILE */}

          {/* <FavoriteBorderRounded sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white', fontSize: '2rem' }} /> */}
          <Typography
            variant="h5"
            noWrap
            color="primary"
            component="a"
            href="/"
            sx={{
              // mr: 1,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              // fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              // color: 'salmon',
              textDecoration: 'none',
            }}
          >
            \ove\ist
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: grey[300] }} />
            </IconButton> */}

            { isOwner? 
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: grey[300] }} />
              </IconButton> : <div></div>
            }

            <Menu
              elevation={0}
              sx={{ mt: '40px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem 
                  key='about' 
                  // onClick={handleCloseUserMenu}
                  sx={{
                    border: 1,
                    borderColor: '#ffe4e4' 
                  }}>
                    <Typography  
                      component="a"
                      href="/about"
                      textAlign="center"
                      variant='caption'
                      sx={{ fontFamily: 'monospace' }}>about</Typography>
                </MenuItem>
                <MenuItem 
                  key='logout' 
                  // onClick={handleCloseUserMenu}
                  sx={{
                    borderTop: 1,
                    border: 1,
                    borderColor: '#ffe4e4'
                  }}>
                    <Typography 
                      component="a"
                      href="/logout"
                      textAlign="center"
                      variant='caption'
                      sx={{ fontFamily: 'monospace' }}
                    >log out</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
