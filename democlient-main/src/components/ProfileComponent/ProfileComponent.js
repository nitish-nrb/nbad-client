import * as React from "react";
import { Component } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import AppBarComponent from "../AppBarComponent/AppBarComponent";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import "./ProfileComponent.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Link } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import Button from "@mui/material/Button";

class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        mobile: "",
        gender: "",
      },
      idle: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://34.237.5.250:3000/app/userProfile", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const allowedKeys = Object.keys(this.state.user);
    var userProfile = response.data.userProfile;
    localStorage.setItem("token", response.data.token);
    // Filter out keys that are not present in this.state.userDetails
    const requiredUserObject = Object.keys(userProfile)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = userProfile[key];
        return obj;
      }, {});

    this.setState({user:requiredUserObject});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (this.state.idle) {
      this.setState({ idle: !this.state.idle });
    } else {
      
      const data = new FormData(event.currentTarget);
      const userData = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        username: data.get("username"),
        email: data.get("email"),
        mobile: data.get("mobile"),
        gender: this.state.user.gender,
      };
      const response = await axios.put("http://34.237.5.250:3000/app/userDetails",
      userData,
      {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
      this.setState({ idle: !this.state.idle });
      alert("Updated User Profile")
    }
    
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  }

  render() {
    return (
      <div>
        <AppBarComponent />
        <Container component="main" maxWidth="sm" id="profile-container">
         
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:"10px 0" }}>
          <ProfileAvatar />
          </div>


          <Box component="form" onSubmit={this.handleSubmit} sx={{ mt: 3, mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={this.state.idle}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={this.state.user.firstName}
                  autoFocus
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={this.state.idle}
                  required
                  fullWidth
                  label="Last Name"
                  value={this.state.user.lastName}
                  name="lastName"
                  autoComplete="family-name"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={this.state.idle}
                  required
                  fullWidth
                  name="username"
                  label="userName"
                  type="userName"
                  id="userName"
                  value={this.state.user.username}
                  autoComplete="userName"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  disabled={this.state.idle}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={this.state.user.email}
                  autoComplete="email"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  disabled={this.state.idle}
                  fullWidth
                  name="mobile"
                  type="mobile"
                  id="mobile"
                  label="Mobile No."
                  autoComplete="mobile-number"
                  value={this.state.user.mobile}
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              {this.state.idle ? "Edit" : "Update"}
            </Button>
          </Box>
        </Container>
      </div>
    );
  }
}

export default ProfileComponent;
