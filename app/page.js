"use client";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import useAuth from "../auth";
import Image from "next/image";

export default function Home() {
  const { signInWithGoogle, signOutUser } = useAuth();
  return (
    <Container sx={{ m: 0, p: 0 }}>
      <Box
        className="signIn--Box"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, 
          justifyContent: "space-evenly",
          alignItems: "center",
          p: 2,
          gap:5
        }}
      >
        <Box className="landingImage"
            component={"img"}
            src="/Images/pantryImage.png"
            alt="Picture of the author"
           
            sx={{
              maxWidth: {xs:"50vw", md:"40vw"},
              height: "auto",
              objectFit: "cover",
            }}
          >
        </Box>
        <Paper className="signIn" sx={{
          height:{xs:"30vh", md:"40vh"},
          width: {xs:"70vw", md:"50vw", lg:"30vw"},
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}>
          <Typography sx={{
            textAlign:"center",
            fontSize: "1rem",
          }}>Sign in with Google and save your pantry.</Typography>
          <Button onClick={signInWithGoogle} variant="contained">
            Sign in
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
