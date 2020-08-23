import React from 'react';
import {Layout, Button,message,Table,Select, Popconfirm, Form,DatePicker, InputNumber,Row,Col,Space,Tag, Card} from "antd";
import 'antd/dist/antd.css';


const { RangePicker } = DatePicker;
class UserInfoPage extends React.Component {

    state={
        
    };


   
    render() {
        return (
            <div>
                <Avatar size={64} icon={<UserOutlined />} />
                <Card title="个人信息">

                </Card>
            </div>
            
        );
    }
}

export default SprintPage;