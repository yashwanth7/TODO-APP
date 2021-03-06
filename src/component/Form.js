import React, { Component } from "react";
import { ifError } from "assert";
import "./Form.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: "",
      password: "",
      loggedIn: localStorage["loggedIn"]
    };
    //localStorage["loggedIn"] = "false";
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.redirect = this.redirect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log("loggedIn : false");
  }

  handleEmailChange(event) {
    this.setState({ emailId: event.target.value });
  }
  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.emailId === "admin" && this.state.password === "admin") {
      this.redirect({
        data: [
          {
            id: 1
          }
        ]
      });
    } else {
      this.getProducts();
    }
  }

  getProducts = () => {
    debugger;
    const pack={
      "uname":this.state.emailId,
      "upassword":this.state.password
    }
    fetch(`http://localhost:8080/todo/userLogin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials':'true'
      }
      ,credentials: 'same-origin',
      body: JSON.stringify(pack)
    })
    .then(response => {
      console.log(response.headers.get('set-cookie')); // undefined
      console.log(document.cookie); // nope
      return response.json();})
      .then(response => this.redirect(response))
      .catch(err => console.log(err));
  };

  redirect(response,head) {
    debugger;
    if (response && response.userDetails && response.userDetails.token) {
      localStorage.setItem("userId",response.userDetails.userId);
      localStorage.setItem("Token",response.userDetails.token);
      localStorage.setItem("loggedIn", "true");
      console.log("loggedIn : true");
      this.setState({ loggedIn: "true" });
    } else {
      //console.log("loggedIn : false");
      localStorage.setItem("loggedIn", "false");
      //debugger;
    }
  }

  render() {
    if (this.state.loggedIn === "true") {
      return (
        <div>
          <Redirect from="/" to="/user" />
        </div>
      );
    } else {
      return (
        <div className="login">
          <div className="sidenav">
            <div className="login-main-text">
              <h2> TODO Application <br/>Login Page</h2>
            </div>
          </div>
          <div className="main">
            <div className="col-md-6 col-sm-12">
              <div className="login-form">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>
                      Email Id :
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        value={this.state.emailId}
                        onChange={this.handleEmailChange}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Password :
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                      />
                    </label>
                  </div>
                  <input
                    type="submit"
                    value="Login"
                    className="btn btn-black"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Form;
