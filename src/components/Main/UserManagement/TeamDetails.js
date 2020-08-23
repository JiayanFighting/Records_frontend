import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Tabs,Card, Col, Row, Button, List, Form,Space, Table,Avatar,Popover,Typography,Tooltip,Tag,message} from "antd";
import {AlignLeftOutlined,BulbOutlined,TeamOutlined,OrderedListOutlined,DoubleLeftOutlined,CloseCircleOutlined,ExclamationCircleOutlined,UserOutlined,QuestionCircleOutlined,DeleteOutlined,EditOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import moment from 'moment';
import marked from "marked";
import SprintPage from './SprintPage';
import {getMembersService} from '../../../services/teamService';
import { getTemplatesInTeamService } from '../../../services/templateService';
import { getSprintListService} from '../../../services/sprintService'
import {leaveTeamService} from '../../../services/teamService';
import {showError} from "../../../services/notificationService";
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import 'antd/dist/antd.css';
import Text from 'antd/lib/typography/Text';
import Modal from '../HelperComponents/Modal'
import { ROOT } from '../../../constants';

//markdown to html
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + "</a>";
};
const { TabPane } = Tabs;
const { Meta } = Card;
const { Paragraph } = Typography;
class TeamDetails extends Component {

    state={
        sprints:[],
        members:[],
        templates:[],
        showLeaveConfirm:false,
        columns:[
            {
              title: 'Sprint',
              dataIndex: 'sprint',
              key: 'sprint',
              editable: true,
              defaultSortOrder: 'descend',
              sorter: (a, b) => a.sprint - b.sprint,
              filters: [
                { text: 'Current', value: 'current' },
                { text: 'Later', value: 'later' },
                { text: 'Expired', value: 'expired' },
              ],
              onFilter: (value, record) => this.sprintFilter(value,record),
              render: (text, record) => {
                const tag = this.getSprintTag(record);
                return (
                    <span>
                        <Tag color={tag.color}>{tag.text}</Tag>
                        {text}
                    </span>
                ) 
              },
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                editable: true,
                filters: [
                    { text: 'Weekly', value: 'weekly' },
                    { text: 'Monthly', value: 'monthly' },
                    { text: 'Daily', value: 'daily' },
                  ],
                onFilter: (value, record) => record.type.includes(value),
            },
            {
              title: 'Start',
              dataIndex: 'beginTime',
              key: 'beginTime',
              editable: true,
              sorter: (a, b) => Date.parse(new Date(a.beginTime)) - Date.parse(new Date(b.beginTime)),
            },
            {
                title: 'End',
                dataIndex: 'endTime',
                key: 'endTime',
                editable: true,
                sorter: (a, b) => Date.parse(new Date(a.endTime)) - Date.parse(new Date(b.endTime)),
            },
        ],
    };

