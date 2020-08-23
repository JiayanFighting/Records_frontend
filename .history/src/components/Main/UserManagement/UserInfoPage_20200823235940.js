import React from 'react';
import {Avatar, Button,message,Table,Select, Popconfirm, Form,DatePicker, InputNumber,Row,Col,Space,Tag, Card} from "antd";
import 'antd/dist/antd.css';
const { Meta } = Card;

const { RangePicker } = DatePicker;
class UserInfoPage extends React.Component {

    state={
        
    };


   
    render() {
        return (
            <div>
                <Avatar size={100} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <Card title="个人信息">
                <Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={this.props.userInfo.username}
                description={this.props.userInfo.email}
                />
                </Card>
                <Card>
                    <Tag color="magenta">magenta</Tag>
                    <Tag color="red">red</Tag>
                    <Tag color="volcano">volcano</Tag>
                    <Tag color="orange">orange</Tag>
                    <Tag color="gold">gold</Tag>
                    <Tag color="lime">lime</Tag>
                    <Tag color="green">green</Tag>
                    <Tag color="cyan">cyan</Tag>
                    <Tag color="blue">blue</Tag>
                    <Tag color="geekblue">geekblue</Tag>
                    <Tag color="purple">purple</Tag>
                </Card>
            </div>
            
        );
    }
}

export default SprintPage;