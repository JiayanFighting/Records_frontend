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

    insertPhotoUrl = (url) => {
        let content = this.state.content;
        // for example: <img src="https://weekly.omsz.io:3000/5/yixuan.zhang@dchdc.net/FAD75E474ECD4270BEC36C497961564E.png" alt=“upload”  width="100%">
        // when sending email, convert to base64
        content =
        '<img src="' +
        ROOT +
        url +
        '" alt="image uploaded' +
        '" width="50%"/> \n' +
        content;
        this.setState({ content: content });
    };

    onShowReportsInThePastClicked = () => {
        var params = {
          fromEmail: this.props.userInfo.email, // opt , if no userEmail ,required
          offset: 0, // opt ,default 0
          limit: 10, //  opt ,default 10
        };
        // this.getReportDataWithKeys(params);
    };

    saveDraft = (content) => {
      }

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
                <WriteBoard 
                    setContent={this.setContent.bind(this)}
                    setTheme={this.setTheme.bind(this)}
                    content={this.state.content}
                    theme={this.state.theme}
                    onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                    insertPhotoUrl = {this.insertPhotoUrl}
                    saveDraft = {this.saveDraft}
                    hideSomeFunctions={false}
                />
            </div>
        );
    }
}

export default WritePage;