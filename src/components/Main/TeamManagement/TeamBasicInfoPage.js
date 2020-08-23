import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Col, Row, Button, Input, Form,Space,Typography, message,Tooltip} from "antd";
import 'antd/dist/antd.css';
import { DeleteOutlined, CheckOutlined, ExclamationCircleOutlined,EditOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Modal from '../HelperComponents/Modal'
import {deleteTeamService,updateTeamService} from '../../../services/teamService';
import {showError} from "../../../services/notificationService";

const { Paragraph } = Typography;



class TeamBasicInfoPage extends Component {

    state={
        showDeletePage:false,
        showUpdatePage:false,
        changeInfo:[],
        editTeamInfo:[],
    };

    /**
     * show the confirm modal of deleting the team
     * @method deleteTeamConfirm
     * @for TeamBasicInfoPage
     * @return none
     */
    deleteTeamConfirm=()=>{
        this.setState({showDeletePage:true})
    };

    /**
     * exit deletion modal
     * @method handleCancelDelete
     * @for TeamBasicInfoPage
     * @return none
     */
    handleCancelDelete = () => {
        this.setState({showDeletePage: false})
    };

    /**
     * confirm to delete the team
     * success: back to the team management page,and refresh
     * @method handleOkDelete
     * @for TeamBasicInfoPage
     * @return none
     */
    handleOkDelete = () => {
        deleteTeamService(this.props.teamInfo.id).then((res) => {
           this.props.updateDeletedTeam()
           this.props.exitInfoPage()
           message.success("Successfully deleted ! ")
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to delete!");
            }
        });
        this.setState({showDeletePage: false})
    };

    /**
     * show the update modal and carry the team's data
     * @method onUpdatePage
     * @for TeamBasicInfoPage
     * @return none
     */
    onUpdatePage =()=>{
        this.setState({
            showUpdatePage:true,
            editTeamInfo:this.props.teamInfo,
        })
    };

    /**
     * cancel updating and close the update modal
     * @method handleCancelUpdate
     * @for TeamBasicInfoPage
     * @return none
     */
    handleCancelUpdate = () => {
        this.setState({showUpdatePage: false})
    };

    /**
     * handle updating
     * success: refresh the team information on team basic info page and team management page
     * then close the update modal
     * @method showTeams
     * @param values: new team info
     * @for TeamBasicInfoPage
     * @return none
     */
    handleOkUpdate = (values) => {
        values = values.team;
        values.id = this.state.editTeamInfo.id;
        updateTeamService(values).then((res) => {
            if(res.code === 0) {
                message.success("Successfully updated!");
                this.props.updateTeamInfo();
            }else{
                message.error(res.msg);
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to update");
            }
        });
        this.setState({showUpdatePage: false})
      };
      
    

    render() {
        const ccPattern = "^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$";
        
        return (
            <div style={{"padding" : "10px"}}>          
                <div>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 8} }
                            >
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
                                {/* <Form.Item name={['team', 'flowUrl']} label="flow url">
                                    {this.props.teamInfo.flowUrl}
                                </Form.Item> */}
                            </Form>
                            <Space size={60}>
                                <Button type="primary" onClick={this.onUpdatePage}>
                                    <EditOutlined />
                                    Edit
                                </Button>
                                <Button type="primary" danger onClick={this.deleteTeamConfirm}>
                                    <DeleteOutlined />
                                    Delete
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Delete Team Modal */}
               <div>
                    <Modal show={this.state.showDeletePage}
                        handleOk={this.handleOkDelete}
                        handleCancel={this.handleCancelDelete}
                        okMessage={"Delete"}
                        cancelMessage={"Cancel"}
                        okBtnType="danger"
                        title="Delete Team"
                    >
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <div>
                        <ExclamationCircleOutlined style={{fontSize:20,color:"red"}}/>
                        <Text strong>
                            Are you sure you want to delete this team?
                        </Text>
                        </div>
                        </Row>
                    </Modal>
               </div>


                {/* Update Team Modal */}
               <div >
                    <Modal show={this.state.showUpdatePage}
                        showOk={false}
                        showCancel={false}
                        handleCancel={this.handleCancelUpdate}
                        title="Update Team"
                    >
                    <Row type={"flex"} justify={"center"} align={"top"} style={{width:600}}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 12} }
                            name="nest-messages" 
                            onFinish={this.handleOkUpdate}
                            >
                                <Form.Item name={['team', 'teamName']} label="Team's name" >
                                {/* rules={[{ required: true }]} */}
                                    <Input defaultValue={this.state.editTeamInfo.teamName} />
                                </Form.Item>
                                <Form.Item name={['team', 'leadEmail']} label="Leader's email" >
                                    <Input defaultValue={this.state.editTeamInfo.leadEmail} disabled={true} />
                                </Form.Item>
                                <Form.Item name={['team', 'teamDesc']} label="Description">
                                    <Input type="textarea" defaultValue= {this.state.editTeamInfo.teamDesc}/>
                                </Form.Item>
                                {/* <Form.Item name={['team', 'teamEmail']} label={
                                    <span>
                                        Supervisor's email&nbsp;
                                        <Tooltip title="The email to receive team's integrated report">
                                        <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                } rules={[{ type: 'email' }]}>
                                    <Input defaultValue={this.state.editTeamInfo.teamEmail}/>
                                </Form.Item>
                                <Form.Item name={['team', 'ccList']} label="Cc list"
                                rules={[{ type: "regexp" },{ pattern: ccPattern ,message:"Invalid format!"}]}
                                >
                                    <Input defaultValue= {this.state.editTeamInfo.ccList} placeholder="example1@example.com;example2@example.com"/>
                                </Form.Item> */}
                                {/* <Form.Item name={['team', 'flowUrl']} label="flow url" >
                                    <Input defaultValue= {this.state.editTeamInfo.flowUrl}/>
                                </Form.Item> */}
                                <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                                    <Space size={100}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button onClick={this.handleCancelUpdate}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    </Modal>
                </div>
            
            </div>
        );
    }
}

export default TeamBasicInfoPage;