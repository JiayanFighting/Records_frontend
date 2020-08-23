import React, { Component } from "react";
import {Col,Row,Button,Form,Input,
  Layout,
  message,
  Card,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Alert,
  Spin,
  Tooltip,} from "antd";
import {MailOutlined} from "@ant-design/icons";
import "antd/dist/antd.css";
import moment from "moment";
import {
  submitReportService,
  saveDraftService,
  submitTemplateService,
  sendEmailService,
  getTemplatesService,
  getReportDetailService,
  updateReportService,
} from "../../../services/reportService.js";
import {
  getCurSprintListService,
  createSprintItemService,
} from "../../../services/sprintService";
import {
  getJoinedTeamsService,
  getCreatedTeamsService,
} from "../../../services/teamService";
import { sendAutomatedFlowService } from "../../../services/automatedFlowService";
import Modal from "../HelperComponents/Modal";
import WriteAndViewBoard3 from "../WriteAndViewBoard3/WriteAndViewBoard3";
import { ROOT } from "../../../constants";
import { showError, showSuccess } from "../../../services/notificationService";
import ViewBoard from "./ViewBoard";
import WriteReportMenu from "./WriteReportMenu";
import { getReportData } from "../../../services/reportService";
import ReportsInThePast from "./ReportsInThePast";
import * as clipboard from "clipboard-polyfill";
import '../../../styles/WriteAndViewBoard/WriteReport.css';

const { RangePicker } = DatePicker;

//default template for users
let defaultText = `

### Summary of this week
* 


### Plan for the next week
* 

`;
/**
 * write-report page
 */
class WriteReport extends Component {
  state = {
    infoPage: false,
    content:
      !this.props.integratedContent || this.props.integratedContent.length === 0
        ? defaultText
        : this.props.integratedContent,
    showSendEmailModal: false,
    showReportInThePastSelectModal: false,
    showSubmitReportModal: false,
    showSubmitTemplateModal: false,
    showCreateSprintModal: false,
    showReplaceConfirmModal:false,
    // remind user to save content
    showRemindSaveModal: false,
    showAutoUpdateSprintModal: false,
    //if leader, send email to team email. if memeber, send to lead email
    toEmail: this.props.teamInfo
      ? this.props.teamInfo.teamEmail
      : "No team selected", //send email to
    subject: "subject",
    typeToSprints: [], //sprints within a team, mapped with report type: "sprint":sprint,"beginTime":beginTime,"endTime":endTime, "type" :type
    joinedTeams: [],
    createdTeams: [],
    templates: [], //templates within a team
    theme: "", //title of report
    //update target
    needUpdate: false,
    updateReportId: "",
    isLeader: this.props.role && this.props.role === "leader",
    gotIntegratedContent:
      this.props.integratedContent && this.props.integratedContent.length !== 0,
    //upcoming sprint and report
    upcomingReport: {}, //.content, .theme, id(reportId), type
    upcomingSprintObj: {}, //sprint(number),
    upcomingTemplate: {},
    //loading
    isLoading: false,
    data: {},
    contentCopied: false,
    templateContent: !this.props.integratedContent || this.props.integratedContent.length === 0
        ? defaultText
        : this.props.integratedContent,
    templateTheme: ""
  };
  setTemplateContent = (templateContent) => {
    this.setState({templateContent})
  };

