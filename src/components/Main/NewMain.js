import React from "react";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "antd/dist/antd.css";
import "../../styles/Main/NewMain.css";
import {Layout, Menu,Anchor, Tooltip, Col, Badge, Popover, Upload, Button, Breadcrumb} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import UserInfoPage from "../Main/UserManagement/UserInfoPage";
import TeamManagement from "./TeamManagement/TeamManagement";
import ReportPage from "./ReportManagement/ReportPage";
import WriteReport from "./WriteReport/WriteReport";
import WhitelistPage from "./WhitelistManagement/WhitelistPage";
import SubmitSuccess from "./WriteReport/SubmitSuccess";
import { showError } from "../../services/notificationService";
import { parseName } from "../../services/Utils";
import ImgCrop from 'antd-img-crop';
import { API_ROOT, TOKEN_KEY, ROOT, USER_TYPE_SUPER_ADMIN, USER_TYPE_ADMIN } from "../../constants";
import Modal from "./HelperComponents/Modal";
import { logout } from "../../services/loginService";
import MessageOutlined from "@ant-design/icons/lib/icons/MessageOutlined";
import SmileOutlined from "@ant-design/icons/lib/icons/SmileOutlined";
import MessageBox from "./MessageBox/MessageBox";
import {getSprintService} from "../../services/sprintService";
import {getTeamInfoService} from "../../services/teamService";
import {getMessage} from "../../services/messageService";
import {saveAvatar} from '../../services/photoService';
import WriteBoard from "./WriteAndView/WriteBoard";
import MyNotesPage from "../Main/NoteManagement/MyNotesPage";
import AllNotesPage from "../Main/NoteManagement/AllNotesPage";
import TemplatesPage from "./TemplateManagement/TemplatesPage";
import WritePage from "./WriteManagement/WritePage";
import AboutmePage from "./UserManagement/AboutmePage";
import ToolPage from "./ToolManagement/ToolPage";
import CategoryPage from "./CategoryManagement/CategoryPage";

const { Sider, Content, Header,Footer } = Layout;

class NewMain extends React.Component {
  state = {
    collapsed: false,
    currentTab: "Notes",
    integratedContent: "",
    show: false,
      curReport:[],
      // for user tour
    isTourOpen: false,
    isShowingMore: false,
    sprintObj: {},
    role: "",
    teamInfo: {},
    sprint: 0,
    messageCount: 0,
    messageList: [],
    showChangePhotoModal:false,
    successTitle: "", 
    successDesc: "",
    callbackPage:"",
  };

  componentWillMount() {
    var storage = window.localStorage;
    if (storage.getItem("teamInfo") != null && storage.getItem("teamInfo").length > 0) {
      this.setState({teamInfo:JSON.parse(storage.getItem("teamInfo"))})
    }
    if (storage.getItem("sprintObj") != null && storage.getItem("teamInfo").length > 0) {
      this.setState({sprintObj:JSON.parse(storage.getItem("sprintObj"))})
    }
  }

  componentDidMount() {

    this.getMsg = setInterval(this.initMessages, 60000);

    this.initMessages();

  }

  componentWillUnmount() {
      clearInterval(this.getMsg);
  }

  setTeamInfo = (teamInfo) => {
      this.setState({teamInfo})
      var storage = window.localStorage;
      storage.setItem("teamInfo",JSON.stringify(teamInfo));
  };

  setSprintObj = (sprintObj) => {
      this.setState({sprintObj});
      var storage = window.localStorage;
      storage.setItem("sprintObj",JSON.stringify(sprintObj));
  };
  
  initMessages = () => {
    
  };
  /**
   * set collapse side bar or not
   * @method onCollapse
   * @for Main
   * @param collapsed
   * @return null
   */
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  /**
   * Change current tab
   */
  changeTab = (tab) => {
    this.setState({currentTab:tab});
  }

  /**
   * Common success tab
   */
  successTab = (successTitle, successDesc,callbackPage) => {
    this.setState({
      currentTab:"SubmitSuccess",
      successTitle:successTitle,
      successDesc: successDesc,
      callbackPage:callbackPage
    });
  }

