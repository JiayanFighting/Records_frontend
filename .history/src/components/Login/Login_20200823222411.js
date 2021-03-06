import React, { Component } from "react";
import "antd/dist/antd.css";
import "../../styles/Login/Login.css";
import { Button, Card } from "antd";
import { TOKEN_KEY, API_ROOT } from "../../constants";
class Login extends Component {
  state = {
    isAuth: true,
    show: false,
    test: "",
  };

  /**
   * on login btn clicked send login request
   * @method onLogin
   * @for Login
   * @param none
   * @return null
   */
  onLogin = () => {
    let userinfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
    this.props.handleLogin(userinfo);
  };

  /**
   * on auth btn clicked set Login state
   * @method onAuth
   * @for Login
   * @param none
   * @return null
   */
  onAuth = async () => {
    this.setState({ isAuth: false, show: true });
    this.getToken();
  };

  testFunc = (e) => {
    try {
      JSON.parse(e.data);
      localStorage.setItem(TOKEN_KEY, e.data);
      this.onLogin();
    } catch (e) {}
  };

  getToken = () => {
    window.open(
      `${API_ROOT}/login/secure/aad`,
      "newwindow",
      "height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
    );
    window.addEventListener("message", this.testFunc, false);
  };

  render() {
    const { Meta } = Card;
    return (
      <div className={"backgroundImg"}>
        
        <div className={"login-card"}>
        <Card
          size="large"
          style={{ width: 600}}
          // cover={
          //   // <img
          //   //   alt="example"
          //   //   src="https://weekly.omsz.io:3000/3/yixuan.zhang@dchdc.net/AA1F01735A6343B88C1AC37C69F21736.png"
          //   // />
          // }
        >
          <Meta title="Slick Reports" description="Easily write and manage your reports"/>
          <Button type={"primary"} className={"login-btn"} onClick={this.onAuth}>
          Login
        </Button>
        </Card>
        </div>
        ,
      </div>
    );
  }
}

export default Login;
