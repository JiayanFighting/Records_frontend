import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import { Card, Col, Row, Avatar, Button, Input, Form, Space,List,Layout,Typography,Table, Collapse ,Tooltip,Switch,Divider,Spin  } from "antd";
import { SearchOutlined ,PlusCircleOutlined,EditOutlined,TeamOutlined,BulbOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import Modal from '../HelperComponents/Modal'
import {getJoinedTeamsService,createTeamService,getCreatedTeamsService,getTeamInfoService,searchTeamsService,getMembersService,recommendedTeamService} from '../../../services/teamService';
import JoinedTeamInfo from './JoinedTeamInfo';
import CreatedTeamInfo from './CreatedTeamInfo'
import {showError, showSuccess} from "../../../services/notificationService";
import {sendMessage} from "../../../services/messageService";
import {JOIN_OPERATION} from "../../../constants";
import TeamDetails from './TeamDetails';

const { Paragraph } = Typography;
const { Search } = Input;
const {  Content } = Layout;
const { Text } = Typography;
const { Panel } = Collapse;
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: 'Email is not validate!',
        number: '${label} is not a validate number!',
        regexp: 'Cc list is not a validate list'
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};


class TeamManagement extends Component {

    state={
        infoPage:"",
        teamInfo:[],
        templates:[],
        sprints:[],
        joinedteams:[],
        createdteams:[],
        recommendedteams:[],
        showCreatePage:false,
        showSearchPage:false,
        members:[],
        searchTeams:[],
        refresh:false,
        showNewStyle:true,
        isLoadingJoined:false,
        isLoadingCreated:false,
        columns:[
            {
              title: 'Name',
              dataIndex: 'teamName',
              key: 'teamName',
            },
            {
              title: 'Description',
              dataIndex: 'teamDesc',
              key: 'teamDesc',
              ellipsis:true,
            },
            {
              title: 'Leader Email',
              dataIndex: 'leadEmail',
              key: 'leadEmail',
            },
            {
              title: 'Create Time',
              dataIndex: 'createTime',
              key: 'createTime',
            },
            {
              title: 'Action',
              key: 'action',
              render: (text, record, index) => (
                <Space size="middle">
                    {/* <Button type="primary" >Join</Button> */}
                    <a onClick={()=>{this.joinTeam(record,"search")}}>Join</a>
                </Space>
              ),
            },
          ],
        
    };

    componentDidMount(){
        this.updateJoinedTeams();
        this.updateCreatedTeams();
    }

    changeShowNewStyle=()=>{
        this.setState({
            showNewStyle:!this.state.showNewStyle,
        })
    }
    /**
     * get the latest information of teams user joined and update state
     * @method updateJoinedTeams
     * @for TeamManagement
     * @return None
     */
    updateJoinedTeams = () => {
        this.setState({isLoadingJoined:true});
        getJoinedTeamsService(false).then((res) => {
            this.setState({ joinedteams: res.joinedList,isLoadingJoined:false })
            if (res.joinedList.length === 0) {
                recommendedTeamService().then((res) => {
                    this.setState({
                        recommendedteams: res.list,
                    })
                })
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show teams you joined");
            }
        });
    };

    /**
     * update UI after leaving team
     * @method updateLeaveTeam
     * @for TeamManagement
     * @return None
     */
    updateLeaveTeam=()=>{
        // remove the left item from joined list
        let teamId = this.state.teamInfo.id;
        if (this.state.joinedteams!== null && this.state.joinedteams.length === 1) {
            recommendedTeamService().then((res) => {
                this.setState({
                    recommendedteams: res.list,
                })
            })
        }
        this.setState({
            joinedteams: this.state.joinedteams.filter(item => item.id !== teamId),
        })
    };

    /**
     * update UI after deleting team
     * @method updateDeletedTeam
     * @for TeamManagement
     * @return None
     */
    updateDeletedTeam=()=>{
        // remove the left item from joined list
        let teamId = this.state.teamInfo.id;
        this.setState({
            createdteams:this.state.createdteams.filter(item => item.id !== teamId),
        })
    };

