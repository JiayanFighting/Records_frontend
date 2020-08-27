import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, Spin,Typography,message,Form,Tag, Tooltip} from "antd";
import 'antd/dist/antd.css';
import {PlusOutlined } from '@ant-design/icons';
import { ROOT, IMAGE_ROOT } from '../../../constants';
import WriteBoard from '../WriteManagement/WriteBoard';
import ViewBoard from '../WriteManagement/ViewBoard'
import Modal from "../../Main/HelperComponents/Modal";
import {submitNoteService} from "../../../services/noteService";
const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class SubmitPage extends Component {
    state={
        content:"",
        templateContent:"",
        title:"",
        templateTitle:"",
        showSubmitModal:false,
        isLoading:false,
        tags: ['Unremovable', 'Tag 2', 'Tag 3'],
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

    submitNote=(values)=>{
        this.setState({isLoading:true});
        let params ={
            userId:this.props.userInfo.userId,
            directory:0,
            type:values.type,
            tags:values.tags,
            title:this.state.title,
            content:this.state.content,
            cover:values.cover,
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
                <Modal
                    show={this.state.showSubmitModal}
                    showOk={false}
                    showCancel={false}
                    handleCancel={() => this.exitModal("showSubmitModal")}
                    handleOk={() => this.submitNote("")}
                    okMessage={"提交"}
                    cancelMessage={"取消"}
                    cancelBtnType={""}
                    okBtnType={"primary"}
                    title={"Submit Your Note"}
                >
                    <div style={{ textAlign: "left",width:"60vw"}}>
                    <Form
                    // {...layout}
                    labelCol={{span:8}}
                    wrapperCol={{span:8}}
                    name="basic"
                    onFinish={this.submitNote}
                    >
                    <Form.Item label="Type" name="type"
                        rules={[{ required: true, message: '请选择分类!' }]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item label="标签" name="tags"
                        rules={[{ required: true, message: '至少设置一个标签' }]}
                    >
                        <Input placeholder="用;分隔" />
                    </Form.Item>

                    <Form.Item label="封面图片路径" name="cover"
                        rules={[{ required: true, message: '输入图片路径!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Spin tip="Loading..." spinning={this.state.isLoading}>
                        <Row>
                            <ViewBoard content={this.state.content} title={this.state.title} height={"40vh"}/>
                        </Row>
                    </Spin>
                    <Form.Item wrapperCol={{offset:18,span:6}}>
                        <Button onClick={()=>this.exitModal("showSubmitModal")} style={{marginRight:20}}>取消</Button>
                        <Button type="primary" htmlType="submit" >提交</Button>
                    </Form.Item>
                    </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default SubmitPage;