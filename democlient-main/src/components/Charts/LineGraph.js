import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";

class LineGraph extends Component {
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
  componentDidUpdate(prevProps, prevState) {
    // You may want to check if the props have changed before fetching again
    if (prevState.data !== this.state.data) {
      this.fetchData();
    }
  }

  async fetchData() {
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

            /////////
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
        existingItem.estimatedbudget += item.estimatedbudget;
      } else {
        acc.push({
          month: item.month,
          actualbudget: item.actualbudget,
          estimatedbudget: item.estimatedbudget,
        });
      }

      return acc;
    }, []);

    return groupedData;
  }

  drawChart() {
    const { data } = this.state;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(this.chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(this.chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([
          ...data.map((d) => d.estimatedbudget),
          ...data.map((d) => d.actualbudget),
        ]),
      ])
      .range([height, 0]);

    // Define lines
    const lineEstimated = d3
      .line()
      .x((d) => xScale(d.month) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.estimatedbudget));

    const lineActual = d3
      .line()
      .x((d) => xScale(d.month) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.actualbudget));

    // Append paths with labels
    svg
      .append("path")
      .data([data])
      .attr("class", "line-estimated")
      .attr("d", lineEstimated)
      .attr("fill", "none")
      .attr("stroke", "blue");

    svg
      .append("text")
      .attr("x", width - 80)
      .attr("y", yScale(data[data.length - 1].estimatedbudget))
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "blue")
      .text("Estimated Budget");

    svg
      .append("path")
      .data([data])
      .attr("class", "line-actual")
      .attr("d", lineActual)
      .attr("fill", "none")
      .attr("stroke", "green");

    svg
      .append("text")
      .attr("x", width - 80)
      .attr("y", yScale(data[data.length - 1].actualbudget))
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "green")
      .text("Actual Budget");

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add labels
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
      .text("Budget");
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

export default LineGraph;
