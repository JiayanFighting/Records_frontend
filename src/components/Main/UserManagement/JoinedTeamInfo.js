import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, List, Form,Space, message,Avatar,Popover,Typography,Tooltip} from "antd";
import 'antd/dist/antd.css';
import { DoubleLeftOutlined,CloseCircleOutlined,ExclamationCircleOutlined,UserOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Modal from '../HelperComponents/Modal'
import {leaveTeamService} from '../../../services/teamService';
import {showError} from "../../../services/notificationService";

const { Meta } = Card;
const { Paragraph } = Typography;
class JoinedTeamInfo extends Component {
    
    state={
        showLeaveConfirm:false,
    };

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

    
    render() {
        return (
            <div>
                <div style={{textAlign:"left"}}>
                    <a onClick={()=>this.exitInfoPage()}> <DoubleLeftOutlined/> Back </a>
                </div>  
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
                            <Form.Item name={['team', 'Members']} label="Members" />
                        </Form>
                    </Col>
                </Row>
                <Row type={"flex"} justify={"center"} align={"top"}>
                    <Col span={18}>
                        <List
                            grid={{
                                gutter: 16,
                                column:4,
                            }}
                            pagination={{
                                pageSize: 8,
                                size:"small",
                            }}
                            dataSource={this.props.members}
                            renderItem={item => (
                                <List.Item>
                                    <Popover content={<div><p>{item.email}</p></div>} title={item.username}>
                                        <Card hoverable ={true} size ="small">
                                            <Meta
                                            avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                                            title={item.username}
                                            description={<Paragraph ellipsis={{ rows: 1}}>{item.email}</Paragraph>}
                                            />
                                        </Card>
                                    </Popover>
                                </List.Item>
                            )}
                        />
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
        );
    }
}

export default JoinedTeamInfo;