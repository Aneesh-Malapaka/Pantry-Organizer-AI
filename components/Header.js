"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useAuth from "../auth";

const Header = () => {
  const [user, setUser] = useState(false);
  const { signOutUser, authListener } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const linkStyleMobile = {
    textDecoration: "none",
    color: "black",
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const pages = ["Home"];

  useEffect(() => {
    authListener(setUser);
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#447c3c" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "flex", md: "flex" } }}
          >
            MyPantryOrganizer
          </Typography>

          {user ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link className="linkStyleMobile" href={page.toLowerCase()}>
                        <span>{page}</span>
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={signOutUser}>
                    <Link href="/" className="linkStyleMobile">Sign Out</Link>
                  </MenuItem>
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "flex-end",
                }}
              >
                <>
                {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      <Link className="linkStyle" href={page.toLowerCase()}>{page}</Link>
                    </Button>
                ))}
                <MenuItem onClick={signOutUser}>
                    <Link className="linkStyle" href="/">Sign Out</Link>
                  </MenuItem>
                </>
              </Box>
            </>
          ) : (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link href="/" className="linkStyle">About</Link>
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
