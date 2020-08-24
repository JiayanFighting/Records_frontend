import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, Spin,Typography,message} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined} from '@ant-design/icons';
import { ROOT, IMAGE_ROOT } from '../../../constants';
import WriteBoard from '../WriteManagement/WriteBoard';
import ViewBoard from '../WriteManagement/ViewBoard'
import Modal from "../../Main/HelperComponents/Modal";
import {submitNoteService} from "../../../services/noteService";
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
        content =
        '<img src="' +
        IMAGE_ROOT +
        url +
        '" alt="image uploaded' +
        '" width="50%"/> \n' +
        content;
        console.log("Image Path="+IMAGE_ROOT+ url )
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
        this.setState({isLoading:true});
        let params ={
            userId:this.props.userInfo.userId,
            directory:0,
            type:"技术",
            tags:"Java",
            title:this.state.title,
            content:this.state.content,
            cover:"http://139.196.8.131/aboutme.jpg",
            thumbUp:14,
            star:34,
        }
        submitNoteService(params).then((res) => {
            message.success("Successfully submitted!");
            this.setState({showSubmitModal:false,isLoading:false});
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to submit!");
            }
        });
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