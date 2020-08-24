import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, Spin,Space,Table, message,Popconfirm,Avatar,Popover,Typography} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined} from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { ROOT } from '../../../constants';
import WriteBoard from '../WriteManagement/WriteBoard';
import ViewBoard from '../WriteManagement/ViewBoard'
import Modal from "../../Main/HelperComponents/Modal";
const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class WritePage extends Component {
    state={
        content:"",
        templateContent:"",
        title:"",
        templateTitle:"",
        showSubmitModal:false,
        isLoading:false,

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

    exitModal = (modalName) => {
        this.setState({
          [modalName]: false,
        });
    };

    showModal = (modalName) => {
        this.setState({
            [modalName]: true,
        });
    };

    submitNote=()=>{
        // console.log(content);
    }

    render() {
        return (
            <div style={{backgroundColor:"white"}}>
                <Row justify="end">
                    <Col span={4}>
                    <Button type="primary" onClick={()=>this.showModal("showSubmitModal")}>提交</Button>
                    </Col>
                    <Col span={4}>
                    <Button>保存为模板</Button>
                    </Col>
                </Row>
                <WriteBoard 
                    setContent={this.setContent.bind(this)}
                    setTheme={this.setTheme.bind(this)}
                    content={this.state.content}
                    theme={this.state.title}
                    onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                    insertPhotoUrl = {this.insertPhotoUrl}
                    saveDraft = {this.saveDraft}
                    hideSomeFunctions={false}
                />

                {/* 提交笔记窗口 */}
                <div>
                    <Modal
                        show={this.state.showSubmitModal}
                        handleCancel={() => this.exitModal("showSubmitModal")}
                        handleOk={() => this.submitNote()}
                        okMessage={"提交"}
                        cancelMessage={"取消"}
                        cancelBtnType={""}
                        okBtnType={"primary"}
                        title={"Submit Your Note"}
                    >
                        <div style={{ textAlign: "left" }}>
                        <h4>
                            <Row>
                            <Col span={6}>Type: </Col>
                            <Col span={18}>
                                <Input></Input>
                            </Col>
                            </Row>
                            <Row>
                            <Col span={6}> Tags : </Col>
                            <Col span={18}><Input></Input> </Col>
                            </Row>
                            <Row>
                            <Col span={6}> Title : </Col>
                            <Col span={18}>{this.state.title} </Col>
                            </Row>
                        </h4>
                        </div>
                        <Spin tip="Loading..." spinning={this.state.isLoading}>
                        <Row style={{ width: "60vw" }}>
                            <ViewBoard content={this.state.content} theme={this.state.title} height={"40vh"}/>
                        </Row>
                        </Spin>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default WritePage;