  // get user's information after rendering
  componentDidMount() {
    console.log("write report props: ", this.props);
    let userEmail = { userEmail: this.props.userInfo.email};
    getJoinedTeamsService(false, userEmail)
      .then((res) => {
        this.setState({ joinedTeams: res.joinedList });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show joined teams");
        }
      });
    getCreatedTeamsService(false, userEmail)
      .then((res) => {
        this.setState({ createdTeams: res.createdList });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show joined teams");
        }
      });

    //need to get report content and theme by props.teamInfo and props.sprintObj
    if (this.props.teamInfo.id) {
      this.buildTypeToSprintMap(this.props.teamInfo.id);
      this.getTemplatesInTeam(this.props.teamInfo.id);
    }
    if (this.props.teamInfo.id && this.props.sprintObj.sprint) {
      let params = {
        teamId: this.props.teamInfo.id,
        type: this.props.sprintObj.type,
        sprint: this.props.sprintObj.sprint,
        fromEmail: this.props.userInfo.email,
      };
      getReportDetailService(params)
        .then((res) => {
          this.setState({
            content: res.content,
            theme: res.theme,
          });
        })
        .catch((err) => {
          console.log("get reports err: ", err);
        });
    }
  }

  //when component unmount
  componentWillUnmount() {
    if (this.props.sprintObj.sprint) {
      //auto save to draft
      this.saveDraft(this.state.content);
    }
    this.props.clearIntegratedContent();
  }

  //common function for handling click event
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  /**
   * close modal by modal name
   * @param modalName: enter a modal name to close it
   */
  exitModal = (modalName) => {
    this.setState({
      [modalName]: false,
    });
  };

  /**
   * show modal by modal name
   * @param modalName: enter a modal name to show it
   */
  showModal = (modalName) => {
    if (modalName === "showSubmitReportModal") {
      if (!this.props.teamInfo || this.props.teamInfo.id === -1) {
        message.error("please select a team");
        return;
      }
      // if (!this.state.theme || this.state.theme === "") {
      //   message.error("please enter the title");
      //   return;
      // }
    }
    this.setState({
      [modalName]: true,
    });
  };

  /**
   * This function is for child component to update props's state
   * For example, in WriteAndViewBoard, you can change props's content by calling onChange={this.props.setContent(content)}
   * @param content
   */
  setContent = (content) => {
    this.setState({ content: content, templateContent: content });
  };

  // set default content you want
  setDefaultContent = (content) => {
    this.setState({ defaultContent: content });
  };

  /**
   * change theme of current report or template
   * @param theme
   */
  setTheme = (theme) => {
    this.setState({ theme: theme, templateTheme: theme  });
  };

  setTemplateTheme = (theme) => {
    this.setState({ templateTheme: theme });
  };
  /**
   * Update state by selecting a team in team list
   * @param teamInfo
   */
  selectTeam = (teamInfo, isLeader) => {
    if (!teamInfo) {
      showError("no team selected!");
    }
    //auto save previous work
    if (this.props.teamInfo && this.props.sprintObj.sprint) {
      this.saveDraft(this.state.content);
    }
    this.setState({
      toEmail: isLeader ? teamInfo.teamEmail : teamInfo.leadEmail,
      isLeader: isLeader,
    });
    this.props.setTeamInfo(teamInfo);
    this.props.setSprintObj({});
    this.getTemplatesInTeam(teamInfo.id);
    this.buildTypeToSprintMap(teamInfo.id);
  };

  buildTypeToSprintMap = (teamId) => {
    getCurSprintListService(teamId)
      .then((res) => {
        let typeToSprints = new Map();
        console.log("sprints: " + res.curList);
        for (let i = 0; i < res.curList.length; i++) {
          let type = res.curList[i].type;
          let sprint = res.curList[i].sprint;
          let beginTime = moment(res.curList[i].beginTime).format("YYYY-MM-DD");
          let endTime = moment(res.curList[i].endTime).format("YYYY-MM-DD");
          if (!typeToSprints.has(type)) {
            typeToSprints.set(type, []);
          }
          typeToSprints.get(type).push({
            sprint: sprint,
            beginTime: beginTime,
            endTime: endTime,
            type: type,
          });
        }
        this.setState({ typeToSprints: typeToSprints });
        console.log("team selected: " + this.state.typeToSprints);
        // if (this.state.typeToSprints && Array.from(this.state.typeToSprints.keys()).length > 0) this.showModal("showSprintSelectModal");
        //           else {
        //             message.error("Sorry but there is no sprint in this team");
        //           }
      })
      .catch((err) => {
        console.log("get sprints err: " + err);
      });
  };

  renderSubmitSuccess() {
    const successTitle = "Successfully submitted a report to: "+ this.props.teamInfo.teamName+" ("+this.props.sprintObj.type+" "+this.props.sprintObj.sprint+")";
    const successDesc = "Please note the deadline of this sprint is "+this.props.sprintObj.endTime+", so you can update your report at any time before this deadline!";
    const callbackPage = "Write Report"
    this.props.successTab(successTitle,successDesc,callbackPage);
  }

  // submit report to team
  submitReport = (content) => {
    console.log("submit report: ", content);
    this.setState({ isLoading: true });
    if (!this.props.sprintObj || !this.props.sprintObj.sprint) {
      return;
    }
    let teamId = this.props.teamInfo.id;
    if (!teamId || teamId === -1) {
      return;
    }
    let email = this.props.userInfo.email;
    let curr_report = {
      fromEmail: email,
      toEmail: this.props.teamInfo.leadEmail,
      content: content,
      type: this.props.sprintObj.type ? this.props.sprintObj.type : "default",
      theme: this.state.theme,
      teamId: teamId,
      sprint: this.props.sprintObj.sprint,
    };
    if (
      this.state.needUpdate === true &&
      this.state.updateReportId !== "" &&
      this.state.updateReportId !== undefined
    ) {
      curr_report.id = this.state.updateReportId;
      updateReportService(curr_report)
        .then((res) => {
          console.log("update res: ", res);
          this.exitModal("showSubmitReportModal");
          this.setState({ gotIntegratedContent: false });
          // this.clearIntegratedContentAndResetContent();
          this.setState({ isLoading: false });
          this.renderSubmitSuccess();
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError(err);
          }
          this.setState({ isLoading: false });
        });
    } else {
      submitReportService(false, curr_report)
        .then((res) => {
          this.exitModal("showSubmitReportModal");
          console.log("submit res: ", res);
          this.setState({
            updateReportId: res.id,
            needUpdate: true,
            gotIntegratedContent: false,
          });
          this.setState({ isLoading: false });
          this.renderSubmitSuccess();
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError(err);
          }
          this.setState({ isLoading: false });
        });
    }
  };

  //save draft
  saveDraft = (content) => {
    this.setState({ isLoading: true });
    if (!this.props.sprintObj || !this.props.sprintObj.sprint) {
      return;
    }
    let teamId = this.props.teamInfo.id;
    if (!teamId || teamId === -1) {
      return;
    }
    let email = this.props.userInfo.email;
    let curr_report = {
      fromEmail: email,
      toEmail: this.props.teamInfo.leadEmail,
      content: content,
      type: this.props.sprintObj.type ? this.props.sprintObj.type : "default",
      theme: this.state.theme,
      teamId: teamId,
      sprint: this.props.sprintObj.sprint,
    };
    console.log("currReport: ",curr_report);
      curr_report.id = this.state.updateReportId;
      saveDraftService(curr_report)
        .then((res) => {
          console.log("draft saved: ", res);
          this.exitModal("showSaveDraftModal");
          this.setState({ gotIntegratedContent: false });
          // this.clearIntegratedContentAndResetContent();
          this.setState({ isLoading: false });
          message.success("Successfully saved draft!")
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError("Failed to save because no sprint selected");
          }
          this.setState({ isLoading: false });
        });
  }

  clearIntegratedContentAndResetContent = () => {
    this.props.clearIntegratedContent();
    this.setState({ content: defaultText });
  };

  submitTemplate = (content, theme) => {
    if (theme === undefined || theme.length === 0) {
      showError("please enter title")
      return;
    }
    let curr_template = {
      creatorEmail: this.props.userEmail,
      content: content,
      type: this.props.sprintObj.type ? this.props.sprintObj.type : "default",
      theme: theme,
      teamId: this.props.teamInfo.id,
    };
    submitTemplateService(false, curr_template)
      .then((res) => {
        showSuccess("Template Saved Successfully");
        this.exitModal("showSubmitTemplateModal");
        this.getTemplatesInTeam(this.props.teamInfo.id);
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to save template");
        }
      });
  };

  // get templates within a team
  getTemplatesInTeam = (teamId) => {
    getTemplatesService(false, teamId)
      .then((res) => {
        this.setState({
          templates: res.templates,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show templates");
        }
      });
  };

  selectTemplate = (template) => {
    if (template.content !== this.state.content) {
      this.setState({
        upcomingReport: template,
        upcomingSprintObj: this.props.sprintObj,
        upcomingTemplate: template,
      });
      if (this.state.content !== defaultText) this.showModal("showAcceptUpcomingModal");
      else {
        // let upcomingReport = this.state.upcomingReport;
        let upcomingReport = template;
        this.setState({
          theme: upcomingReport.theme,
          content: upcomingReport.content,
        });
      }
    }
  };

  //insert a url into content
  insertPhotoUrl = (url) => {
    let content = this.state.content;
    // for example: <img src="https://weekly.omsz.io:3000/5/yixuan.zhang@dchdc.net/FAD75E474ECD4270BEC36C497961564E.png" alt=“upload”  width="100%">
    // when sending email, convert to base64
    content =
      '<img src="' +
      ROOT +
      url +
      '" alt="image uploaded' +
      '" width="50%"/> \n' +
      content;
    this.setState({ content: content });
  };

  //send email
  sendEmail = (values) => {
    this.setState({ isLoading: true });
    let toTeam = this.props.teamInfo;
    if (!toTeam || !toTeam.flowUrl) {
      message.error("No flowUrl");
    }
    let flowUrl = toTeam.flowUrl;
    let body = {
      title: values.subject,
      content: this.state.content,
      toEmail: values.to,
      access_token: "StatuslyNumberOne",
    };
    sendAutomatedFlowService(flowUrl, body)
      .then((res) => {
        message.success("Successfully Sent");
        this.setState({ isLoading: false });
        this.exitModal("showSendEmailModal");
      })
      .catch((err) => {
        message.error(err);
        this.setState({ isLoading: false });
      });
  };

  /**
   * Promising way, send email with Graph API
   * If someday in the future this tool get the permission, we would be happy.
   */
  sendEmail = (values) => {
    this.setState({ isLoading: true });
    let from = this.props.userInfo.email;
    let to = values.to;
    let subject = values.subject;
    let cc = values.cc;
    let content = this.state.content;
    let email = {
      from: from,
      to: to,
      subject: subject,
      cc: cc,
      content: content,
    };
    sendEmailService(false, email)
      .then((res) => {
        if (res.code === 500) {
          showError("Email oversize, please within 4MB");
          this.setState({ isLoading: false });
          return;
        }
        showSuccess("Successfully sent");
        this.setState({ isLoading: false });
        this.exitModal("showSendEmailModal");
        // update sprint
        if (this.state.gotIntegratedContent && this.state.isLeader) {
          // this.props.sprintObj
          this.setState({
            showAutoUpdateSprintModal: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Email oversize, please within 4MB");
        }
      });
  };

  callback = () => {
    this.setState({ infoPage: false });
  };

  /**
   * Deal with content conflict when change sprint:
   * Conflict only happens when different contents exists in two different sprint 
   * @param {new sprint selected} sprintObj 
   */
  changeSprint = (sprintObj) => {
    // whether update
    let upcomingParams = {
      teamId: this.props.teamInfo.id,
      sprint: sprintObj.sprint,
      type: sprintObj.type,
      fromEmail: this.props.userInfo.email,
    };
    let previousParams = {
      teamId: this.props.teamInfo.id,
      sprint: this.props.sprintObj.sprint,
      type: this.props.sprintObj.type,
      fromEmail: this.props.userInfo.email,
    };
    //判断新的sprint是否有内容，如果没有，将正在编辑的内容带过去
    getReportDetailService(upcomingParams)
      .then((res) => {
        // if there is upcoming content in the upcoming sprint
        if (res.code !== -1) {
          this.setState({
            upcomingReport: res,
            upcomingSprintObj: sprintObj,
          });
          //check previous one whether need to save
          getReportDetailService(previousParams).then((previousRes) => {
            console.log("previous res: ", previousRes);
            //如果之前的内容是默认内容并且未提交过，不自动保存
            if (previousRes.code === -1 && this.state.content === defaultText) {
              //not found previous reports
              console.log("not found previous report");
              this.setState({
                content: res.content,
                templateContent: res.content,
                theme: res.theme,
                needUpdate: true,
                updateReportId: res.id,
              });
              this.props.setSprintObj(sprintObj);
              return;
            }
            //previously submitted a report to upcoming sprint, but same content as old version, not show save modal，如果之前report的内容和即将自动保存的一致，无需保存
            if (
              previousRes.code !== -1 &&
              previousRes.content === this.state.content &&
              previousRes.theme === this.state.theme
            ) {
              console.log("same content not save");
              this.setState({
                content: res.content,
                templateContent: res.content,
                theme: res.theme,
                needUpdate: true,
                updateReportId: res.id,
              });
              this.props.setSprintObj(sprintObj);
            } else {
              this.showModal("showRemindSaveModal");
            }
          });
        } else {
          this.setState({
            needUpdate: false,
            updateReportId: "",
          });
          //自动使用最新的template
          if (this.state.content === defaultText && this.state.templates && this.state.templates.length > 0) {
            console.log("auto select template");
            this.selectTemplate(this.state.templates[this.state.templates.length-1]);
          }
          this.props.setSprintObj(sprintObj);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to get the detail");
        }
      });
  };

  //accept upcoming content
  confirmChange = () => {
    //save old one
    this.saveDraft(this.state.content);
    console.log("confirm change", this.state.upcomingReport);
    this.setState({
      content: this.state.upcomingReport.content,
      theme: this.state.upcomingReport.theme,
      needUpdate: true,
      updateReportId: this.state.upcomingReport.id,
    });
    this.props.setSprintObj(this.state.upcomingSprintObj);
  };

  handleAddSprint = (values) => {
    let type =
      values.type === undefined ? this.props.sprintObj.type : values.type;
    let sprint =
      values.sprint === undefined
        ? this.props.sprintObj.sprint + 1
        : values.sprint;
    let beginTime;
    let endTime;
    if (values.date === undefined) {
      //defalut
      beginTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD")
        .add(1, "days")
        .format("YYYY-MM-DD");
      endTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD")
        .add(7, "days")
        .format("YYYY-MM-DD");
      if (type === "daily") {
        beginTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD")
          .add(1, "days")
          .format("YYYY-MM-DD");
        endTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD")
          .add(1, "days")
          .format("YYYY-MM-DD");
      } else if (type === "monthly") {
        beginTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD").add(
          1,
          "days"
        );
        endTime = moment(this.props.sprintObj.endTime, "YYYY-MM-DD").add(
          30,
          "days"
        );
      }
    } else {
      beginTime = values.date[0].format("YYYY-MM-DD");
      endTime = values.date[1].format("YYYY-MM-DD");
    }

    let sprintObj = {
      teamId: this.props.teamInfo.id,
      type: type,
      sprint: sprint,
      beginTime: beginTime,
      endTime: endTime,
    };
    console.log(sprintObj);
    createSprintItemService(sprintObj)
      .then((res) => {
        if (res.code === 0) {
          message.success("Successfully !");
          this.exitModal("showAutoUpdateSprintModal");
          this.exitModal("showCreateSprintModal");
          let typeToSprints = this.state.typeToSprints;
          if (!typeToSprints.has(sprintObj.type)) {
            typeToSprints.set(type, []);
          }
          typeToSprints.get(type).push({
            sprint: sprintObj.sprint,
            beginTime: beginTime,
            endTime: endTime,
            type: sprintObj.type,
          });
          this.setState({
            typeToSprints: typeToSprints,
          });
          this.changeSprint(sprintObj);
        } else {
          message.error(
            "Failed! This sprint have existed! Have a change or go to team management page to update!"
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onShowReportsInThePastClicked = () => {
    var params = {
      fromEmail: this.props.userInfo.email, // opt , if no userEmail ,required
      offset: 0, // opt ,default 0
      limit: 10, //  opt ,default 10
    };
    this.getReportDataWithKeys(params);
  };

  getReportDataWithKeys = (params) => {
    getReportData(false, params)
      .then((res) => {
        let data = [];
        for (let i = 0; i < res.list.length; i++) {
          let cur = res.list[i];
          cur.key = i;
          data.push(cur);
        }
        this.setState({ data: data, showReportInThePastSelectModal: true });
      })
      .catch((err) => {
        console.log(err);
        this.exitModal("showReportInThePastSelectModal");
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to get history");
        }
        this.setState({ showReportInThePastSelectModal: true });
      });
  };

  handleReplace = (record) => {
    this.setState({
      content: record.content,
      showReportInThePastSelectModal: false,
      theme: record.theme,
    });
  };

  render() {
    const { infoPage, data } = this.state;
    console.log("data: ", data);

    //form css
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
    let state = this.state;
    return (
      <Layout>
        <div style={!infoPage ? {} : { display: "none" }}>
          {/* Menu on the top to select team and sprint */}
          <WriteReportMenu
            {...this.props}
            handleClick ={this.handleClick}
            joinedTeams = {state.joinedTeams}
            createdTeams = {state.createdTeams}
            typeToSprints = {state.typeToSprints}
            selectTeam = {this.selectTeam}
            changeSprint = {this.changeSprint}
            selectTemplate = {this.selectTemplate}
            showModal = {this.showModal}
            insertPhotoUrl = {this.insertPhotoUrl}
            onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
            templates = {state.templates}
            isLeader = {state.isLeader}
            needUpdate = {state.needUpdate}
            saveDraft = {this.saveDraft}
            content = {this.state.content}
            theme = {this.state.theme}
          ></WriteReportMenu>
          {this.props.teamInfo && this.props.sprintObj.sprint ? (
            <WriteAndViewBoard3
              setContent={this.setContent.bind(this)}
              setDefaultContent={this.setDefaultContent.bind(this)}
              setTheme={this.setTheme.bind(this)}
              content={state.content}
              theme={state.theme}
              sprintObj={this.props.sprintObj}
              teamInfo={this.props.teamInfo}
              onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
              insertPhotoUrl = {this.insertPhotoUrl}
              saveDraft = {this.saveDraft}
              hideSomeFunctions={false}
            ></WriteAndViewBoard3>
          ) : (
            <Alert
              message="You must select a team and sprint first"
              type="warning"
            />
          )}
        </div>
        {/* modal for showing history */}
        <div>
          <Modal
            show={this.state.showReportInThePastSelectModal}
            handleCancel={() =>
              this.exitModal("showReportInThePastSelectModal")
            }
            handleOk={() => this.exitModal("showReportInThePastSelectModal")}
            showOk={false}
            showCancel={false}
            okMessage={"Confirm Submit"}
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title={"Select a report to replace the current content"}
          >
            <ReportsInThePast data={data} handleReplace={this.handleReplace} />
          </Modal>
        </div>

        {/* modal for submit report */}
        <div>
          <Modal
            show={this.state.showSubmitReportModal}
            handleCancel={() => this.exitModal("showSubmitReportModal")}
            handleOk={() => this.submitReport(this.state.content)}
            okMessage={
              "Confirm Submit"
            }
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title={"Submit your report to: "+this.props.teamInfo.leadEmail}
          >
            <div style={{ textAlign: "left" }}>
              <h4>
                <Row>
                  <Col span={6}>To Team : </Col>
                  <Col span={18}>
                    {this.props.teamInfo
                      ? this.props.teamInfo.teamName
                      : "please select a team"}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Report Type : </Col>
                  <Col span={18}>{this.props.sprintObj.type} </Col>
                </Row>
                <Row>
                  <Col span={6}> Sprint : </Col>
                  <Col span={18}>
                    {this.props.sprintObj.sprint
                      ? this.props.sprintObj.sprint
                      : "draft"}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Title : </Col>
                  <Col span={18}>{this.state.theme} </Col>
                </Row>
              </h4>
            </div>
            <Spin tip="Loading..." spinning={this.state.isLoading}>
              <Row style={{ width: "50vw" }}>
                <ViewBoard content={this.state.content} theme={this.state.theme}/>
              </Row>
            </Spin>
          </Modal>
        </div>

        {/* modal for submit template */}
        <div>
          <Modal
            show={this.state.showSubmitTemplateModal}
            handleCancel={() => this.exitModal("showSubmitTemplateModal")}
            handleOk={() => this.submitTemplate(this.state.templateContent, this.state.templateTheme)}
            okMessage={"Save as a Template"}
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title={
              "Confirm save as a template for team " +
              this.props.teamInfo.teamName
            }
          >
            <div style={{ textAlign: "left" }}>
              <h4>
                <Row>
                  <Col span={8}>To Team :
                    {this.props.teamInfo
                      ? this.props.teamInfo.teamName
                      : "please select a team"}
                  </Col>
                  <Col span={8}> Report Type : {this.props.sprintObj.type} </Col>

                  <Col span={8}> Sprint :
                    {this.props.sprintObj.sprint
                      ? this.props.sprintObj.sprint
                      : "draft"}
                  </Col>
                </Row>
              </h4>
            </div>
            <Spin tip="Loading..." spinning={this.state.isLoading}>
              <div style={{ width: "50vw", height: "60vh", overflow: "scroll" }}>
                <WriteAndViewBoard3
                    setContent={this.setTemplateContent}
                    content={this.state.templateContent}
                    defaultText={this.state.templateContent}
                    setTheme={this.setTemplateTheme}
                    theme={this.state.templateTheme}
                    sprintObj={this.props.sprintObj}
                    teamInfo={this.props.teamInfo}
                    onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                    insertPhotoUrl = {this.insertPhotoUrl}
                    saveDraft = {this.saveDraft}
                    hideSomeFunctions={true}
                />
              </div>
            </Spin>
          </Modal>
        </div>

        {/* modal for send email */}
        <div>
          <Modal
            show={this.state.showSendEmailModal}
            handleCancel={() => this.exitModal("showSendEmailModal")}
            handleOk={() => this.sendEmail(this.state.content)}
            showOk={false}
            showCancel={false}
            okMessage={"Confirm Submit"}
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title={
              "Send Email to " +
              (this.props.teamInfo ? this.props.teamInfo.teamName : "") +
              (this.state.sprint !== 0
                ? " (Sprint " +
                  this.props.sprintObj.sprint +
                  ": " +
                  this.props.sprintObj.beginTime +
                  " - " +
                  this.props.sprintObj.endTime +
                  ")"
                : "draft")
            }
          >
            <Spin tip="Loading..." spinning={this.state.isLoading}>
              <Form
                disabled={true} //if get Graph permission in the future, delete this
                style={{ width: "50vw" }}
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.sendEmail}
                onFinishFailed={() => alert("failed")}
              >
                <Form.Item
                  label="To"
                  name="to"
                  initialValue={this.state.toEmail}
                  rules={[
                    { required: true, message: "Please input the recipient!" },
                  ]}
                >
                  <Input disabled={true} //if get Graph permission in the future, delete this
                  />
                </Form.Item>
                <Form.Item
                  label="Subject"
                  name="subject"
                  initialValue={this.state.theme}
                  rules={[
                    { required: true, message: "Please input the Subject!" },
                  ]}
                >
                  <Input disabled={true} //if get Graph permission in the future, delete this
                  /> 
                </Form.Item>
                <Form.Item
                  label="Cc"
                  name="cc"
                  rules={[
                    { required: false, message: "Please input your Cc!" },
                  ]}
                  initialValue={
                    this.props.teamInfo ? this.props.teamInfo.ccList : ""
                  }
                >
                  <Input placeholder="example1@example.com; example2@example.com" disabled={true} //if get Graph permission in the future, delete this
                  />
                </Form.Item>

                <Row>
                  <Col offset={3} span={18}>
                    <ViewBoard content={this.state.content} height={"48vh"} />
                  </Col>
                </Row>

                <Form.Item {...tailLayout}>
                  <Button
                    onClick={() => this.exitModal("showSendEmailModal")}
                    style={{ "margin-right": 10 }}
                  >
                    Cancel
                  </Button>
                  <Tooltip title="Due to no permission, please use the copy button, paste and send email by youself">
                  <Button
                    icon={<MailOutlined />}
                    type={this.state.contentCopied ? "loading" : "default"}
                    onClick={() => {
                      const html = document.getElementById("preview-html").innerHTML;
                      const item = new clipboard.ClipboardItem({
                        "text/html": new Blob([html], { type: "text/html" }),
                      });
                      clipboard.write([item]);
                      this.setState({ contentCopied: true });
                    }}
                  >
                    {this.state.contentCopied ? "Content Copied" : "Copy"}
                  </Button>
                  </Tooltip>
                  <Tooltip title="Due to no permission, please use the copy button, paste and send email by youself">
                  <Button disabled={true} type="primary" htmlType="submit">
                    Send Email
                  </Button>
                  </Tooltip>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </div>

        {/* Modal for remind user for upcoming content, back, accept upcoming or overwrite*/}
        <Modal
          show={this.state.showRemindSaveModal}
          handleCancel={() => {
            this.exitModal("showRemindSaveModal");
          }}
          //overwrite
          handleOk={() => {
            let upcomingSprintObj = this.state.upcomingSprintObj;
            let upcomingReport = this.state.upcomingReport;
            this.setState({
              sprint: upcomingSprintObj.sprint,
              needUpdate: true,
              updateReportId: upcomingReport.id,
            });
            this.props.setSprintObj(upcomingSprintObj);
            this.exitModal("showRemindSaveModal");
          }}
          //use previous submited content
          handleClickMid={() => {
            let upcomingReport = this.state.upcomingReport;
            let upcomingSprintObj = this.state.upcomingSprintObj;
            if (this.props.sprintObj.sprint) {
              this.saveDraft(this.state.content);
            }
            this.setState({
              content: upcomingReport.content,
              sprint: upcomingSprintObj.sprint,
              theme: upcomingReport.theme
            });
            this.props.setSprintObj(upcomingSprintObj);
            this.exitModal("showRemindSaveModal");
          }}
          showMidButton={true}
          okMessage={"Overwrite previous"}
          cancelMessage={"Back"}
          midMessage={"Use previous"}
          cancelBtnType={""}
          okBtnType={"primary"}
          title={"Already submitted a report for this sprint"}
        >
          <Row
            type={"flex"}
            justify={"center"}
            align={"top"}
            style={{ padding: "12px" }}
          >
            <div className="site-card-wrapper">
              <Row style={{ width: "80vw" }}>
                <Col span={12}>
                  <Card title={"Current work: ("+this.props.sprintObj.type+"-"+this.props.sprintObj.sprint+")"} bordered={false}>
                    <ViewBoard
                      disabled={true}
                      content={this.state.content}
                      theme={this.state.theme}
                    ></ViewBoard>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={
                      "Previous content: (" +
                      this.state.upcomingSprintObj.type +
                      "-" +
                      this.state.upcomingSprintObj.sprint +
                      ")"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.upcomingReport.content}
                      theme={this.state.upcomingReport.theme}
                    ></ViewBoard>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Modal>

        {/* Modal for remind user for upcoming content will replace current content*/}
        <Modal
          show={this.state.showAcceptUpcomingModal}
          handleCancel={() => {
            this.exitModal("showAcceptUpcomingModal");
          }}
          handleOk={() => {
            this.exitModal("showAcceptUpcomingModal");
            this.showModal("showReplaceConfirmModal")
          }}
          okMessage={"Replace content with upcoming template"}
          cancelMessage={"Back"}
          cancelBtnType={""}
          okBtnType={""}
          okDanger={true}
          title={"Warning: using template will replace the current content"}
        >
          <Row
            type={"flex"}
            justify={"center"}
            align={"top"}
            style={{ padding: "12px" }}
            data-tut="tour_team_join_info"
          >
            <div className="site-card-wrapper">
              <Row style={{ width: "80vw" }}>
                <Col span={12}>
                  <Card title={"Current work"} bordered={false}>
                    <ViewBoard
                      disabled={true}
                      content={this.state.content}
                      theme={this.state.theme}
                    ></ViewBoard>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={
                      "Upcoming content: (" +
                      this.state.upcomingSprintObj.type +
                      "-" +
                      this.state.upcomingSprintObj.sprint +
                      ")"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.upcomingReport.content}
                      theme={this.state.theme}
                    ></ViewBoard>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Modal>

        {/* confirm replacing content */}
        <Modal
          show={this.state.showReplaceConfirmModal}
          handleCancel={() => {
            this.exitModal("showReplaceConfirmModal");
          }}
          handleOk={() => {
            let upcomingReport = this.state.upcomingReport;
            this.setState({
              theme: upcomingReport.theme,
              content: upcomingReport.content,
            });
            this.exitModal("showReplaceConfirmModal");
          }}
          okMessage={"Confirm Replacing"}
          cancelMessage={"Cancel"}
          cancelBtnType={""}
          okBtnType={""}
          okDanger={true}
          title={"You previous content will not be saved, are you sure to replace?"}
        >
        </Modal>

        {/* Modal for renew a sprint */}
        <Modal
          show={this.state.showAutoUpdateSprintModal}
          handleCancel={() => {
            this.exitModal("showAutoUpdateSprintModal");
          }}
          showOk={false}
          showCancel={false}
          title={"Add a new sprint"}
        >
          <div>
            <Row
              type={"flex"}
              justify={"center"}
              align={"top"}
              style={{ width: 600 }}
            >
              <Col span={24}>
                <Form
                  onFinish={this.handleAddSprint}
                  // onFinishFailed={this.onFinishFailed}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                  name="nest-messages"
                  style={{ margin: 10 }}
                >
                  <Form.Item
                    name="sprint"
                    label="Sprint"
                    rules={[{ type: "number", min: 1 }]}
                    initialValue={
                      this.props.sprintObj ? this.props.sprintObj.sprint + 1 : 1
                    }
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item name="type" label="Type">
                    <Select
                      defaultValue={
                        this.props.sprintObj
                          ? this.props.sprintObj.type
                          : "weekly"
                      }
                      style={{ "min-width": "100px" }}
                      // onChange={(e) => this.changeUpdateSprintType(e)}
                    >
                      <Select.Option value="weekly">weekly</Select.Option>
                      <Select.Option value="monthly">monthly</Select.Option>
                      <Select.Option value="daily">daily</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Date Range" name="date">
                    <RangePicker
                      defaultValue={() => {
                        if (this.props.sprintObj === {}) {
                          return [moment(), moment().add(7, "days")];
                        } else if (this.props.sprintObj.type === "daily") {
                          return [
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(1, "days"),
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(1, "days"),
                          ];
                        } else if (this.props.sprintObj.type === "monthly") {
                          return [
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(1, "days"),
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(30, "days"),
                          ];
                        } else {
                          return [
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(1, "days"),
                            moment(
                              this.props.sprintObj.endTime,
                              "YYYY-MM-DD"
                            ).add(7, "days"),
                          ];
                        }
                      }}
                    />
                  </Form.Item>
                  {/* <Form.Item label="Date Range" name="date" >
                      <RangePicker defaultValue={
                        this.props.sprintObj==={}?[moment(this.props.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'), moment(this.props.sprintObj.endTime, 'YYYY-MM-DD').add(7,'days')]:[moment(), moment().add(7,'days')]} />
                  </Form.Item> */}
                  <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
                    <Space size={100}>
                      <Button type="primary" htmlType="submit">
                        New Sprint
                      </Button>
                      <Button
                        onClick={() =>
                          this.exitModal("showAutoUpdateSprintModal")
                        }
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Modal for create a new sprint */}
        <Modal
          show={this.state.showCreateSprintModal}
          handleCancel={() => {
            this.exitModal("showCreateSprintModal");
          }}
          showOk={false}
          showCancel={false}
          title={"Create a new sprint"}
        >
          <div>
            <Row
              type={"flex"}
              justify={"center"}
              align={"top"}
              style={{ width: 600 }}
            >
              <Col span={24}>
                <Form
                  onFinish={this.handleAddSprint}
                  // onFinishFailed={this.onFinishFailed}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 12 }}
                  name="nest-messages"
                  style={{ margin: 10 }}
                >
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true }]}
                  >
                    <Select
                      style={{ "min-width": "100px" }}
                      // onChange={(e) => this.changeUpdateSprintType(e)}
                    >
                      <Select.Option value="weekly">weekly</Select.Option>
                      <Select.Option value="monthly">monthly</Select.Option>
                      <Select.Option value="daily">daily</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="sprint"
                    label="Sprint"
                    rules={[{ type: "number", min: 1, required: true }]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    label="Date Range"
                    name="date"
                    rules={[{ required: true }]}
                  >
                    <RangePicker />
                  </Form.Item>
                  {/* <Form.Item label="Date Range" name="date" >
                      <RangePicker defaultValue={
                        this.props.sprintObj==={}?[moment(this.props.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'), moment(this.props.sprintObj.endTime, 'YYYY-MM-DD').add(7,'days')]:[moment(), moment().add(7,'days')]} />
                  </Form.Item> */}
                  <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
                    <Space size={100}>
                      <Button type="primary" htmlType="submit">
                        New Sprint
                      </Button>
                      <Button
                        onClick={() => this.exitModal("showCreateSprintModal")}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal>
      </Layout>
    );
  }
}
export default WriteReport;