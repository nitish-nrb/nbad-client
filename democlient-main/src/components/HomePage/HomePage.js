import * as React from "react";
import "./HomePage.css";
import AppBarComponent from "../AppBarComponent/AppBarComponent";

import Button from "@mui/material/Button";

import CssBaseline from "@mui/material/CssBaseline";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "../Footer/Footer";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

const defaultTheme = createTheme();
// const cards = [1, 2, 3];

const token = localStorage.getItem("token");

const cards = [
  {
    key: 1,
    title: "Pie Chart",
    description: "This is a visualization showing Pie Chart of budget spending",
  },
  {
    key: 2,
    title: "Line Graph",
    description: "This is a visualization showing Line Graph of budget spending",
  },
  {
    key: 3,
    title: "Bar Graph",
    description: "This is a visualization showing Bar Graph of budget spending",
  },
];

export default function HomePage() {
  return (
    <div>
      <AppBarComponent />

      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Personal Budget
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                Welcome to our Personal Budget App - your ultimate financial
                companion! Take control of your finances with our feature-packed
                app designed to simplify budgeting, provide insightful
                visualizations of your spending patterns, and empower you to
                achieve your financial goals.
              </Typography>
              
                {token ? (
                  <Stack
                  sx={{ pt: 4 }}
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                >
                    <Button variant="contained" href="/mybudgets">
                      Get Started
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                    <Button variant="contained" href="/signup">
                      Create Budgets
                    </Button>
                    <Button variant="outlined" href="/login">
                      View my Budgets
                    </Button>
                  </Stack>
                )}
            </Container>
          </Box>
          <Container sx={{ py: 3 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.key} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: "90.25%",
                      }}
                      image={`${card.key}.png`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.title}
                      </Typography>
                      <Typography>{card.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {token? <center id="center-btn">
              <Button variant="contained" href="/graphs">
                View Visualizations
              </Button>
            </center>:<center id="center-btn">
              <Button variant="contained" href="/signup">
                View Visualizations
              </Button>
            </center>}
            
          </Container>
        </main>
        {/* Footer */}
        {/* End footer */}
        <Footer />
      </ThemeProvider>
    </div>
  );
}
