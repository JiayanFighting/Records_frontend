import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, List,Space,Table, message,Popconfirm,Avatar,Popover,Typography} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { ROOT } from '../../../constants';

const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class WritePage extends Component {


    render() {
        return (
            <div>
                <Row justify="end">
                    <Col span={4}>
                    <Button type="primary">提交</Button>
                    </Col>
                    <Col span={4}>
                    <Button>保存为模板</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default WritePage;