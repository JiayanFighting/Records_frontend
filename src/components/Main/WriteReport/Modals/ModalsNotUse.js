{/* modal for select role*/}

    //some selections when entering write report
    // showRoleSelectModal: false,
    // showTeamSelectModal: this.props.teamName, //show team and sprint selection at first
    // showSprintSelectModal: this.props.teamName && this.props.sprintObj, // change to teamName, add a request
    // showTemplateSelectModal: this.props.teamName && this.props.sprintObj,
    
<Modal
show={this.state.showRoleSelectModal}
handleCancel={() => this.exitModal("showRoleSelectModal")}
handleOk={() => this.exitModal("showRoleSelectModal")}
okMessage={"Confirm Submit"}
showOk={false}
showCancel={false}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Write report as a Team Lead or a Team Member?"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "20px" }}
  data-tut="tour_team_join_info"
>
  <Col style={{margin:"10px",padding:"auto"}}>
    <Button
    type="primary"
    size = "large"
      onClick={() => {
        this.setState({ isLeader: true});
        if (this.state.createdTeams && this.state.createdTeams.length>0) this.showModal("showTeamSelectModal");
        else {
          message.error("Please create a team first");
        }
        this.exitModal("showRoleSelectModal");
      }}
    >
      I'm a Team Leader
    </Button>
  </Col>
  <Col style={{margin:"10px" ,padding:"auto"}}>
    <Button
    type="primary"
    size = "large"
      onClick={() => {
        this.setState({ isLeader: false });
        if (this.state.joinedTeams && this.state.joinedTeams.length>0) this.showModal("showTeamSelectModal");
        else {
          message.error("Please join a team first");
        }
        this.exitModal("showRoleSelectModal");
      }}
    >
      I'm a Team Member
    </Button>
  </Col>
</Row>
</Modal>

{/* modal for select team*/}
<Modal
show={this.state.showTeamSelectModal}
handleCancel={() => this.exitModal("showTeamSelectModal")}
handleOk={() => this.exitModal("showTeamSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Select a Team"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "20px" }}
  data-tut="tour_team_join_info"
>
  {this.state.isLeader
    ? this.showTeams("created", this.state.createdTeams)
    : this.showTeams("joined", this.state.joinedTeams)}
</Row>
</Modal>

{/* modal for select sprint*/}
<Modal
show={this.state.showSprintSelectModal}
handleCancel={() => this.exitModal("showSprintSelectModal")}
handleOk={() => this.exitModal("showSprintSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Select a Sprint"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "12px" }}
  data-tut="tour_team_join_info"
>
  {this.showSprints()}
</Row>
</Modal>

{/* Modal for select template */}
<Modal
show={this.state.showTemplateSelectModal}
handleCancel={() => this.exitModal("showTemplateSelectModal")}
handleOk={() => this.exitModal("showTemplateSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Want to use a template in your group?"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "12px" }}
  data-tut="tour_team_join_info"
>
  {this.showTemplates()}
