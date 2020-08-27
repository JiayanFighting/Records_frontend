import React from "react";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "antd/dist/antd.css";
import "../../styles/Visit/VisitorMain.css";
import {Layout, Menu, Avatar, Tooltip, Col, Badge, Popover, Upload, Button, Breadcrumb, message} from "antd";
//components
import UserInfoPage from "../Main/UserManagement/UserInfoPage";
// services
import {getUserInfoForVisitService} from "../../services/userService";
import { VISITOR_USERID } from "../../constants";
import MyNotesPage from "../Main/NoteManagement/MyNotesPage";
const { Sider, Content, Header,Footer } = Layout;

class VisitorMain extends React.Component {
  state = {
    visible:true,
    userInfo:{
      id: VISITOR_USERID,
      avatar:"",
      email: "",
      type: 1,
      username: "游客"
    },
    isLoadingUserInfo:true,
  }
  componentDidMount(){
    console.log("VisitorMain componentDidMount");
      // 判断是否被别人可见
      getUserInfoForVisitService(this.props.host).then((res) => {
        if(res.code === 0){
            this.setState({userInfo:res.user,isLoadingUserInfo:false});
        }else{
            console.log(res)
        }
    }).catch((err) => {
        if (err === 302) {
            this.props.onSessionExpired();
        } else {
            message.error("获取用户信息失败");
        }
    });
  }

  getNotes=()=>{
    if(!this.state.isLoadingUserInfo){
      return (
        <MyNotesPage userInfo={this.state.userInfo} visitor={true}/>
      );
    }
  }
  render() {
    return (
      <Layout className="layout">
        <Header className="header">
          <span>
            {this.state.userInfo.username}的Recording
          </span>
         
        </Header>
        <Layout>
        <Sider className="silder">
          <UserInfoPage userInfo={this.state.userInfo} visitor={true}/>
        </Sider>
        <Content className="content">
          {this.getNotes()}
        </Content>
        </Layout>
      </Layout>
  );
  }
}

export default VisitorMain;
