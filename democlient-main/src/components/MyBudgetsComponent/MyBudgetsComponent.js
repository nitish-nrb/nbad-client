import React, { Component } from "react";
import AppBarComponent from "../AppBarComponent/AppBarComponent";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import { Container } from "@mui/material";
import "./MyBudgetsComponent.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";

function createData(sno, budget_id, user_id, item, budget) {
  return {
    sno,
    budget_id,
    user_id,
    item,
    budget,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "sNo",
    numeric: false,
    disablePadding: true,
    label: "S. no",
  },
  {
    id: "item",
    numeric: false,
    disablePadding: false,
    label: "Item Name",
  },
  {
    id: "budget",
    numeric: false,
    disablePadding: false,
    label: "Budget($)",
  },
];

class EnhancedTableHead extends Component {
  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = this.props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

class EnhancedTableToolbar extends Component {
  render() {
    const { numSelected } = this.props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            My Budgets
          </Typography>
        )}
      </Toolbar>
    );
  }
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

class MyBudgetsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      order: "asc",
      orderBy: "calories",
      selected: [],
      page: 0,
      dense: false,
      rowsPerPage: 5,
      isAddDialogOpen: false,
      newItemName: null,
      newBudgetValue: null,
      errorOpen:false
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://34.237.5.250:3000/app/userBudget", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    var count = 1;

    if (response.status === 201) {
      alert("No Budgets, Please Add New Budgets");
      return;
    }
    else {
      const budgetArray = response.data.budgets;
      const rows = budgetArray.map((budget) =>
        createData(
          count++,
          budget.budget_id,
          budget.user_id,
          budget.item,
          budget.budget
        )
      );
      this.setState({ rows });
    }
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === "asc";
    this.setState({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = this.state.rows.map((n) => n.sno);
      this.setState({ selected: newSelected });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const selectedIndex = this.state.selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    } else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected.slice(0, selectedIndex),
        this.state.selected.slice(selectedIndex + 1)
      );
    }
    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  handleChangeDense = (event) => {
    this.setState({ dense: event.target.checked });
  };

  handleCellEdit = async (row, key, target) => {
    this.setState({ selected: [] });
    var reqData;
    if (key === "item") {
      reqData = { budget_id: row.budget_id, item: target, budget: row.budget };
      var rowsUpdated = this.state.rows;
      var foundObject = rowsUpdated.find(
        (item) => item.budget_id === row.budget_id
      );
      if (foundObject) {
        foundObject.item = target;
      }
      this.setState(rowsUpdated);
    } else if (key === "budget") {
      reqData = {
        budget_id: row.budget_id,
        item: row.item,
        budget: Number(target),
      };
      rowsUpdated = this.state.rows;
      foundObject = rowsUpdated.find(
        (item) => item.budget_id === row.budget_id
      );
      if (foundObject) {
        foundObject.budget = Number(target);
      }
      this.setState(rowsUpdated);
    }

    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://34.237.5.250:3000/app/userBudget",
      reqData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    alert(response.data.message);
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  handleAddDialogOpen = () => {
    this.setState({ isAddDialogOpen: true });
  };

  handleAddDialogClose = () => {
    this.setState({
      isAddDialogOpen: false,
      newItemName: "",
      newBudgetValue: 0,
      errorOpen:false
    });
  };

  handleNewItemNameChange = (event) => {
    this.setState({ newItemName: event.target.value });
  };

  handleNewBudgetValueChange = (event) => {
    this.setState({ newBudgetValue: event.target.value });
  };

  areAllValuesNotEmpty = () => {
    if(this.state.newBudgetValue === null || this.state.newItemName.length === 0){
      return false;
    }
    return true;
  };

  handleAddNewBudget = async () => {
    const token = localStorage.getItem("token");
    if (!this.areAllValuesNotEmpty()) {
      this.setState({ errorOpen: !this.state.errorOpen });
    }
    else{
      if(this.state.errorOpen){
        this.setState({ errorOpen: !this.state.errorOpen });
      }
      const response = await axios.post(
        "http://34.237.5.250:3000/app/userBudget",
        {
          item: this.state.newItemName,
          budget: this.state.newBudgetValue,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
  
      // handle response, maybe show a success message
  
      // refresh the data after adding a new budget
      this.componentDidMount();
  
      this.handleAddDialogClose();
    }

  };

  render() {
    const emptyRows =
      this.state.page > 0
        ? Math.max(
            0,
            (1 + this.state.page) * this.state.rowsPerPage -
              this.state.rows.length
          )
        : 0;

    const visibleRows = stableSort(
      this.state.rows,
      getComparator(this.state.order, this.state.orderBy)
    ).slice(
      this.state.page * this.state.rowsPerPage,
      this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
    );

    return (
      <div>
        <AppBarComponent />
        <Container
          id="budget-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "70%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar numSelected={this.state.selected.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={this.state.dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={this.state.selected.length}
                    order={this.state.order}
                    orderBy={this.state.orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={this.state.rows.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = this.isSelected(row.sno);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => this.handleClick(event, row.sno)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            contentEditable
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.sno}
                          </TableCell>
                          <TableCell
                            contentEditable
                            align="left"
                            onBlur={(e) =>
                              this.handleCellEdit(
                                row,
                                "item",
                                e.target.innerText
                              )
                            }
                          >
                            {row.item}
                          </TableCell>
                          <TableCell
                            contentEditable
                            align="left"
                            onBlur={(e) =>
                              this.handleCellEdit(
                                row,
                                "budget",
                                e.target.innerText
                              )
                            }
                          >
                            {row.budget}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (this.state.dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onPageChange={this.handleChangePage}
                onRowsPerPageChange={this.handleChangeRowsPerPage}
              />
            </Paper>
            <IconButton aria-label="delete">
              {/* <Icon color="primary">add_circle</Icon> */}
            </IconButton>
            <Button onClick={this.handleAddDialogOpen}>Add New Budget</Button>

            <Dialog
              open={this.state.isAddDialogOpen}
              onClose={this.handleAddDialogClose}
            >
              <DialogTitle>Add New Budget</DialogTitle>
              <Collapse in={this.state.errorOpen}>
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="error">Please Enter All Fields</Alert>
                </Stack>
              </Collapse>
              <DialogContent>
                <TextField
                  label="Item Name"
                  value={this.state.newItemName}
                  onChange={this.handleNewItemNameChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Budget Value"
                  type="number"
                  value={this.state.newBudgetValue}
                  onChange={this.handleNewBudgetValueChange}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleAddDialogClose}>Cancel</Button>
                <Button onClick={this.handleAddNewBudget}>Add</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Container>
      </div>
    );
  }
}

export default MyBudgetsComponent;
