import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { Component } from "react";
import Stack from '@mui/material/Stack';
import axios from "axios";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default class ProfileAvatar extends Component{

  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
      },
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://34.237.5.250:3000/app/userDetails", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    this.setState({firstName:response.data.userDetails.firstName,lastName:response.data.userDetails.lastName})
  }

render(){
  return (
    <Stack direction="row" spacing={2}>
      <Avatar data-testid="profile-avatar" {...stringAvatar(`${this.state.firstName} ${this.state.lastName}`)} />
    </Stack>
  );

}

  
}