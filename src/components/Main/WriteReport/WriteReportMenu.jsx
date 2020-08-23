import React from "react";
import { Component } from "react";
import {
    Button,
    Menu,
    Divider,
    Empty
  } from "antd";
  import {
    TeamOutlined,
    FileTextOutlined,
    FileImageOutlined,
    FieldBinaryOutlined,
    UploadOutlined,
    MailOutlined,
    FileDoneOutlined,
    SaveOutlined
  } from "@ant-design/icons";
  import PhotoDragger from "./PhotoDragger";
  import "antd/dist/antd.css";

const { SubMenu } = Menu;

class WriteReportMenu extends Component {
    state={

    }

    handleClick = e => {
      console.log('click ', e);
      this.setState({ current: e.key });
    };

    render() {
        return (
          <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          triggerSubMenuAction="click"

        >
          {/* submenu for selecting team */}
          <SubMenu
            icon={<TeamOutlined />}
            // disabled={true}
            data-tut="tour_writeReport_selectTeam"
            title={
              !this.props.teamInfo ||
              Object.keys(this.props.teamInfo).length === 0
                ? "Select Your Team"
                : (this.props.isLeader ? "Leader of: " : "Member of: ") +
                  this.props.teamInfo.teamName
            }
          >
            {this.props.joinedTeams && this.props.joinedTeams.length > 0 ? (
              <Menu.ItemGroup title="Member of:">
                {this.props.joinedTeams.map((teamInfo, index) => {
                  return (
                    <Menu.Item
                      key={"joinedTeam" + index}
                      onClick={() => {
                        this.props.selectTeam(teamInfo, false);
                      }}
                    >
                      {teamInfo.teamName + " (" + teamInfo.leadEmail + ")"}
                    </Menu.Item>
                  );
                })}
              </Menu.ItemGroup>
            ) : (
              <Menu.ItemGroup title="No team Joined"></Menu.ItemGroup>
            )}
            {this.props.createdTeams && this.props.createdTeams.length > 0 ? (
              <Menu.ItemGroup title="Leader of:">
                {this.props.createdTeams.map((teamInfo, index) => {
                  return (
                    <Menu.Item
                      key={"createdTeam" + index}
                      onClick={() => {
                        this.props.selectTeam(teamInfo, true);
                      }}
                    >
                      {teamInfo.teamName + " (" + teamInfo.leadEmail + ")"}
                    </Menu.Item>
                  );
                })}
              </Menu.ItemGroup>
            ) : (
              <Menu.ItemGroup title="No team created"></Menu.ItemGroup>
            )}
            <Divider></Divider>
            {
              <Button
                className={"menu-btn"}
                type="primary"
                onClick={() => this.props.changeTab("Team Management")}
              >
                Create/Join a team
              </Button>
            }
          </SubMenu>

          {/* Select a type and sprint within a team */}
          <SubMenu
            disabled={!this.props.teamInfo}
            icon={<FieldBinaryOutlined />}
            title={
              !this.props.sprintObj || !this.props.sprintObj.sprint
                ? "Select a Sprint"
                : "Sprint: " +
                  this.props.sprintObj.type +
                  " " +
                  this.props.sprintObj.sprint
            }
            // onTitleClick={() => {
            //   if (!this.state.typeToSprints || Array.from(this.state.typeToSprints.keys()).length === 0) {
            //     message.error("No current sprint available, please contact the team leader!");
            //   }
            // }}
          >
            {" "}
            {!this.props.typeToSprints ||
            Array.from(this.props.typeToSprints.keys()).length === 0 ? (
              <Menu.Item>No sprint, add one or contact team leader</Menu.Item>
            ) : (
              Array.from(this.props.typeToSprints.keys()).map(
                (type, index) => {
                  return (
                    <Menu.ItemGroup title={type} key={"type" + type}>
                      {this.props.typeToSprints
                        .get(type)
                        .map((sprintObj, index) => {
                          return (
                            <Menu.Item
                              key={"sprint" + type + index}
                              onClick={() =>
                                this.props.changeSprint(sprintObj, type)
                              }
                            >
                              {sprintObj.sprint +
                                " (" +
                                sprintObj.beginTime +
                                " - " +
                                sprintObj.endTime +
                                ")"}
                            </Menu.Item>
                          );
                        })}
                    </Menu.ItemGroup>
                  );
                }
              )
            )}
            <Divider></Divider>
            <Button className={"menu-btn"}
              type="primary"
              onClick={() => this.props.showModal("showCreateSprintModal")}
            >
              Create a Sprint
            </Button>
          </SubMenu>
          {/* for template select within a team */}
          <SubMenu
            disabled={
              !this.props.teamInfo ||
              !this.props.teamInfo.id ||
              !this.props.sprintObj.sprint
            }
            icon={<FileTextOutlined />}
            title={"Template"}
          >
            <Menu.ItemGroup>
              {/* search templates */}
              {/* <Menu.Item>
                <Search
                  placeholder="search templates"
                  onSearch={(value) => this.searchTemplates(value)}
                  style={{ width: 200 }}
                />
              </Menu.Item> */}
              {this.props.templates && this.props.templates.length > 0 ? (this.props.templates.map((template, index) => {
                return (
                  <Menu.Item
                    key={"template" + index}
                    onClick={() => {
                      this.props.selectTemplate(template);
                    }}
                  >
                    {template.theme}
                  </Menu.Item>
                );
              })):<Empty image="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg"
              description="No template"></Empty>}
              {/* <Pagination size="small" defaultCurrent={1} total={2} pageSize={1}  pageSizeOptions={2}/> */}
            </Menu.ItemGroup>
            <Divider></Divider>
            <Button
                className={"menu-btn"}
                disabled={
                  !this.props.teamInfo.id || !this.props.sprintObj.sprint
                }
                type="primary"
                onClick={() => this.props.showModal("showSubmitTemplateModal")}
            >
              Create a Template
            </Button>
          </SubMenu>

          {/* menu for insert photos */}

          {/* <SubMenu
            disabled={!this.props.teamInfo.id || !this.props.sprintObj.sprint}
            icon={<FileImageOutlined />}
            triggerSubMenuAction="click"
            title="Insert Image"
          >
            <Menu.Item style={{"height": "100%"}}>
              <PhotoDragger
                  style={{"margin-right": "20px", "margin-left": "20px"}}
                  teamId={this.props.teamInfo.id}
                  insertPhotoUrl={this.props.insertPhotoUrl}
              />
            </Menu.Item>
          </SubMenu> */}

          <Menu.Item style={{ float: "right" }} disabled={true}>
            <Button
              type="primary"
              shape="round"
              icon={<UploadOutlined />}
              disabled={
                !this.props.teamInfo.id || !this.props.sprintObj.sprint
              }
              onClick={() => this.props.showModal("showSubmitReportModal")}
            >
              Submit
            </Button>
          </Menu.Item>

          {/* <Menu.Item style={{ float: "right" }} disabled={true}>
            <Button
              shape="round"
              icon={<SaveOutlined />}
              disabled={
                !this.props.teamInfo.id || !this.props.sprintObj.sprint
              }
              onClick={() => {
                this.props.saveDraft(this.props.content);
                const successTitle = "Draft saved to: " + this.props.teamInfo.teamName + " (" + this.props.sprintObj.type+"-"+this.props.sprintObj.sprint+")";
                const successDesc = "Please note the deadline of this sprint is "+this.props.sprintObj.endTime+", so you can update your report at any time before this deadline!";
                const callbackPage = "Write Report";
                this.props.successTab(successTitle, successDesc,callbackPage);
              }}
            >
              Save Draft
            </Button>
          </Menu.Item> */}

          {/* ************************ */}
          {/* if get permission in the future, send email can be used */}
          <Menu.Item style={{ float: "right" }} disabled={true}>
            <Button
              disabled={
                !this.props.teamInfo.id || !this.props.sprintObj.sprint
              }
              shape="round"
              icon={<MailOutlined />}
              data-tut="tour_writeReport_email"
              onClick={() => this.props.showModal("showSendEmailModal")}
            >
              Email
            </Button>
          </Menu.Item>

          {/* <Menu.Item disabled={true} style={{ float: "right" }}>
            <Button
            disabled={!this.props.teamInfo.id || !this.props.sprintObj.sprint}
              icon = {<MailOutlined/>}
              shape="round"
              type={this.state.contentCopied ? "primary" : ""}
              onClick={() => {
                navigator.clipboard.writeText(this.state.content);
                this.setState({ contentCopied: true });
                message.warn("Due to no permission, we copied the reports for you, please paste into your own email");
              }}
            >
              {this.state.contentCopied ? "Markdown Copied" : "Send Email"}
            </Button>
          </Menu.Item> */}

          {/* <Menu.Item disabled={true} style={{ float: "right" }}>
            <Button
              disabled={
                !this.props.teamInfo.id || !this.props.sprintObj.sprint
              }
              shape="round"
              icon={<FileDoneOutlined />}
              onClick={this.props.onShowReportsInThePastClicked}
            >
              History
            </Button>
          </Menu.Item> */}
        </Menu>
        )
    }
}

export default WriteReportMenu;