    /**
     * Initialization data, including sprints, members and templates
     */
    componentDidMount(){
        let id = this.props.teamInfo.id;
        getMembersService(id).then((res) => {
            if(res.code === 0){
                this.setState({members:res.members});
            }else{
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team members");
            }
        });
        getSprintListService(id).then((res) => {
            this.setState({
                sprints:res.list
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team sprints");
            }
        });
        getTemplatesInTeamService(id).then((res) => {
            this.setState({
                templates:res.templates
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team templates");
            }
        });
    }

    /**
     * exit the team information page,back to the team management page
     * @method exitInfoPage
     * @for JoinedTeamInfo
     * @return none
     */
    exitInfoPage=()=>{
        this.props.exitInfoPage();
    };

    /**
     * show the remove member confirm modal
     * @method removeTeamMember
     * @for JoinedTeamInfo
     * @return none
     */
    removeTeamMember=()=>{
        this.setState({showLeaveConfirm:true})
    };

    /**
     * handle leave from the team
     * @method handleLeave
     * @for JoinedTeamInfo
     * @return none
     */
    handleLeave = () => {
        leaveTeamService(this.props.teamInfo.id).then((res) => {
        //    this.props.updateJoinedTeams();
        this.props.updateLeaveTeam();
           message.success("Successfully left!")
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to remove!");
            }
        });
        this.setState({showLeaveConfirm: false});
        this.props.exitInfoPage()
    };

    /**
     * close the leave confirm modal
     * @method handleCancel
     * @for JoinedTeamInfo
     * @return none
     */
    handleCancel = () => {
        this.setState({showLeaveConfirm: false})
    };

    /**
     * show the remove member confirm modal
     * @method removeTeamMember
     * @for JoinedTeamInfo
     * @return none
     */
    removeTeamMember=()=>{
        this.setState({showLeaveConfirm:true})
    };
    /**
     * get the sprint tag through the date
     * @method getSprintTag
     * @param record: current sprint info
     * @for SprintPage
     * @return none
     */
    getSprintTag=(record)=>{
        let cur = moment().format('YYYY-MM-DD')
        let tag =[];
        if (cur >= record.beginTime && cur <= record.endTime) {
            tag.color = "blue";
            tag.text = "current";
        }else if (cur <= record.beginTime) {
            tag.color = "green";
            tag.text = "later";
        }else{
            tag.color = "gray";
            tag.text = "expired";
        }
        return tag;
    };

    /**
     * exit the info page, back to team management page
     * @method exitInfoPage
     * @for CreatedTeamInfo
     * @return none
     */
    exitInfoPage=()=>{
        this.props.exitInfoPage();
    };

    render() {
        return (
            <div className="card-container" style={{"padding" : "10px"}}>
                <div style={{textAlign:"left"}}>
                    <a onClick={()=>this.exitInfoPage()}> <DoubleLeftOutlined/> Back </a>
                </div>         
                <Tabs defaultActiveKey="1" animated="false" tabPosition="top">
                    <TabPane key="1" tab={<span><AlignLeftOutlined />Information</span>}>
                    <div>
                        <Row type={"flex"} justify={"center"} align={"top"}>
                            <Col span={24}>
                                <Form 
                                labelCol={ {span: 8} }
                                wrapperCol={ {span: 8} }>
                                    <Form.Item name={['team', 'Name']} label="Team's name">
                                            {this.props.teamInfo.teamName}
                                    </Form.Item>
                                    <Form.Item name={['team', 'Leader']} label="Leader's email">
                                            {this.props.teamInfo.leadEmail}
                                    </Form.Item>
                                    <Form.Item name={['team', 'Description']} label="Description">
                                        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                            {this.props.teamInfo.teamDesc}
                                        </Paragraph>
                                    </Form.Item>
                                    {/* <Form.Item name={['team', 'Email']} label={
                                        <span>
                                            Supervisor's email&nbsp;
                                            <Tooltip title="The email to receive team's integrated report">
                                            <QuestionCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    } rules={[{ type: 'email' }]}>
                                            {this.props.teamInfo.teamEmail}
                                    </Form.Item>
                                    <Form.Item name={['team', 'CcList']} label="Cc list">
                                        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                            {this.props.teamInfo.ccList}
                                        </Paragraph>
                                    </Form.Item> */}
                                </Form>
                            </Col>
                        </Row>
                        <Space size={100}>
                            <Button type="primary" danger htmlType="submit" onClick={this.removeTeamMember}>
                                <CloseCircleOutlined/>
                                Leave
                            </Button>
                            
                        </Space>

                        {/* Confirm to leave from the team  modal */}

                        <div>
                            <Modal show={this.state.showLeaveConfirm}
                                handleOk={this.handleLeave}
                                handleCancel={this.handleCancel}
                                okMessage={"Yes,I'm sure!"}
                                cancelMessage={"Cancel"}
                                okBtnType="danger"
                                title="Leave From The Team"
                            >
                            <Row type={"flex"} justify={"center"} align={"top"}>
                                <div>
                                <ExclamationCircleOutlined style={{fontSize:20,color:"red"}}/>
                                <Text strong>
                                    Are you sure you want to leave this team?
                                </Text>
                                </div>
                                </Row>
                            </Modal>
                    </div>
                    </div>
                    </TabPane>
                    <TabPane tab={<span><OrderedListOutlined />Sprints</span>} key="2">
                        {/* <Table
                        bordered
                        dataSource={this.state.sprints}
                        columns={this.state.columns}
                        rowClassName="editable-row"
                        pagination={{
                        onChange: this.cancel,
                        pageSize:5,
                        }}
                        /> */}
                        <SprintPage 
                        teamId={this.props.teamInfo.id} 
                        sprints={this.state.sprints}
                        />
                    </TabPane>
                    <TabPane tab={<span><TeamOutlined />Members</span>} key="3">
                        <Row type={"flex"} justify={"center"} align={"top"}>
                            <Col span={24}>
                                <Col span={16} offset={4}>
                                    <List
                                        grid={{
                                            gutter: 16,
                                            column:3
                                        }}
                                        pagination={{
                                            pageSize: 9,
                                            size:"small",
                                        }}
                                        locale={{emptyText:"Your team doesn't have any members yet. Click the 'Add Member' button to expand your team!"}}
                                        dataSource={this.state.members}
                                        renderItem={item => (
                                            <List.Item>
                                                <Card hoverable ={true} size ="small">
                                                    <Popover content={<div><p>{item.email}</p></div>} title={item.username}>
                                                        <Meta
                                                        avatar={item.avatar === undefined || item.avatar === null||item.avatar === "" || item.avatar.length === 0?
                                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />:
                                                        <Avatar src={ROOT+item.avatar} />
                                                        }
                                                        title={item.username}
                                                        description={<Paragraph ellipsis={{ rows: 1}}>{item.email}</Paragraph>}
                                                        />
                                                    </Popover>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab={<span><BulbOutlined />Templates</span>} key="4">
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={this.state.templates}
                            pagination={{
                                pageSize: 4,
                                size:"small",
                            }}
                            renderItem={item => (
                            <List.Item>
                                <Row>
                                <Card title={item.theme} style={{width:"25vw"}}>
                                    <Tag color="blue">{item.type}</Tag>
                                    <div
                                        style={{ "textAlign": "left" ,height:250,background:"white",overflow:"scroll",padding:10,"marginTop":10}}
                                        dangerouslySetInnerHTML={{
                                        __html: marked(item.content, {
                                            renderer: renderer,
                                            breaks: true,
                                            gfm: true,
                                        }),
                                        }}
                                    />
                                </Card>
                                </Row>
                            </List.Item>
                            )}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default TeamDetails;