import React from "react";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "antd/dist/antd.css";
import "../../styles/Main/Main.css";
import {Layout, Menu, Avatar, Tooltip, Col, Badge, Popover, Upload, Button, Breadcrumb} from "antd";
import TeamManagement from "./TeamManagement/TeamManagement";
import ReportPage from "./ReportManagement/ReportPage";
import WriteReport from "./WriteReport/WriteReport";
import WhitelistPage from "./WhitelistManagement/WhitelistPage";
import SubmitSuccess from "./WriteReport/SubmitSuccess";
import { showError } from "../../services/notificationService";
import { parseName } from "../../services/Utils";
import ImgCrop from 'antd-img-crop';
import {
  TeamOutlined,
  SnippetsOutlined,
  EditOutlined,
  LogoutOutlined,
  BugOutlined,
  FileSearchOutlined,
  PlusSquareOutlined,
  LoadingOutlined, QuestionCircleOutlined,UploadOutlined
} from "@ant-design/icons";
import { API_ROOT, TOKEN_KEY, ROOT, USER_TYPE_SUPER_ADMIN, USER_TYPE_ADMIN } from "../../constants";
import Modal from "./HelperComponents/Modal";
import { logout } from "../../services/loginService";
import MessageOutlined from "@ant-design/icons/lib/icons/MessageOutlined";
import SmileOutlined from "@ant-design/icons/lib/icons/SmileOutlined";
import MessageBox from "./MessageBox/MessageBox";
import Feedback from "../Feedback/Feedback";
import {getSprintService} from "../../services/sprintService";
import {getTeamInfoService} from "../../services/teamService";
import {getMessage} from "../../services/messageService";
import {saveAvatar} from '../../services/photoService';
const { Sider, Content, Header,Footer } = Layout;

class NewMain extends React.Component {
  state = {
    collapsed: false,
    currentTab: "Write Report",
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
    getMessage().then((res) => {
      let messageCount = 0;
      for (let i = 0; i < res.inboxMessage.length; i++) {
          res.inboxMessage[i].key = i;
        if (res.inboxMessage[i].status_code === 0) {
          messageCount += 1;
        }
      }
      this.setState({messageCount, messageList: res.inboxMessage})
    }).catch((err) => {
        if (err === 302) {
            clearInterval(this.getMsg);
            this.onSessionExpired();
        } else {
            showError("Failed to get Messages");
        }
    })
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
    if (this.state.currentTab === "Team Management") {
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
    } else if (this.state.currentTab === "Feedback") {
      return (
          <Feedback
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
              successTab = {this.successTab}
          />
      );
    }else if (this.state.currentTab === "Whitelist"){
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
    this.changeTab("Write Report");
  };

  onPageChange = (e) => {
    this.setState({ currentTab: e.key });
  };

  toMessages = () => {
    this.setState({ currentTab: "MessageBox" });
  };

  toFeedback = () => {
      this.setState({ currentTab: "Feedback" });
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
  }
  render() {
    let username = this.props.userInfo.username;
    let userEmail = this.props.userInfo.email;
    console.log(this.props.userInfo);
    //tour
    const { isTourOpen, messageCount } = this.state;
    const accentColor = "#5cb7b7";
    let title = (
        <div>
          {this.props.userInfo.avatar === undefined || this.props.userInfo.avatar === null ||this.props.userInfo.avatar.length === 0?
            <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
              {parseName(username)}
            </Avatar>
            :
            <Avatar src={ROOT+this.props.userInfo.avatar}/>
          }
          <span style={{marginLeft: "10px"}}>
            <span>{username}</span>
            <Tooltip title="For some special reasons, we can't get your displayName and avatar, but we support updating your avatar within this tool.">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        </div>
    );
    let content = (
      <div>
        <div style={{"overflow": "auto"}}>
          {/* <a onClick={this.onChangePhotoModal}>
            Update avatar Modal
          </a> */}
          <ImgCrop rotate>
              <Upload
                listType="text"
                // fileList={fileList}
                onChange={(info)=>{
                  const{status}  = info.file;
                  if (status !== 'uploading') {
                      this.saveAPhoto(info.file.originFileObj);
                  }
              }}
                onPreview={this.onPreview}
                name={this.props.userInfo.userEmail+".jpg"}
                showUploadList={false}
              >
                {/* {fileList.length < 5 && '+ Upload'} */}
                <a>Update avatar </a>
                {/* <Button>
                  <UploadOutlined /> Upload
                </Button> */}
              </Upload>
            </ImgCrop>
        </div>
        <div style={{"overflow": "auto"}}>
          <a href="#" className="logout" onClick={this.props.handleLogout}>
            <LogoutOutlined /> Logout
          </a>
        </div>
      </div>
    );
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} onClick={this.onClick}>
            <Menu.Item key="1">添加笔记</Menu.Item>
            <Menu.Item key="2">笔记</Menu.Item>
            <Menu.Item key="3">模板库</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">Content</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
  );
  }
  //for user guide config, if you want to add more, just add a data-tut contribute.
  tourConfig = [

        //user guide for write report page
        {
          selector: '[data-tut="tour_writeReport"]',
          content: `Write your report here or send report by email here, please join a team before wrting`,
          action: () => {
            if (this.state.currentTab !== "Write Report") {
              this.setState({ currentTab: "Write Report" });
            }
          },
        },

      //user guide for reports
        {
          selector: '[data-tut="tour_reports"]',
          content: `Manage the reports in your team, or review your report history`,
          action: () => {
            if (this.state.currentTab !== "Reports") {
              this.setState({ currentTab: "Reports" });
            }
          },
        },
      
    //user guide for team
    {
      selector: '[data-tut="tour_team"]',
      content: `Create or join a team`,
      action: () => {
        if (this.state.currentTab !== "Team Management") {
          this.setState({ currentTab: "Team Management" });
        }
      },
    },

    //user guide
    {
      selector: '[data-tut="tour_userGuide"]',
      content: `Keep in mind that whenever you meet some bugs or issues, please send us a feedback`,
    },
  ];
}

export default NewMain;
