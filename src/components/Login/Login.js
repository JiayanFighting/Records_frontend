import React, { Component } from "react";
import "antd/dist/antd.css";
import { Button, Form, Input, Checkbox, message,Tooltip,ascader,AutoComplete,Select } from "antd";
import { UserOutlined, QuestionCircleOutlined, GithubFilled,WeiboCircleFilled,AlipayCircleFilled,QqCircleFilled} from '@ant-design/icons';
import { TOKEN_KEY, API_ROOT } from "../../constants";
import "../../styles/Login/Login.css";
import Modal from "../Main/HelperComponents/Modal";
import {loginService,registerService} from "../../services/loginService";

class Login extends Component {
  state = {
    isAuth: true,
    show: false,
    test: "",
    showRegisterModal:false,
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
      if(res.code === 0) {
        res = JSON.stringify(res);
        localStorage.setItem(TOKEN_KEY, res);
        this.onLogin();
      }else{
        message.error(res.msg)
      }
      
    }).catch((err) => {
        if (err === 302) {
            this.props.onSessionExpired();
        } else {
            message.error("Failed to login!");
        }
    });
  };

  visitorLogin = () => {
    let values={
      'email':'',
      'password':'',
    }
    this.setState({ isAuth: false, show: true });
    loginService(values).then((res) => {
      if(res.code === 0) {
        res = JSON.stringify(res);
        localStorage.setItem(TOKEN_KEY, res);
        this.onLogin();
      }else{
        message.error(res.msg)
      }
    }).catch((err) => {
        if (err === 302) {
            this.props.onSessionExpired();
        } else {
            message.error("Failed to login!");
        }
    });
  };


  register=(values)=>{
    console.log(values);
    registerService(values).then((res) => {
      if(res.code === 0) {
        message.success("注册成功，请登录！");
        this.setState({showRegisterModal:false});
      }else{
        message.error(res.msg)
      }
    }).catch((err) => {
        if (err === 302) {
            this.props.onSessionExpired();
        } else {
            message.error("Failed to register!");
        }
    });
  }

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
              登录
            </Button><br/>
            Or <a onClick={()=>this.setState({showRegisterModal:true})}>注册</a><br/>
            <a onClick={()=>this.visitorLogin()}>游客身份登入</a>
          </Form.Item>
        </Form>
        </div>
        <div>
          <Modal
              show={this.state.showRegisterModal}
              showOk={false}
              showCancel={false}
              handleCancel={() => this.setState({showRegisterModal:false})}
              title={"注册"}
          >
              <div style={{ textAlign: "left",width:"60vw"}}>
              <Form
              labelCol={{span:8}}
              wrapperCol={{span:8}}
              name="basic"
              onFinish={this.register}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{type: 'email',message: 'The input is not valid E-mail!',},
                    {required: true,message: 'Please input your E-mail!',},]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{required: true,message: 'Please input your password!',},]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('The two passwords that you entered do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                name="username"
                label={
                  <span>
                    Nickname&nbsp;
                    <Tooltip title="What do you want others to call you?">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="github"
                label={<GithubFilled style={{fontSize:24}}/>}
                // rules={[{ required: true, message: 'github地址!' }]}
              >
                <Input placeholder="Github地址"/>
              </Form.Item>
              <Form.Item
                name="weibo"
                label={<WeiboCircleFilled style={{fontSize:24}}/>}
                // rules={[{ required: true, message: '微博地址!' }]}
              >
                <Input  placeholder="微博地址"/>
              </Form.Item>
              <Form.Item
                name="QQ"
                label={<WeiboCircleFilled style={{fontSize:24}}/>}
                // rules={[{ required: true, message: '微博地址!' }]}
              >
                <Input  placeholder="请输入QQ号"/>
              </Form.Item>
              <Form.Item
                name="alipay"
                label={<AlipayCircleFilled style={{fontSize:24}}/>}
                // rules={[{ required: true, message: '微博地址!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{offset:18,span:6}}>
                  <Button onClick={()=>this.setState({showRegisterModal:false})} style={{marginRight:20}}>取消</Button>
                  <Button type="primary" htmlType="submit" >注册</Button>
              </Form.Item>
              </Form>
              </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Login;