  /**
   * show content per side bar tabs' change
   * @method showMainContent
   * @for Main
   * @param none
   * @return pages needed to be rendered
   */
  showMainContent = () => {
    if (this.state.currentTab === "Write Note") {
      return (
          <WritePage userInfo={this.props.userInfo}/>
      );
    } else if (this.state.currentTab === "Notes") {
      return (
        <MyNotesPage  userInfo={this.props.userInfo}  visitor={false}/>
      );
    } else if (this.state.currentTab === "Square") {
      return (
        <AllNotesPage  userInfo={this.props.userInfo}/>
      );
    } else if (this.state.currentTab === "Templates") {
      return (
          <TemplatesPage />
      );
    } else if (this.state.currentTab === "Category") {
      return (
          <CategoryPage />
      );
    } else if (this.state.currentTab === "Aboutme") {
      return (
          <AboutmePage />
      );
    }else if (this.state.currentTab === "Tools") {
      return (
          <ToolPage />
      );
    } else if (this.state.currentTab === "Team Management") {
      return (
          <TeamManagement
              userInfo={this.props.userInfo}
              onSessionExpired={this.onSessionExpired}
              data-tut="tour_team_inside"
          />
      );
    } else if (this.state.currentTab === "Reports") {
      return (
          <ReportPage
              handleIntegrate={this.handleIntegrate}
              userInfo={this.props.userInfo}
              onSessionExpired={this.onSessionExpired}
              handleUpdate={this.handleUpdate}
              changeTab={this.ch}
              setSprintObj={this.setSprintObj}
              setTeamInfo={this.setTeamInfo}
              // successTab = {this.successTab}
          />
      );
    } else if (this.state.currentTab === "Write Report") {
      return (
        <WriteReport
          userInfo={this.props.userInfo}
          integratedContent={this.state.integratedContent}
          clearIntegratedContent={this.clearIntegratedContent}
          onSessionExpired={this.onSessionExpired}
          sprintObj={this.state.sprintObj}
          role={this.state.role}
          teamInfo={this.state.teamInfo}
          changeTab = {this.changeTab}
          setTeamInfo={this.setTeamInfo}
          setSprintObj={this.setSprintObj}
          successTab = {this.successTab}
        />
      );
    } else if (this.state.currentTab === "MessageBox") {
      return (
          <MessageBox
              initMessages={this.initMessages}
              messageList={this.state.messageList}
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
              successTab = {this.successTab}
          />
      );
    } else if (this.state.currentTab === "Whitelist"){
      return (
          <WhitelistPage
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
          />
      )
    }
    else if (this.state.currentTab === "SubmitSuccess") {
      return (
        <SubmitSuccess
          userInfo = {this.props.userInfo}
          changeTab = {this.changeTab}
          sprintObj={this.state.sprintObj}
          teamInfo = {this.state.teamInfo}
          successTitle = {this.state.successTitle} 
          successDesc = {this.state.successDesc}
          callbackPage = {this.state.callbackPage}
        />
      )
    }
  };

  /**
   * show content per side bar tabs' change
   * @method showMainContent
   * @for Main
   * @param selectedContent
   * @return pages needed to be rendered
   */
  handleIntegrate = (selectedContent,content) => {
    if (selectedContent === undefined || selectedContent.length === 0) {
      showError("Please choose at least one!");
    } else {
      let teamId = selectedContent[0].teamId;
      let sprint = selectedContent[0].sprint;
      let type = selectedContent[0].type;
      getSprintService(teamId, sprint, type).then((res) => {
        this.setState({
          currentTab: "Write Report",
          integratedContent: content,
        });
      }).catch((err) => {
        if (err === 302) {
          this.onSessionExpired();
        } else {
          showError("Failed to send request");
        }
      });
    }
  };

