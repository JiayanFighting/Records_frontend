import React, {Component} from "react";
import 'antd/dist/antd.css';
import {Input, Button, Avatar, Card, List, Col, Row, Popover, Typography, Spin, Layout, Popconfirm} from 'antd';
import { UserOutlined} from '@ant-design/icons';
import {getReportData, sendEmailService, getPeopleToRemindService} from '../../../services/reportService';
import {getCreatedTeamsService} from '../../../services/teamService';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import Modal from "../HelperComponents/Modal";
import ReportData from "./ReportData";
import moment from 'moment';
import {showError, showSuccess} from "../../../services/notificationService";
import {NOTIFICATION_OPERATION, ROOT} from "../../../constants";
import {sendMessage} from "../../../services/messageService";
import ViewBoard from "../WriteReport/ViewBoard";
import marked from "marked";

const { TextArea } = Input;
const { Meta } = Card;
const { Paragraph } = Typography;
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    return `<a target="_blank" href="${href}">${text}` + "</a>";
};
class ReportManagement extends Component {
    state = {
        data: [],
        showSendEmailModal: false,
        showIntegrateOption: false,
        recipients: [],
        peopleToRemind: [],
        from: this.props.userInfo.email,
        subject: "",
        content: "",
        createdTeams: [],
        createdTeamsMap: {},
        showSelection: false,
        selectedContent: [],
        sendingMessage: false,
        contentWithTitle: "",
        contentWithoutTitle: "",
    };

    componentWillMount() {
        this.initReportMgt();
    }

