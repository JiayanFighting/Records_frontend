import React, { Component } from "react";
import "antd/dist/antd.css";
import "../../styles/Login/Login.css";
import { Button, Card, Form, Input, Checkbox, message } from "antd";
import { TOKEN_KEY, API_ROOT } from "../../constants";
import {loginService} from "../../services/loginService"
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
    console.log("userinfo");
    console.log(localStorage.getItem(TOKEN_KEY));
    let userinfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
    // let userinfo = localStorage.getItem(TOKEN_KEY);
    
    console.log(userinfo);
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

  onFinish = values => {
    console.log('Success:', values);
    this.setState({ isAuth: false, show: true });
    loginService(values).then((res) => {
      console.log(res);
      res = JSON.parse(res);
      console.log(res);
      localStorage.setItem(TOKEN_KEY, res);
      this.onLogin();
    }).catch((err) => {
        if (err === 302) {
            this.props.onSessionExpired();
        } else {
            message.error("Failed to login!");
        }
    });
  };



  render() {
    return (
      <div className={"backgroundImg"}>
        <div className={"login-card"}>
        <Form
          labelCol={{span: 4}}  wrapperCol={{ span: 8 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item labelCol={{span: 4}}  wrapperCol={{ span: 16 }} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item labelCol={{span: 8}}  wrapperCol={{ span: 16 }} >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      
        </div>
        ,
      </div>
    );
  }
}

export default Login;
