import {
  Typography,
} from "@mui/material";
import Link from "next/link";
import { FavoriteSharp } from "@mui/icons-material";
const Footer = () => {
    return (
      <footer>
        <Typography variant="body1">
            Made with <span className="heart"> <FavoriteSharp sx={{color:"red", fontSize:"1rem"}}/> </span> by <Link className="linkStyleMobile" href="http://aneesh-malapaka-portfolio.netlify.app/" target="_blank" rel="noopener">Aneesh Malapaka</Link>
        </Typography>
      </footer>
    );
  };
  
  export default Footer;