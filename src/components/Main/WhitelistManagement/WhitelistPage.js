import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, List,Space,Form, message,Popconfirm,Avatar,Divider,Typography,Tag} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined,SettingOutlined} from '@ant-design/icons';
import Modal from '../HelperComponents/Modal'
import {getAllWhitelistService,addWhitelistService,deleteWhitelistService,setAdminService,cancelAdminService} from '../../../services/whitelistService';
import {showError, showSuccess} from "../../../services/notificationService";
import { ROOT, USER_TYPE_ADMIN, USER_TYPE_NORMAL, USER_TYPE_SUPER_ADMIN } from '../../../constants';
import { forEach } from 'lodash';

const { Meta } = Card;
const { Search } = Input;
const { Text } = Typography;
const { Paragraph } = Typography;

class WhitelistPage extends Component {

    state={
        showAddMemberPage:false,
        searchUsers:[],
        members:this.props.members,
        users:[],
        admins:[],
        normalUsers:[],
        superAdmin:[],
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

    componentDidMount(){
        getAllWhitelistService().then((res) => {
            if(res.code === 0) {
                this.setState({
                    users:res.list,
                })
                let normalUsers = [];
                let admins = [];
                let superAdmin = [];
                res.list.forEach((item)=>{
                    if(item.type === USER_TYPE_SUPER_ADMIN){
                        superAdmin.push(item);
                        admins.push(item);
                    }else if(item.type === USER_TYPE_ADMIN){
                        admins.push(item);
                    }else if(item.type == USER_TYPE_NORMAL) {
                        normalUsers.push(item);
                    }
                })
                this.setState({
                    normalUsers:normalUsers,
                    admins:admins,
                    superAdmin:superAdmin,
                })
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to search users");
            }
        });
    }
    

    /**
     * delete the user from whitelist
     * @method handleOkDelete
     * @for WhitelistPage
     * @return none
     * handle deleting
     */
    handleOkDelete = (email) => {
        console.log(email);
        if(email === this.props.userInfo.email){
            showError("Can not delete yourself!");
            return;
        }
        deleteWhitelistService(email).then((res) => {
            if(res.code === 0) {
                this.setState({
                    users: this.state.users.filter(item => item.email !== email),
                    normalUsers:this.state.normalUsers.filter(item => item.email !== email),
                    admins:this.state.admins.filter(item => item.email !== email),
                })
                showSuccess("Successfully Deleted!")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to delete the user");
            }
        });
      };

    

    /**
     * add user into whitelist
     * @method handleAddUser
     * @param user: user email
     * @for WhitelistPage
     * @return none
     */
    handleAddUser=(values)=>{
        console.log(values);
        addWhitelistService(values.email).then((res) => {
            if(res.code === 0){
                let newUser = {
                    email:values.email
                }
                this.setState({
                    users: [newUser,...this.state.users],
                    normalUsers:[newUser,...this.state.normalUsers],
                });      
                showSuccess("Successfully added !")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to add");
            }
        });
    };

    handleCancelAdmin = (user)=>{
        if(user.email === this.props.userInfo.email){
            showError("Can not manage yourself!");
            return;
        }
        cancelAdminService(user.email).then((res) => {   
            if(res.code === 0){
                let newUser = user;
                newUser.type = USER_TYPE_NORMAL;
                
                this.setState({
                    admins:this.state.admins.filter(item => item.email !== user.email),
                    normalUsers:[...this.state.normalUsers,newUser],
                });
                let newUsers = [];
                this.state.users.forEach((item) => {
                    if(item.email === user.email){
                        let newUser = item;
                        newUser.type = USER_TYPE_NORMAL;
                        newUsers.push(newUser);
                    }else{
                        newUsers.push(item);
                    }
                });
                this.setState({users:newUsers})
                showSuccess("Successfully set !")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to set");
            }
        });

    }
    handleSetAdmin=(user)=>{
        console.log(user.email);
        if(user.email === this.props.userInfo.email){
            showError("Can not manage yourself!");
            return;
        }
        setAdminService(user.email).then((res) => {   
            if(res.code === 0){
                let newUser = user;
                newUser.type = USER_TYPE_ADMIN;
                
                this.setState({
                    normalUsers:this.state.normalUsers.filter(item => item.email !== user.email),
                    admins:[...this.state.admins,newUser],
                });

                let newUsers = [];
                this.state.users.forEach((item,index) => {
                    if(item.email === user.email){
                        let newUser = item;
                        newUser.type = USER_TYPE_ADMIN;
                        newUsers.push(newUser);
                    }else{
                        newUsers.push(item);
                    }
                });
                this.setState({users:newUsers})
                showSuccess("Successfully set !")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to set");
            }
        });
    };

    showWhiteList=()=>{
        const headerAdmin = <Row justify="space-between">
            <Col span={12}>
                <Text strong>The list of administrators: </Text>
            </Col>
        </Row>;
        const headerUsers = <Row justify="space-between">
            <Col span={12}>
                <Text strong>The list of users: </Text>
            </Col>
        </Row>;
            
        if(this.props.userInfo.type === USER_TYPE_ADMIN) {
            return (
                <Row type={"flex"} justify={"center"} align={"top"}>
                    <Col span ={11}>
                        <div style={{textAlign:"left"}}>
                            <List
                                header={headerAdmin}
                                pagination={{
                                    pageSize: 5,
                                    size:"small",
                                }}
                                dataSource={this.state.admins}
                                renderItem={item => (
                                <List.Item
                                span={24}
                                >
                                    <List.Item.Meta
                                    style={{"font-family": "Times New Roman, Times, serif"}}
                                    avatar={ 
                                        item.avatar === undefined || item.avatar === null || item.avatar === "" || item.avatar.length === 0?
                                        <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                            <UserOutlined style={{width:'20'}}/>
                                        </Avatar>
                                        :
                                        <Avatar size={50} src={ROOT+item.avatar}/>
                                    }
                                    title={item.type === USER_TYPE_SUPER_ADMIN? <div><Tag color={"purple"}>super admin</Tag>{item.email}</div>:<div><Tag color={"blue"}>admin</Tag>{item.email}</div>}
                                    description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{item.username}</Paragraph>}
                                    />
                                </List.Item>
                                )}
                            />
                        </div>
                    </Col>

                    <Col span={2}>
                        <Divider type="vertical" style={{height:"100vh"}}/>
                    </Col>
                        
                    <Col span ={11}>
                        <div style={{textAlign:"left"}}>
                            <List
                                header={headerUsers}
                                pagination={{
                                    pageSize: 5,
                                    size:"small",
                                }}
                                dataSource={this.state.normalUsers}
                                renderItem={item => (
                                <List.Item
                                actions={[
                                    <Popconfirm title={"Sure to remove "+item.username+" from the whitelist ?"} 
                                        onConfirm={() => this.handleOkDelete(item.email)}>
                                        <a>delete</a>
                                    </Popconfirm>
                                ]}
                                span={24}
                                >
                                    <List.Item.Meta
                                    style={{"font-family": "Times New Roman, Times, serif"}}
                                    avatar={ 
                                        item.avatar === undefined || item.avatar === null || item.avatar === "" || item.avatar.length === 0?
                                        <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                            <UserOutlined style={{width:'20'}}/>
                                        </Avatar>
                                        :
                                        <Avatar size={50} src={ROOT+item.avatar}/>
                                    }
                                    title={item.type === USER_TYPE_ADMIN || item.type === USER_TYPE_SUPER_ADMIN? <div><Tag color={"blue"}>admin</Tag>{item.email}</div>:item.email}
                                    description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{item.username}</Paragraph>}
                                    />
                                </List.Item>
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            );
        }else if(this.props.userInfo.type === USER_TYPE_SUPER_ADMIN){
            return (
                <Row type={"flex"} justify={"center"} align={"top"}>
                    <Col span ={11}>
                        <div style={{textAlign:"left"}}>
                            <List
                                header={headerAdmin}
                                pagination={{
                                    pageSize: 5,
                                    size:"small",
                                }}
                                dataSource={this.state.admins}
                                renderItem={item => (
                                <List.Item
                                actions={item.type === USER_TYPE_SUPER_ADMIN?[]:[
                                    <Popconfirm title={"Sure to set "+item.username+" as the normal?"} 
                                        onConfirm={() => this.handleCancelAdmin(item)}>
                                        <a>Set as normal</a> 
                                    </Popconfirm>,
                                    <Popconfirm title={"Sure to remove "+item.username+" from the whitelist ?"} 
                                        onConfirm={() => this.handleOkDelete(item.email)}>
                                        <a>delete</a>
                                    </Popconfirm>,
                                ]}
                                span={24}
                                >
                                    <List.Item.Meta
                                    style={{"font-family": "Times New Roman, Times, serif"}}
                                    avatar={ 
                                        item.avatar === undefined || item.avatar === null || item.avatar === "" || item.avatar.length === 0?
                                        <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                            <UserOutlined style={{width:'20'}}/>
                                        </Avatar>
                                        :
                                        <Avatar size={50} src={ROOT+item.avatar}/>
                                    }
                                    title={item.type === USER_TYPE_SUPER_ADMIN? <div><Tag color={"purple"}>super admin</Tag>{item.email}</div>:<div><Tag color={"blue"}>admin</Tag>{item.email}</div>}
                                    description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{item.username}</Paragraph>}
                                    />
                                </List.Item>
                                )}
                            />
                        </div>
                    </Col>

                    <Col span={2}>
                        <Divider type="vertical" style={{height:"100vh"}}/>
                    </Col>
                        
                    <Col span ={11}>
                        <div style={{textAlign:"left"}}>
                            <List
                                header={headerUsers}
                                pagination={{
                                    pageSize: 5,
                                    size:"small",
                                }}
                                dataSource={this.state.normalUsers}
                                renderItem={item => (
                                <List.Item
                                actions={[
                                    <Popconfirm title={"Sure to set "+item.username+" as the administrator?"} 
                                        onConfirm={() => this.handleSetAdmin(item)}>
                                        <a>Set as administrator</a>
                                    </Popconfirm>,
                                    <Popconfirm title={"Sure to remove "+item.username+" from the whitelist ?"} 
                                        onConfirm={() => this.handleOkDelete(item.email)}>
                                        <a>delete</a>
                                    </Popconfirm>,
                                ]}
                                span={24}
                                >
                                    <List.Item.Meta
                                    style={{"font-family": "Times New Roman, Times, serif"}}
                                    avatar={ 
                                        item.avatar === undefined || item.avatar === null || item.avatar === "" || item.avatar.length === 0?
                                        <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                            <UserOutlined style={{width:'20'}}/>
                                        </Avatar>
                                        :
                                        <Avatar size={50} src={ROOT+item.avatar}/>
                                    }
                                    title={item.type === USER_TYPE_ADMIN || item.type === USER_TYPE_SUPER_ADMIN? <div><Tag color={"blue"}>admin</Tag>{item.email}</div>:item.email}
                                    description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{item.username}</Paragraph>}
                                    />
                                </List.Item>
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            );
        }else{
            return (
                <div>You have no permission</div>
            );
        }
    }

    render() {
        return (
            <div style={{"padding" : "10px",background:"white"}}>
                <div>
                    <Form
                        onFinish={this.handleAddUser}
                        layout="inline"
                        style={{margin:10}}
                    >
                        <Form.Item label="Email" name={"email"}  rules={[{ required: true},{ type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add to whitelist
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {this.showWhiteList()}
            </div>
        );
    }
}

export default WhitelistPage;