    initReportMgt = () => {
        let startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        endDate = endDate + ' 23:59:59';
        var params = {
            type: undefined, // opt
            userEmail: undefined, // opt
            toEmail: this.props.userInfo.email, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10 //  opt ,default 10
        };

        this.getReportDataWithKeys(params);

        this.getPeopleToRemind(params);
        getCreatedTeamsService(false).then((res) => {

            let teamNames = [];
            let createdTeamMap = {};
            for (let i = 0; i < res.createdList.length; i++) {
                teamNames.push({value: res.createdList[i].teamName});
                createdTeamMap[res.createdList[i].teamName] = res.createdList[i].id;
            }
            this.setState({createdTeams: teamNames, createdTeamMap: createdTeamMap});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show teams you created");
            }
        });
        this.setState({
            data: [],
            showSendEmailModal: false,
            showIntegrateOption: false,
            recipients: [],
            peopleToRemind: [],
            from: this.props.userInfo.email,
            subject: "",
            content: "",
            createdTeams: [],
            createdTeamsMap: {},
            showSelection: false,
            selectedContent: [],
            contentWithTitle:"",
            contentWithoutTitle:"",
        })
    };

    setContent = (e) => {
        let value = e.target.value;
        this.setState({content: value})
    };

    onSearchReports = values => {
        let startDate = values.date === undefined ? moment().subtract(7, 'days').format('YYYY-MM-DD') : values.date[0].format('YYYY-MM-DD');
        let endDate = values.date === undefined ? moment().format('YYYY-MM-DD') : values.date[1].format('YYYY-MM-DD');
        endDate = endDate + ' 23:59:59';
        let teamId = this.state.createdTeamMap[values.teamname];
        var params = {
            teamId: teamId === undefined ? values.teamname : teamId,
            type: values.type, // opt
            userEmail: values.fromEmail, // opt
            toEmail: this.props.userInfo.email, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10, //  opt ,default 10
            sprint: values.sprint
        };
        console.log("get reoirt",params);

        this.getReportDataWithKeys(params);
        this.getPeopleToRemind(params);
        this.setState({selectedContent: [], showSelection: true})
    };

    getReportDataWithKeys = (params) => {
        getReportData(false, params).then((res) => {
            let data = [];
            for (let i = 0; i < res.list.length; i++) {
                let cur = res.list[i];
                cur.key = i;
                data.push(cur)
            }
            console.log("reports data: ");
            console.log(data);
            this.setState({data: data});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get reports");
            }
        });
    };

    getPeopleToRemind = (params) => {
        getPeopleToRemindService(false, params).then((res) => {
            let peopleToRemind = [];
            for (let i = 0; i < res.peopleToRemind.length; i++) {
                peopleToRemind.push({username: res.peopleToRemind[i].user.username, userEmail: res.peopleToRemind[i].user.email,avatar:res.peopleToRemind[i].user.avatar});
            }
            this.setState({peopleToRemind: peopleToRemind});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show your teammates who have not submitted their reports!");
            }

        })

    };

    sendRemindMessages = (emails) => {
        this.setState({sendingMessage: true})
        let peopleToRemind = emails;

        for (let i = 0; i < peopleToRemind.length; i++) {
            let body = {
                from_name: this.props.userInfo.username,
                operation: NOTIFICATION_OPERATION,
                from_email: this.props.userInfo.email,
                to_email: peopleToRemind[i].userEmail,
                content: "You haven't submitted your report. Please submit it as soon as possible!",
                data: JSON.stringify({})
            };
            sendMessage(body).then((res) => {
                if (i === peopleToRemind.length - 1) {
                    if(peopleToRemind.length === 1){
                        showSuccess("Successfully sent remind message");
                    }else{
                        showSuccess("Sent all remind messages");
                    }
                   
                    this.setState({sendingMessage: false})
                }
            }).catch((err) => {
                console.log(err);
                if (i === peopleToRemind.length - 1) {
                    this.setState({sendingMessage: false})
                }
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to send request");
                }
            });
        }
    };

    showPeopleToRemind = () => {

        let data = this.state.peopleToRemind;
        let spinning = this.state.sendingMessage;
        return (
            <div style={data.length === 0 ? {"display": "none"} : {}}>
                <h3>List of members who haven't submitted reports :</h3>
                <List
                    grid={{
                        gutter: 16,
                        column:5
                    }}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 5,
                        size:"small",
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card hoverable ={true} size ="small"
                                //   onClick= {()=>{this.sendRemindMessages([{username: item.username, userEmail: item.userEmail}])}}
                                >
                                {/* <Avatar shape="square" size={64} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                    <UserOutlined style={{width:20}}/>
                                </Avatar> */}
                                <Spin spinning={spinning}>
                                    <Popover content={<div><p>click here to remind this teammate</p></div>} >
                                    <Popconfirm 
                                    title={"Sure to send a reminder to "+item.username+" ?"} 
                                    onConfirm={()=>{this.sendRemindMessages([{username: item.username, userEmail: item.userEmail}])}}>
                                        <Meta
                                            // avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                                            avatar={item.avatar === undefined || item.avatar === null||item.avatar === "" || item.avatar.length === 0?
                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />:
                                                <Avatar src={ROOT+item.avatar} />}
                                            title={item.username}
                                            description={<Paragraph ellipsis={{ rows: 1}}>{item.userEmail}</Paragraph>}
                                        />
                                        </Popconfirm>
                                    </Popover>
                                </Spin>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    };

    handleCancel = () => {
        this.setState({showSendEmailModal: false, showIntegrateOption: false});
    };

    handleIntegrationOption = () => {
        let selectedContent = this.state.selectedContent;
        let concatenatedContentWithTitle = "";
        for (let i = 0; i < selectedContent.length; i++) {
            concatenatedContentWithTitle +=
                "## " +
                selectedContent[i].theme +
                "(" +
                selectedContent[i].fromName +
                ")\n";
            concatenatedContentWithTitle += selectedContent[i].content;
            concatenatedContentWithTitle += "\n";
        }
        let concatenatedContent = "";
        for (let i = 0; i < selectedContent.length; i++) {
            concatenatedContent += selectedContent[i].content;
            concatenatedContent += "\n";
        }
        this.setState({showIntegrateOption: true, contentWithTitle: concatenatedContentWithTitle, contentWithoutTitle: concatenatedContent});
    };

    integrate = (option) => {
       if (option === true)
            this.props.handleIntegrate(this.state.selectedContent,this.state.contentWithTitle);
       else
            this.props.handleIntegrate(this.state.selectedContent,this.state.contentWithoutTitle);
       this.setState({showSelection: false, IntegrateEnabled: false})
    };

    onRowSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedContent: selectedRows});
    };

    onReset = () => {
        this.initReportMgt();
    };

    render() {
        const { recipients, sendingMessage, data, createdTeams,createdTeamsMap, showSelection, selectedContent, peopleToRemind } = this.state;
        let IntegrateEnabled = selectedContent.length !== 0;
        let peopleToRemindEnabled = peopleToRemind.length !== 0
        const { userInfo } = this.props;
        return (
            <div>
                {/* <a onClick={this.onReset} >reset</a> */}
                <ReportData onSearchReports={this.onSearchReports}
                            teamData={createdTeams}
                            teamMapData={createdTeamsMap}
                            role={"Reporter"}
                            roleName={"fromEmail"}
                            data={data}
                            onRowSelectionChange={this.onRowSelectionChange}
                            showSelection={true}
                            userEmail={this.props.userInfo.email}
                            handleUpdate={this.props.handleUpdate}
                            IntegrateEnabled={IntegrateEnabled}
                            handleIntegrationOption={this.handleIntegrationOption}
                            initReportMgt={this.initReportMgt}
                />
                <div>
                    <Row  type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'}}>
                        <Col span={21} >
                            {this.showPeopleToRemind()}
                        </Col>
                    </Row>
                    <Row style={{"margin-bottom":10}}>
                        {/* <Col span={12}> */}
                        <Col span={24}>
                            <Popconfirm 
                                title={"Sure to remind all ?"} 
                                onConfirm={()=>{this.sendRemindMessages(peopleToRemind)}}>
                            <Button type={"primary"}
                                    // onClick={() => {this.sendRemindMessages(peopleToRemind)}}
                                    data-tut="tour_reportManagement_remind"
                                    disabled={!peopleToRemindEnabled}
                            >
                                Remind All
                            </Button>
                            </Popconfirm>
                        </Col>
                        {/* <Col span={12}>
                            <Button type={"primary"} disabled={!IntegrateEnabled} onClick={this.handleIntegrationOption} data-tut="tour_reportManagement_aggregate">Aggregate</Button>
                        </Col> */}
                    </Row>
                </div>
                <Modal
                    show={this.state.showIntegrateOption}
                    handleCancel={this.handleCancel}
                    handleOk={async () => {
                        await this.props.setTeamInfo({});
                        await this.props.setSprintObj({});
                        this.integrate(true);
                    }}
                    handleClickMid={async () => {
                        await this.props.setTeamInfo({});
                        await this.props.setSprintObj({});
                        this.integrate(false);
                    }}
                    title={"Including title when aggregating reports ?"}
                    showMidButton={true}
                    showCancel={false}
                    okMessage={"With Title"}
                    midMessage={"Without Title"}
                    okBtnType={""}
                >
                    <Row type={"flex"} justify={"center"} align={"top"} style={{ padding: "12px" }}>
                        <div className="site-card-wrapper">
                            <Row style={{ width: "80vw" }}>
                                <Col span={12}>
                                    <Card
                                        title={"Without Title"}
                                        bordered={false}
                                    >
                                    <div
                                        className="preview"
                                        style={{"text-align": "left",height:"60vh",overflow:"scroll", width: "100%"}}
                                        dangerouslySetInnerHTML={{
                                            __html: marked(this.state.contentWithoutTitle, {
                                                renderer: renderer,
                                                breaks: true,
                                                gfm: true,
                                            }),
                                        }}
                                    >
                                    </div>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card
                                        title={"With Title"}
                                        bordered={false}
                                    >
                                        <div
                                            className="preview"
                                            style={{"text-align": "left",height:"60vh",overflow:"scroll", width: "100%"}}
                                            dangerouslySetInnerHTML={{
                                                __html: marked(this.state.contentWithTitle, {
                                                    renderer: renderer,
                                                    breaks: true,
                                                    gfm: true,
                                                }),
                                            }}
                                        >
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default ReportManagement;