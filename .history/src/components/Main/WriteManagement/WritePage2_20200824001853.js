import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, List,Space,Table, message,Popconfirm,Avatar,Popover,Typography} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { ROOT } from '../../../constants';
import WriteBoard from '../WriteAndView/WriteBoard';

const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class WritePage extends Component {
    state={
        content:"",
        templateContent:"",
        title:"",
        templateTitle:"",

    }

    setContent = (content) => {
        this.setState({ content: content, templateContent: content });
    };

    setTheme = (title) => {
        this.setState({ title: title, templateTitle: title  });
    };


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
                <WriteBoard />
                <WriteAndViewBoard3
                setContent={this.setContent.bind(this)}
                setDefaultContent={this.setDefaultContent.bind(this)}
                setTheme={this.setTheme.bind(this)}
                content={state.content}
                theme={state.theme}
                sprintObj={this.props.sprintObj}
                teamInfo={this.props.teamInfo}
                onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                insertPhotoUrl = {this.insertPhotoUrl}
                saveDraft = {this.saveDraft}
                hideSomeFunctions={false}
                ></WriteAndViewBoard3>
            </div>
        );
    }
}

export default WritePage;