    /**
     * creating team
     * @method updateCreatedTeams
     * @for TeamManagement
     * @return None
     */
    updateCreatedTeams=()=>{
        this.setState({isLoadingCreated:true});
        getCreatedTeamsService(false).then((res) => {
            this.setState({createdteams:res.createdList,isLoadingCreated:false})
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show teams you created!");
            }
        });
    };

    /**
     * get team members per team id
     * @method updateTeamMembers
     * @for TeamManagement
     * @return None
     */
    updateTeamMembers=()=>{
        getMembersService(this.state.teamInfo.id).then((res) => {
            this.setState({members:res.members})
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to update team members");
            }
        });
    };

    /**
     * get latest team info
     * @method updateTeamInfo
     * @for TeamManagement
     * @return none
     */
    updateTeamInfo=()=>{
        getTeamInfoService(false,this.state.teamInfo.id).then((res) => {
            this.setState({teamInfo:res.info});
            // update the created teams info
            this.state.createdteams.some((item,index) => {
                if(item.id === this.state.teamInfo.id){
                    this.state.createdteams.splice(index,1,this.state.teamInfo);
                    return true;
                }
            });
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to update team information");
            }
        });
    };

    /**
     * exit info page and reset info page content
     * @method exitInfoPage
     * @for TeamManagement
     * @return null
     */
    exitInfoPage=()=>{
        this.setState({infoPage:""});
    };

    /**
     * show create team modal
     * @method showCreateModal
     * @for TeamManagement
     * @return none
     */
    showCreateModal = () => {
        this.setState({showCreatePage: true});
    };

    /**
     * show modal for searching teams
     * @method showSearchPage
     * @for TeamManagement
     * @return none
     */
    showSearchPage = e =>{
        this.setState({searchTeams:[]});
        this.searchTeams("");
        this.setState({showSearchPage:true});
    };

    /**
     * search team per content
     * @method showSearchPage
     * @for TeamManagement
     * @param content: team name
     * @return none
     */
    searchTeams = (content)=>{
        searchTeamsService(false,content,this.props.userInfo.email).then((res) => {
            this.setState({searchTeams:res.list});
            // filter the team you created and you joined
            let filtered = [];
            res.list.forEach(item => {
                let flag = false;
                this.state.joinedteams.forEach(teamItem => {
                    if(teamItem.id === item.id) {
                        flag = true
                    }
                });
                if(flag === false) {
                    this.state.createdteams.forEach(teamItem => {
                        if(teamItem.id === item.id) {
                            flag = true
                        }
                    });
                }
                if(flag === false) {
                    filtered.push(item)
                }
            });
            this.setState({
                searchTeams:filtered,
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to search");
            }
        });
    };

    /**
     * close modal
     * @method exitSearchPage
     * @for TeamManagement
     * @return none
     */
    exitSearchPage = ()=>{
        this.setState({showSearchPage:false})
    };

    /**
     * send request to create team
     * @method createTeam
     * @param values: team information
     * @for TeamManagement
     * @return none
     */
    createTeam = values => {
        // check 
        let existTheName = false;
        this.state.createdteams.some((item) => {
            if(item.teamName === values.team.teamName){
                existTheName = true;
                return true;
            }
        });
        if(existTheName === true) {
            showError("You've created a team with the same name!");
            return;
        }
        createTeamService(values.team).then((res) => {
            // update createdTeams
            let newTeam = values.team;
            newTeam.id = res.id;
            newTeam.leadEmail = res.leadEmail;
            this.setState({
                createdteams: [...this.state.createdteams, newTeam],
            });
            showSuccess("Successfully! Go ahead and add members to your newly created team");
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to create");
            }
        });
        this.setState({showCreatePage:false})
    };

    /**
     * show team's information
     * @method showTeamInfo
     * @param type: team information type (created team or joined team)
     * @param item: current team
     * @for TeamManagement
     * @return none
     */
    showTeamInfo = (type,item) => {
        // get the members info
        this.setState({
            members:[],
            sprints:[],
            templates:[],
            teamInfo:item,
        });
        let id = item.id;
        if (type === "created"){
            this.setState({infoPage:"created"})

        }else if (type === "joined"){
            this.setState({ members:[this.props.userInfo]});
            getMembersService(id).then((res) => {
                if(res.code === 0){
                    if(res.members.length === 1 && res.members[0].email === this.props.userInfo.email){

                    }else{
                        this.setState({members:res.members});
                    }
                }else{
                    console.log(res)
                }
            }).catch((err) => {
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to get team information");
                }
            });
            this.setState({infoPage:"joined"})
        }
    };

    getFlowUrl=()=>{
        window.open(`https://preview.flow.microsoft.com/zh-cn/`, 'newwindow')
    }
    /**
     * send request to join team
     * @method joinTeam
     * @param record: table row
     * @for TeamManagement
     * @return none
     */
    joinTeam=(record,entrance)=>{
        let teamId = record.id;
        //get team's leader by id
        getTeamInfoService(false, teamId).then((res) => {
            let leadEmail = res.info.leadEmail;
            let body = {
                from_name: this.props.userInfo.username,
                operation: JOIN_OPERATION,
                from_email: this.props.userInfo.email,
                to_email: leadEmail,
                content: `I want to join in ${record.teamName} team!`,
                data: JSON.stringify({teamId: teamId, teamName: record.teamName})
            };
            //send a request to the leaders for joining in their team
            sendMessage(body).then((res) => {
                showSuccess("Request successfully sent!");
                this.setState({
                    searchTeams: this.state.searchTeams.filter(item => item.id !== teamId),
                    recommendedteams: this.state.recommendedteams.filter(item => item.id !== teamId),
                })
            }).catch((err) => {
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to send request");
                }
            });
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get TeamInfo");
            }
        });
    };

    /**
     * ok button for creating team modal to close the modal
     * @method handleOk
     * @for TeamManagement
     * @return none
     */
    handleOk = () => {
        this.setState({showCreatePage: false})
      };
    //TO DO: considering to merge these 2 functions as they are same
    /**
     * ok button for creating team modal to close the modal
     * @method handleCreateCancel
     * @for TeamManagement
     * @return none
     */
    handleCreateCancel = () => {
        this.setState({showCreatePage: false})
    };

    showRecommendedTeams=()=>{
        return [
            <div style={{textAlign:"left",width:"48vw"}}>
            <Text strong>The list of recommended teams:</Text>
            <List
                pagination={{
                    pageSize: 4,
                    size:"small",
                }}
                dataSource={this.state.recommendedteams}
                renderItem={item => (
                <List.Item
                actions={[<a key="list-loadmore-join" onClick={()=>{this.joinTeam(item,"recommend")}}>join</a>]}
                >
                    <List.Item.Meta
                    style={{"font-family": "Times New Roman, Times, serif"}}
                    avatar={
                        <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                            <TeamOutlined style={{width:20}}/>
                        </Avatar>
                    }
                    title={item.teamName+"  ( "+item.leadEmail+" )"}
                    description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                    {item.teamDesc}
                                </Paragraph>}
                    />
                </List.Item>
                )}
            />
        </div>
        ]
    }

    /**
     * display teams as cards list
     * @method showTeams
     * @param type: created team or joined team
     * @param teams: all teams information
     * @for TeamManagement
     * @return none
     */
    showTeams = (type,teams) => {
        const Header = type==="joined"?
        <Row justify="space-between">
            <Col span={12}>
                <Tooltip title="Below is a list of the teams you have joined. Click the team card to go to the details page">
                    <Text strong>The teams you joined:</Text>
                </Tooltip>
            </Col>
            <Col span={6}>
                <Button type="primary" icon={<SearchOutlined />} onClick={this.showSearchPage}
                data-tut="tour_team_join">
                    Join a Team
                </Button>
            </Col>
        </Row>:
        <Row justify="space-between">
            <Col span={12}>
                <Tooltip title="Below is a list of the teams you have created. Click the team card to manage the team information, including basic information, sprints, members and templates">
                    <Text strong>The teams you created:</Text>
                </Tooltip>
            </Col>
            <Col span={6}>
                <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.showCreateModal}
                data-tut="tour_team_create">
                        New Team
                </Button>
            </Col>
        </Row>;
        if(this.state.showNewStyle) {
            return [
                <div style={{textAlign:"left",width:"48vw"}}>
                <Spin tip="Loading..." spinning={type==="joined"?this.state.isLoadingJoined:this.state.isLoadingCreated}>
                <List
                    header={Header}
                    pagination={{
                        pageSize: 5,
                        size:"small",
                    }}
                    dataSource={teams}
                    locale={type==="joined"?{
                        emptyText:"You haven't joined any teams yet, we've recommended some to you(shown below), and you can also join by searching"}:
                    {emptyText:"You haven't created a team yet!"}}
                    renderItem={item => (
                    <List.Item
                    actions={type==="joined"?[
                        <a key="list-loadmore-more" onClick={()=>{this.showTeamInfo(type,item)}}>
                            more
                        </a>
                    ]:[
                        <a key="list-loadmore-more" onClick={()=>{this.showTeamInfo(type,item)}}>
                            {/* <EditOutlined /> */}
                            manage
                        </a>,
                    ]}
                    span={24}
                    >
                        <List.Item.Meta
                        style={{"font-family": "Times New Roman, Times, serif"}}
                        avatar={
                            <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                <TeamOutlined style={{width:20}}/>
                                </Avatar>
                        }
                        title={<a onClick={()=>{this.showTeamInfo(type,item)}}>{item.teamName}</a>}
                        description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                        {item.teamDesc}
                    </Paragraph>}
                        />
                    </List.Item>
                    )}
                />
                </Spin>
            </div>
            ]
        }
        return [
            <div>
                <List
                    grid={{
                        gutter: 16,
                    }}
                    pagination={{
                        pageSize: 5,
                        size:"small",
                    }}
                    dataSource={teams}
                    renderItem={item => (
                        <List.Item>
                            <Card title={item.teamName} hoverable ={true} size ="small"
                            onClick= {()=>{this.showTeamInfo(type,item)}}>
                                <Avatar shape="square" size={64} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                <TeamOutlined style={{width:20}}/>
                                </Avatar>
                            </Card>
                        </List.Item>
                    )}
                />
                
            </div>
        ];
    };

    /**
     * display teams as cards list
     * @method showTeams
     * @param infoPage: show created teams or joined teams
     * @for TeamManagement
     * @return none
     */
    showTeamInfoPage = (infoPage) => {
        if(infoPage === "joined"){
            return (
                <TeamDetails
                    teamInfo={this.state.teamInfo} 
                    members={this.state.members} 
                    userInfo={this.props.userInfo}  
                    exitInfoPage={this.exitInfoPage}
                    updateLeaveTeam={this.updateLeaveTeam}
                    onSessionExpired={this.props.onSessionExpired}
                />
            );
        }else if(infoPage === "created"){
            return (
                <CreatedTeamInfo
                    teamInfo={this.state.teamInfo}
                    exitInfoPage={this.exitInfoPage}  
                    updateDeletedTeam={this.updateDeletedTeam}
                    updateCreatedTeams={this.updateCreatedTeams}
                    updateTeamMembers={this.updateTeamMembers}
                    updateTeamInfo={this.updateTeamInfo}
                    onSessionExpired={this.props.onSessionExpired}
                    />
            );
        }
        
    };


    render() {
        const {infoPage,columns } = this.state;
        const ccPattern = "^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$";
        return (
            <Layout>
                
                {/* <Collapse>
                    <Panel header="This is panel header 1" key="1">
                    <p>{text}</p>
                    </Panel>
                </Collapse> */}

                <Content 
                    className="site-layout-background"
                    style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    }}
                >
                {this.showTeamInfoPage(infoPage)}
                <div style={infoPage ==="" ? {} : {'display': 'none'}}>
                    <div style={{textAlign:"left"}}>
                        <Text>Change Style:  </Text>
                        <Switch defaultChecked onChange={this.changeShowNewStyle}/>
                    </div>
                </div>
                <div style={this.state.showNewStyle&&infoPage ==="" ? {} : {'display': 'none'}}>
                <Row type={"flex"} justify={"center"} align={"top"}>
                    <Col span={12}>
                        <Row type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'} } data-tut="tour_team_join_info">
                            {this.showTeams("joined",this.state.joinedteams)}
                        </Row>

                        {this.state.joinedteams.length === 0 ? 
                            <Row type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'} } data-tut="tour_team_join_info">
                            {this.showRecommendedTeams()}
                            </Row>
                            :
                            <div/>
                        }
                    </Col>

                    <Col span={1}>
                    <Divider type="vertical" style={{height:"100vh"}}/>
                    </Col>
                    
                    <Col span={11}>
                        <Row type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'} } data-tut="tour_team_join_info">
                            {this.showTeams("created",this.state.createdteams)}
                        </Row>
                    </Col>
                </Row>
                </div>
                <div style={!this.state.showNewStyle&&infoPage ==="" ? {} : {'display': 'none'}}>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={6}>
                            <Tooltip title="Below is a list of the teams you have joined. Click the team card to go to the details page">
                                <Text strong>The teams you joined:</Text>
                            </Tooltip>
                        </Col>
                        <Col span={6} offset={3}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={this.showSearchPage}
                            data-tut="tour_team_join">
                                Join a Team
                            </Button>
                        </Col>
                    </Row>
                    
                    <Row type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'} } data-tut="tour_team_join_info">
                        {this.showTeams("joined",this.state.joinedteams)}
                    </Row>

                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={6}>
                            <Tooltip title="Below is a list of the teams you have created. Click the team card to manage the team information, including basic information, sprints, members and templates">
                                <Text strong>The teams you created:</Text>
                            </Tooltip>
                        </Col>
                        <Col span={6} offset={3}>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.showCreateModal}
                            data-tut="tour_team_create">
                                    New Team
                            </Button>
                        </Col>
                    </Row>

                    <Row type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'}} data-tut="tour_team_create_info">
                        {this.showTeams("created",this.state.createdteams)}
                    </Row>

                </div>

                {/* Create Team Modal */}

                <div >
                    <Modal show={this.state.showCreatePage}
                        handleOk={this.createTeam}
                        handleCancel={this.handleCreateCancel}
                        showOk={false}
                        showCancel={false}
                        title="Create A Team"
                    >
                    <Row type={"flex"} justify={"center"} align={"top"} style={{width:"50vw"}}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 12} }
                            name="nest-messages" 
                            validateMessages={validateMessages}
                            onFinish={this.createTeam}
                           
                            >
                                <Form.Item name={['team', 'teamName']} label="Team's Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['team', 'leadEmail']} label="Leader" >
                                    <Input defaultValue={this.props.userInfo.username} disabled={true} />
                                </Form.Item>
                                <Form.Item name={['team', 'teamDesc']} label="Description">
                                    <Input.TextArea />
                                </Form.Item>
                                {/* <Form.Item name={['team', 'teamEmail']} label={
                                    <span>
                                        Supervisor's email&nbsp;
                                        <Tooltip title="The email to receive team's integrated report">
                                        <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                    } rules={[{ type: 'email' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['team', 'ccList']} label="Cc list"
                                rules={[{ type: "regexp" },{ pattern: ccPattern ,message:"Invalid format!"}]}
                                >
                                    <Input placeholder="example1@example.com;example2@example.com"/>
                                </Form.Item> */}
                                <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                                    <Space size={100}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button onClick={this.handleCreateCancel}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    </Modal>
                </div>

                {/* Search Team Modal */}

                <div>
                    <Modal show={this.state.showSearchPage}
                        handleCancel={this.exitSearchPage}
                        showOk={false}
                        title="Join A New Team"
                        okMessage={"Join"}
                        cancelMessage={"Cancel"}
                        cancelBtnType={""}
                        okBtnType={"primary"}
                    >
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Search
                        placeholder="Input team's name or leader's email"
                        enterButton="Search"
                        size="large"
                        style={{width:"60vw"}}
                        onSearch={value => this.searchTeams(value)}
                        />
                        <Table 
                        // rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={this.state.searchTeams} 
                        size="middle"  
                        style={{width:"60vw"}}
                        pagination={{
                            pageSize: 5,
                            size:"small",
                        }}
                        />
                        </Row>
                    </Modal>
               </div>

                </Content>
            </Layout>
        );
    }
}

export default TeamManagement;