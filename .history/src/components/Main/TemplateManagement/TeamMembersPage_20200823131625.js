import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, List,Space,Table, message,Popconfirm,Avatar,Popover,Typography} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Modal from '../HelperComponents/Modal'
import {removeTeamMemberService,joinTeamService} from '../../../services/teamService';
import {searchUserService,recommendedUserService} from '../../../services/userService';
import {showError, showSuccess} from "../../../services/notificationService";
import { ROOT } from '../../../constants';

const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class TeamMembersPage extends Component {

    state={
        showAddMemberPage:false,
        searchUsers:[],
        members:this.props.members,
        columns: [
            {
              title: 'Name',
              dataIndex: 'username',
              key: 'username',
              render: text => <a>{text}</a>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record, index)  => (
                <Space size="middle">
                  <a onClick={()=>{this.handleAddMembers(record,index)}}>Add</a>
                </Space>
              ),
            },
          ],
    };

    /**
     * search the users met the conditions by fuzzy query
     * @method searchUsers
     * @param str: user input for searching
     * @for TeamMembersPage
     * @return none
     */
    searchUsers=(str)=>{
        let filted = [];
        searchUserService(str).then((res) => {
            res.list.forEach(item => {
                let flag = false;
                this.state.members.some(memItem => {
                    if(memItem.email === item.email) {
                        flag = true
                        return true;
                    }
                });
                if(item.email === this.props.teamInfo.leadEmail){
                    flag = true
                }
                if(flag === false) {
                    filted.push(item)
                }
            });
            this.setState({
                searchUsers:filted,
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to search users");
            }
        });
        // Temporarily hide in team to search for users
        // searchUserInTeamsService(str).then((res) => {
        //     res.list.forEach(item => {
        //         let flag = false;
        //         this.state.members.forEach(memItem => {
        //             if(memItem.email === item.email) {
        //                 flag = true
        //             }
        //         });
        //         if(item.email === this.props.teamInfo.leadEmail){
        //             flag = true
        //         }
        //         if(flag === false) {
        //             filted.push(item)
        //         }
        //     });
        //     this.setState({
        //         searchUsers:filted,
        //     })
        // }).catch((err) => {
        //     console.log(err);
        //     if (err === 302) {
        //         this.props.onSessionExpired();
        //     } else {
        //         showError("Failed to search users in teams");
        //     }
        // });
        
    };

    /**
     * remove the user
     * @method handleOKRemove
     * @for TeamMembersPage
     * @return none
     * handle removing
     */
    handleOkRemove = (removeEmail) => {
        removeTeamMemberService(this.props.teamInfo.id,removeEmail).then((res) => {
            this.setState({
                members: this.state.members.filter(item => item.email !== removeEmail),
            })
            message.success("Successfully Removed!")

        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to remove team member");
            }
        });
      };

    /**
     * show the modal of adding members
     * @method onAddMemberPage
     * @for TeamMembersPage
     * @return none
     */
    onAddMemberPage=()=>{
        this.setState({
            showAddMemberPage:true,
            searchUsers:[]
        })
        let filted = [];
        recommendedUserService().then((res) => {
            res.list.forEach(item => {
                let flag = false;
                this.state.members.some(memItem => {
                    if(memItem.email === item.email) {
                        flag = true
                        return true;
                    }
                });
                if(item.email === this.props.teamInfo.leadEmail){
                    flag = true
                }
                if(flag === false) {
                    filted.push(item)
                }
            });
            this.setState({
                searchUsers:filted,
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to search users");
            }
        });
    };

    /**
     * exit the modal of adding members
     * @method exitAddMemberPage
     * @for TeamMembersPage
     * @return none
     */
    exitAddMemberPage=()=>{
        this.setState({showAddMemberPage:false})
    };

    /**
     * add member
     * @method handleAddMembers
     * @param user: user info
     * * @param index: index of user to delete from state
     * @for TeamMembersPage
     * @return none
     */
    handleAddMembers=(user,index)=>{
        joinTeamService(this.props.teamInfo.id,user.email).then((res) => {
            this.setState({
                searchUsers:this.state.searchUsers.filter((_, i) => i !== index)
            });
            this.setState({
                members: [...this.state.members, user],
            });      
            message.success("Successfully added !")
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to add");
            }
        });
    };

    render() {
        return (
            <div style={{"padding" : "10px"}}>
                <Row type={"flex"} justify={"center"} align={"top"}>
                    <Col span={24}>
                        <Button type="primary" onClick={this.onAddMemberPage} style={{marginBottom:5}}>Add Memeber</Button>
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
                                        <Card hoverable ={true} size ="small"
                                        actions={[
                                            <Popconfirm 
                                            title={"Sure to remove "+item.username+" from the team ?"} 
                                            onConfirm={() => this.handleOkRemove(item.email)}>
                                                <DeleteOutlined key="delete" />
                                            </Popconfirm>,
                                        ]}
                                        activeTabKey ="deleting"
                                        >
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
                
               {/* Add Member Page */}
                <div>
                    <Modal show={this.state.showAddMemberPage}
                        handleOk={this.handleAddMembers}
                        handleCancel={this.exitAddMemberPage}
                        okBtnType="primary"
                        okMessage={"Add"}
                        showOk={false}
                        cancelMessage={"Cancel"}
                        title="Add Memmber"
                    >
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Search
                        placeholder="input search member email or name"
                        enterButton="Search"
                        size="large"
                        onSearch={value => this.searchUsers(value)}
                        />
                        {/* rowSelection={rowSelection} */}
                        <Table  
                        columns={this.state.columns} 
                        dataSource={this.state.searchUsers} 
                        size="middle"  
                        style={{width:"50vw"}}
                        pagination={{
                            pageSize: 5,
                            size:"small",
                        }}
                        />
                        </Row>
                    </Modal>
               </div>
            </div>
        );
    }
}

export default TeamMembersPage;