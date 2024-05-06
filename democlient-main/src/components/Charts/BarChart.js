import React, { Component } from "react";
import axios from "axios";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const token = localStorage.getItem("token");
    axios
      .get("http://34.237.5.250:3000/app/userMonthlyBudget", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 201) {
            
        } else {
          const groupedData = this.groupDataByMonth(response.data.budgets);
          this.setState({
            data: groupedData,
            loading: false,
          });
          this.drawChart();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ loading: false });
      });
  }

  groupDataByMonth(data) {
    const groupedData = data.reduce((acc, item) => {
      const existingItem = acc.find((group) => group.month === item.month);

      if (existingItem) {
        existingItem.actualbudget += item.actualbudget;
      } else {
        acc.push({
          month: item.month,
          actualbudget: item.actualbudget,
        });
      }

      return acc;
    }, []);

    return groupedData;
  }
 
  componentDidUpdate(prevProps, prevState) {
    // You may want to check if the props have changed before fetching again
    if (prevState.data !== this.state.data) {
      this.fetchData();
    }
  }

  drawChart() {
    const { data } = this.state;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(this.chartRef.current).selectAll("*").remove();
    const svg = d3
      .select(this.chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.actualbudget)])
      .range([height, 0]);

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.month))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.actualbudget))
      .attr("height", (d) => height - yScale(d.actualbudget))
      .attr("fill", (d, i) => colorScale(i));

    svg
      .selectAll(".bar-value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-value")
      .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.actualbudget) - 5) // Adjust the position based on your preference
      .attr("text-anchor", "middle")
      .attr("fill", "black") // You can adjust the color as needed
      .text((d) => d.actualbudget);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + 30})`)
      .text("Month");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .text("Spent Budget");
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <div ref={this.chartRef}></div>
        )}
      </div>
    );
  }
}

export default BarChart;