</Row>
</Modal>



  //show templates
  showTemplates = () => {
    return [
      <div>
        <Search
          placeholder="search templates"
          onSearch={(value) => this.searchTemplates(value)}
          style={{ width: 200 }}
        />
        <List
          grid={{
            gutter: 16,
          }}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            size: "small",
          }}
          dataSource={this.state.templates}
          renderItem={(template) => (
            <List.Item>
              <Card
                title={template.theme}
                hoverable={true}
                size="small"
                onClick={() => {
                  this.selectTemplate(template);
                  this.exitModal("showTemplateSelectModal");
                }}
              >
                <Avatar
                  shape="square"
                  size={64}
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <UserOutlined style={{ width: 20 }} />
                </Avatar>
              </Card>
            </List.Item>
          )}
        />
      </div>,
    ];
  };

  //show sprints witnin a team
  showSprints = () => {
    if (!this.state.typeToSprints || this.state.typeToSprints.length === 0) {
      return;
    }
    return (
      <div>
        {Array.from(this.state.typeToSprints.keys()).map((type, index) => {
          return (
            <div>
              <Row
                type={"flex"}
                justify={"center"}
                align={"top"}
                style={{ padding: "8px" }}
              >
                {type}
              </Row>
              <Row
                type={"flex"}
                justify={"center"}
                align={"top"}
                style={{ padding: "12px" }}
                data-tut="tour_team_join_info"
              >
                <List
                  grid={{
                    gutter: 16,
                  }}
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 4,
                    size: "small",
                  }}
                  dataSource={this.state.typeToSprints.get(type)}
                  renderItem={(sprintObj) => (
                    <List.Item>
                      <Card
                        title={sprintObj.sprint}
                        hoverable={true}
                        size="small"
                        onClick={() => {
                          this.changeSprint(sprintObj, type);
                          this.exitModal("showSprintSelectModal");
                          if (
                            this.state.templates &&
                            this.state.templates.length > 0 &&
                            !this.state.gotIntegratedContent
                          )
                            this.showModal("showTemplateSelectModal");
                        }}
                      >
                        {sprintObj.endTime}
                      </Card>
                    </List.Item>
                  )}
                />
              </Row>
            </div>
          );
        })}


        {/* menu */}
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
                  : (this.state.isLeader ? "Leader of: " : "Member of: ") +
                    this.props.teamInfo.teamName
              }
            >
              {this.state.joinedTeams && this.state.joinedTeams.length > 0 ? (
                <Menu.ItemGroup title="Member of:">
                  {this.state.joinedTeams.map((teamInfo, index) => {
                    return (
                      <Menu.Item
                        key={"joinedTeam" + index}
                        onClick={() => {
                          this.selectTeam(teamInfo, false);
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
              {this.state.createdTeams && this.state.createdTeams.length > 0 ? (
                <Menu.ItemGroup title="Leader of:">
                  {this.state.createdTeams.map((teamInfo, index) => {
                    return (
                      <Menu.Item
                        key={"createdTeam" + index}
                        onClick={() => {
                          this.selectTeam(teamInfo, true);
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
              {(!this.joinedTeams || this.joinedTeams.length === 0) &&
              (!this.createdList || this.createdTeams.length === 0) ? (
                <Button
                  className={"menu-btn"}
                  type="primary"
                  onClick={() => this.props.changeTab("Team Management")}
                >
                  Create/Join a team
                </Button>
              ) : (
                <div></div>
              )}
            </SubMenu>

            {/* Select a type and sprint within a team */}
            <SubMenu
              disabled={!this.props.teamInfo}
              icon={<FieldBinaryOutlined />}
              data-tut="tour_writeReport_selectSprint"
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
              {!this.state.typeToSprints ||
              Array.from(this.state.typeToSprints.keys()).length === 0 ? (
                <Menu.Item>No sprint, add one or contact team leader</Menu.Item>
              ) : (
                Array.from(this.state.typeToSprints.keys()).map(
                  (type, index) => {
                    return (
                      <Menu.ItemGroup title={type} key={"type" + type}>
                        {this.state.typeToSprints
                          .get(type)
                          .map((sprintObj, index) => {
                            return (
                              <Menu.Item
                                key={"sprint" + type + index}
                                onClick={() =>
                                  this.changeSprint(sprintObj, type)
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
                onClick={() => this.setState({ showCreateSprintModal: true })}
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
              data-tut="tour_writeReport_selectTemplate"
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
                {this.state.templates && this.state.templates.length > 0 ? (this.state.templates.map((template, index) => {
                  return (
                    <Menu.Item
                      key={"template" + index}
                      onClick={() => {
                        this.selectTemplate(template);
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
                  onClick={() => this.showModal("showSubmitTemplateModal")}
              >
                Create a Template
              </Button>
            </SubMenu>

            {/* menu for insert photos */}

            <SubMenu
              disabled={!this.props.teamInfo.id || !this.props.sprintObj.sprint}
              icon={<FileImageOutlined />}
              triggerSubMenuAction="click"
              title="Insert Image"
              data-tut="tour_writeReport_insertImage"
            >
              <Menu.Item style={{"height": "100%"}}>
                <PhotoDragger
                    style={{"margin-right": "20px", "margin-left": "20px"}}
                    teamId={this.props.teamInfo.id}
                    insertPhotoUrl={this.insertPhotoUrl}
                />
              </Menu.Item>
            </SubMenu>

            <Menu.Item style={{ float: "right" }} disabled={true}>
              <Button
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                data-tut="tour_writeReport_submit"
                disabled={
                  !this.props.teamInfo.id || !this.props.sprintObj.sprint
                }
                onClick={() => this.showModal("showSubmitReportModal")}
              >
                Submit
              </Button>
            </Menu.Item>

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
                onClick={() => this.showModal("showSendEmailModal")}
              >
                Send
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

            <Menu.Item disabled={true} style={{ float: "right" }}>
              <Button
                disabled={
                  !this.props.teamInfo.id || !this.props.sprintObj.sprint
                }
                shape="round"
                icon={<FileDoneOutlined />}
                onClick={this.onShowReportsInThePastClicked}
              >
                History Reports
              </Button>
            </Menu.Item>
          </Menu>
      </div>
    );
  };

  /**
   * display teams as cards list
   * @method showTeams
   * @param type: created team or joined team
   * @param teams: all teams information
   * @for TeamManagement
   * @return none
   */
  showTeams = (type, teams) => {
    return [
      <div>
        <List
          grid={{
            gutter: 16,
          }}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            size: "small",
          }}
          dataSource={teams}
          renderItem={(teamInfo) => (
            <List.Item>
              <Card
                title={teamInfo.teamName}
                hoverable={true}
                size="small"
                onClick={() => {
                  this.selectTeam(teamInfo, this.state.isLeader);
                  this.exitModal("showTeamSelectModal");
                  // if (this.state.typeToSprints && Array.from(this.state.typeToSprints.keys()).length > 0) this.showModal("showSprintSelectModal");
                  // else {
                  //   message.error("Sorry but there is no sprint in this team");
                  // }
                }}
              >
                <Avatar
                  shape="square"
                  size={64}
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <UserOutlined style={{ width: 20 }} />
                </Avatar>
              </Card>
            </List.Item>
          )}
        />
      </div>,
    ];
  };
}
