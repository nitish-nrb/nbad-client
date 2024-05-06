import React, { Component } from "react";
import D3JSChart from "../Charts/D3JSChart";
import PieChart from "../Charts/PieChart";
import axios from "axios";
import BarChart from "../Charts/BarChart";
import LineGraph from "../Charts/LineGraph";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBarComponent from "../AppBarComponent/AppBarComponent";
import {Link} from 'react-router-dom';

class DashboardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#ffcd56",
              "#ff6384",
              "#36a2eb",
              "#fd6b19",
              "#83FF33",
              "#F633FF",
              "#FF3333",
            ],
          },
        ],
        labels: [],
      },
      dataSourceNew: [],
      barChartData: [],
      noBudgets:false
    };
  }

  // Lifecycle methods
  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("http://34.237.5.250:3000/app/userBudget", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 201) {
            this.setState({noBudgets:true})
        } else {
          this.setState({
            dataSourceNew: res.data.budgets,
            dataSource: {
              datasets: [
                {
                  data: res.data.budgets.map((v) => v.budget),
                  backgroundColor: [
                    "#ffcd56",
                    "#ff6384",
                    "#36a2eb",
                    "#fd6b19",
                    "#83FF33",
                    "#F633FF",
                    "#FF3333",
                  ],
                },
              ],
              labels: res.data.budgets.map((v) => v.item),
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Render method
  render() {
    return (
      <div>
        <Box sx={{ mt: 0, mb: 1 }}>
          <AppBarComponent />
          <h2 style={{ textAlign: "center" }}>Visualizations</h2>

          {this.state.noBudgets ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>No Data Found</h1>
            <p>You don't have any Budget Data to Visualize the Data.</p>
            <p>Please add some Budgets.</p>
            <Link to="/mybudgets">Add Budgets</Link>
          </div>

          ) : (
            <Grid container spacing={10}>
            <Grid item xs={12} sm={5} style={{ margin: "0 0 0 80px" }}>
              <D3JSChart dataSource={this.state.dataSourceNew} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
              <BarChart />
            </Grid>
            <Grid item xs={12} sm={5} style={{ margin: "0 0 80px 80px" }}>
              <h2 style={{ textAlign: "center" }}>Line Graph</h2>
              <LineGraph />
            </Grid>
          </Grid>
          )}
          
        </Box>
      </div>
    );
  }
}

export default DashboardComponent;