  handleUpdate = (report,sprintObj) => {
     getTeamInfoService(false, report.teamId)
        .then((res) => {
          this.setState({
            teamInfo: res.info,
          });
          if(report.toEmail === this.props.userInfo.userEmail){
            this.setState({
              role:"leader"
            });
          }
          else{
            this.setState({
              role:"member"
            })
          }
           this.setState({
               sprintObj:sprintObj,
               integratedContent:report.content,
               curReport:report,
           });
           this.setState({currentTab:"Write Report"})
           
        })
        .catch((err) => {
          if (err === 302) {
            this.onSessionExpired();
          } else {
            showError("Failed to get team info");
          }
        });
  };

  clearIntegratedContent = () => {
    this.setState({ integratedContent: "" });
  };

  onSessionExpired = () => {
    this.setState({ show: true });
  };

  handleCancel = () => {
    this.setState({ show: false });
  };

  handleOK = () => {
    localStorage.removeItem(TOKEN_KEY);
    logout()
        .then((res) => {
          this.getToken();
          this.handleCancel();
        })
        .catch((err) => {
          showError("Failed to logout");
          this.handleCancel();
        });
  };

  testFunc = (e) => {
    localStorage.setItem(TOKEN_KEY, e.data);
    this.onLogin();
  };

  getToken = () => { 
    window.open(
        `${API_ROOT}/login/secure/aad`,
        "newwindow",
        "height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
    );
    window.addEventListener("message", this.testFunc, false);
  };

  onLogin = () => {
    let userinfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
    this.props.handleLogin(userinfo);
    this.changeTab("Reports");
    this.changeTab("Notes");
  };

  onPageChange = (e) => {
    this.setState({ currentTab: e.key });
  };

  toMessages = () => {
    this.setState({ currentTab: "MessageBox" });
  };

  // user helper tour
  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  toggleShowMore = () => {
    this.setState((prevState) => ({
      isShowingMore: !prevState.isShowingMore,
    }));
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  disableBody = (target) => disableBodyScroll(target);
  enableBody = (target) => enableBodyScroll(target);

  onChangePhotoModal=()=>{
    this.setState({showChangePhotoModal:true})
  }

  exitChangePhotoModal=()=>{
    this.setState({showChangePhotoModal:false})
  }

  saveAPhoto= (file) => {
    const data = new FormData();
    data.append('photo',file);
    saveAvatar(data).then((res) => {
      this.props.handleUpdateAvatar(res.url);
    }).catch((err) => console.log(err));
  }

  // 预览
  onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

     onPageChangeTeamMgt = async () => {
        console.log("he")
        await this.setState({currentTab: "Write Report"});
         this.setState({currentTab: "Team Management"})
    };

  onClick=(e)=>{
    console.log(e);
    this.setState({currentTab:e.key})
  }
  render() {
    return (
      <Layout className="layout">
        <Header style={{padding:0}}>
          <span className="logo">
            <a href="https://microsoft.sharepoint.com/">
            <img className="icon" src={require('../../styles/Main/favicon.png')} alt="Microsoft logo"/>
            </a>
            <span>&nbsp;Recording</span>
            {/* <span className={"header-space"}>Jiayan</span> */}
          </span>
          <span className="logout">
              <a onClick={this.props.handleLogout}>
                <LogoutOutlined /> Logout
              </a>
          </span>
          <Menu mode="horizontal" defaultSelectedKeys={['Notes']} onClick={this.onClick} style={{paddingLeft:300}}>
            <Menu.Item key="Notes">我的笔记</Menu.Item>
            <Menu.Item key="Write Note">记笔记</Menu.Item>
            <Menu.Item key="Templates">模板库</Menu.Item>
            <Menu.Item key="Square">广场</Menu.Item>
            <Menu.Item key="Category">分类</Menu.Item>
            <Menu.Item key="Aboutme">关于</Menu.Item>
            <Menu.Item key="Tools">工具</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider style={{marginTop:8,backgroundColor:"white"}}>
            <Anchor>
              <UserInfoPage userInfo={this.props.userInfo} handleUpdateAvatar={this.props.handleUpdateAvatar}  visitor={false}/>
            </Anchor>
          </Sider>
          <Content style={{margin:8}}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
            <div className="site-layout-content">
              {this.showMainContent()}
            </div>
          </Content>
        </Layout>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
  );
  }
}

export default NewMain;
