"use client";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  Typography,
  Box,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  FormHelperText,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@mui/material";
import PrimarySearchAppBar from "@/components/searchBar";
import { Delete, Edit } from "@mui/icons-material";
import FormDialog from "@/components/pantryEditDialogoBox";
import pantryOperations from "../../pantryCRUD";
import recipeGemini from "../../components/recipeGenerationGemini";
import ReactMarkdown from "react-markdown";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Home = () => {
  const [data, setData] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [unit, setUnit] = useState("");
  const [model, setModel] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [value, setValue] = useState(0);

  const [errors, setErrors] = useState({
    itemName: false,
    quantity: false,
    unit: false,
    model: false,
  });
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    if (user) {
      setUserId(user.uid);
      updateInventory(user.uid);
    }
  }, []);

  const item = {
    name: itemName,
    unit: unit,
    unit_value: parseInt(quantity),
  };

  const IconWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
    color: "#4b4747",
  }));

  const styleFont = {
    fontSize: {
      xs: "1rem",
      md: "1.1rem",
    },
  };

  const inputStyles = {
    width: {
      xs: "100%",
      sm: "50%",
      md: "25%",
    },
    m: 1,
  };

  const { addToInventory, removeItem, updateInventory } =
    pantryOperations(setData);

  const run = recipeGemini();
  const handleAddItem = () => {
    let validationErrors = {};
    if (!itemName) validationErrors.itemName = true;
    if (!quantity) validationErrors.quantity = true;
    if (!unit) validationErrors.unit = true;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    addToInventory(userId, item);

    setItemName("");
    setQuantity("");
    setUnit("");
    setErrors({});
  };

  const handleEdit = (item) => {
    console.log("yes");
    setDialogOpen(true);
    setEditingItem(item);
  };

  const handleRecipeGeneration = async (data) => {
    console.log(data);
    data.map((item) => {
      setIngredients((prev) => [...prev, item.name]);
    });
  };

  const handleSearchResults = (results) => {
    setFilteredPantry(results);
  };

  useEffect(() => {
    setFilteredPantry(data);
  }, [data]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (ingredients.length) {
      const generateRecipe = async () => {
        try {
          console.log(ingredients);
          setLoading(true);
          const recipeGenerated = await run(ingredients);
          if(recipeGenerated.text()){
            setRecipe(recipeGenerated.text());
            setLoading(false);
          }
        } catch (error) {
          console.error("Error generating recipe:", error);
        }
      };
      generateRecipe();
    }
  }, [ingredients]);

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        alignItems: "start",
        justifyContent: "space-around",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { sm: "center", md: "start" },
        gap: 5,
        width: "100%",
        height: "100%",
      }}
    >
      <Paper
        className="pantry"
        elevation={3}
        sx={{ p: 2, width: { sm: "75vw", md: "50vw" } }}
      >
        <PrimarySearchAppBar
          data={data}
          handleSearchResults={handleSearchResults}
        />
        <Box
          sx={{
            m: 1,
            p: 1,
          }}
        >
          <FormDialog
            state={dialogOpen}
            handleClose={() => setDialogOpen(false)}
            userId={userId}
            item={editingItem}
            data={setData}
          />
          <Typography variant="h4" sx={{ ...styleFont }}>
            Add New Item To Pantry
          </Typography>
          <Box
            sx={{
              m: 1,
              display: "flex",
              gap: 2,
              flexDirection: "row",
              minWidth: 120,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={errors.itemName}>
              <TextField
                id="item-name"
                label="Item Name"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              {errors.itemName && (
                <FormHelperText sx={{ fontWeight: "bold" }}>
                  Item Name is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={errors.quantity}>
              <TextField
                id="quantity"
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ flex: 1 }}
              />
              {errors.quantity && (
                <FormHelperText sx={{ fontWeight: "bold" }}>
                  Quantity is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ flex: 1 }}
              error={errors.unit}
            >
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                label="Unit"
              >
                <MenuItem value="Piece">
                  <em>Piece</em>
                </MenuItem>
                <MenuItem value="Grams">Grams</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="Lb">Lb</MenuItem>
                <MenuItem value="Oz">Oz</MenuItem>
                <MenuItem value="Litre">Litre</MenuItem>
                <MenuItem value="ML">ML</MenuItem>
              </Select>
              {errors.unit && (
                <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                  Unit is required
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box sx={{ m: 1 }}>
            <Button
              variant="contained"
              onClick={handleAddItem}
              sx={{ ...styleFont }}
            >
              Add Item
            </Button>
          </Box>
        </Box>
        <Divider variant="middle" flexItem />
        <Box sx={{ my: 2, mx: 1 }}>
          <Typography variant="h5" sx={{ ...styleFont }}>
            Current Pantry
          </Typography>
          <Box
            sx={{
              overflowY: "auto",
              height: "50vh",
            }}
          >
            {filteredPantry.length || data.length ? (
              filteredPantry.map((item) => (
                <Paper
                  square={false}
                  key={item.name}
                  sx={{
                    mx: 1,
                    my: 3,
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ ...styleFont }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body1" sx={{ ...styleFont }}>
                      Quantity: {item.unit_value} {item.unit}
                    </Typography>
                  </Box>

                  <IconWrapper>
                    <Edit onClick={() => handleEdit(item)} />
                    <Delete onClick={() => removeItem(userId, item.id)} />
                  </IconWrapper>
                </Paper>
              ))
            ) : (
              <Typography variant="h6" sx={{ ...styleFont }}>
                No Items in Pantry
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, width: { sm: "75vw", md: "50vw" }, height: "100%", overflowY: "auto" }}>
        <Typography variant="h4">Recipe Generation</Typography>
        <Typography variant="subtitle1">
          With the items in your pantry, you can generate a recipe.😋
        </Typography>
        <Box>
          <FormControl
            variant="outlined"
            sx={{ flex: 1, my: 3, width: "100%" }}
            error={errors.model}
          >
            <InputLabel id="model-label">Select Model</InputLabel>
            <Select
              labelId="model-label"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              label="Model"
            >
              <MenuItem value="Gemini AI Model">Gemini AI Model</MenuItem>
            </Select>
            {errors.model && (
              <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                Model is required
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Recipe Generation" {...a11yProps(0)} />
              <Tab label="Your Recipes" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Button
              variant="contained"
              onClick={() => handleRecipeGeneration(filteredPantry)}
            >
              Find a Recipe
            </Button>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper elevation={1} sx={{ p: 1, my: 2 }}>
                <Typography variant="h5" sx={{ my: 1 }}>
                  Generated Recipe:
                </Typography>
                <Box variant="body1" sx={{ p: 2, my: 2 }}>
                  {console.log(recipe)}
                  {recipe ? (
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                  ) : (
                    <Typography variant="body1" sx={{ ...styleFont }}>
                      No Recipe Generated Yet
                    </Typography>
                  )}
                  {/* <ReactMarkdown>{recipe}</ReactMarkdown> */}
                </Box>
              </Paper>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Paper elevation={1} sx={{ p: 1, my: 2 }}>
                Coming Soon...
            </Paper>
          </CustomTabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
