import React, {Component} from 'react';
import {Col, Row, Button, Input, Spin,message,Form, Upload} from "antd";
import 'antd/dist/antd.css';
import {PlusOutlined } from '@ant-design/icons';
import {IMAGE_ROOT } from '../../../constants';
// self components
import EditableTagGroup from './EditableTagGroup';
import ImgCrop from 'antd-img-crop';
import WriteBoard from '../WriteManagement/WriteBoard';
import ViewBoard from '../WriteManagement/ViewBoard'
import Modal from "../../Main/HelperComponents/Modal";
// services
import {submitNoteService} from "../../../services/noteService";
import {saveCover} from '../../../services/photoService';
// CSS
import '../../../styles/Main/TeamManagement/TeamManagement.css';

class WritePage extends Component {
    state={
        content:"",
        templateContent:"",
        title:"",
        templateTitle:"",
        showSubmitModal:false,
        isLoading:false,
        tags:[],
        coverUrl:"",

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

    submitNote=(values)=>{
        this.setState({isLoading:true});
        let tagString = "";
        this.state.tags.forEach((item,index)=>{
            if(index === 0){
                tagString = item;
            }else{
                tagString = tagString+";"+item;
            }
        });
        console.log(tagString);
        let params ={
            userId:this.props.userInfo.userId,
            directory:0,
            type:values.type,
            tags:tagString,
            title:this.state.title,
            content:this.state.content,
            cover:this.state.coverUrl,
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

    handleAddTag =(inputValue)=>{
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({tags,});
    }

    handleDeleteTag=(removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    saveAPhoto= (file) => {
        // const data = new FormData();
        // data.append('photo',file);
        // saveAvatar(data).then((res) => {
        //   this.props.handleUpdateAvatar(res.url);
        // }).catch((err) => console.log(err));

        const data = new FormData();
        data.append('photo',file);
        data.append('userId',this.props.userInfo.userId);
        saveCover(data).then((res) => {
            console.log(res);
            console.log(IMAGE_ROOT+res.url);
            this.setState({coverUrl:IMAGE_ROOT+res.url});
        }).catch((err) => {
            message.error(err);
        });
    }

    render() {
        return (
            <div style={{backgroundColor:"white"}}>
                <Row justify="end" style={{paddingTop:5}}>
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
                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                    insertPhotoUrl = {this.insertPhotoUrl}
                    saveDraft = {this.saveDraft}
                    hideSomeFunctions={false}
                />

                {/* 提交笔记窗口 */}
                <div>
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
                            // rules={[{ required: true, message: '至少设置一个标签' }]}
                        >
                            {/* <Input placeholder="用;分隔" /> */}
                            <EditableTagGroup initTags= {this.state.tags} handleAddTag={this.handleAddTag} handleDeleteTag={this.handleDeleteTag}/>
                            
                        </Form.Item>

                        <Form.Item label="封面图片路径" name="cover"
                            // rules={[{ required: true, message: '输入图片路径!' }]}
                        >
                            {/* <Input /> */}
                            <ImgCrop rotate>
                            <Upload
                                listType="text"
                                // fileList={fileList}
                                onChange={(info)=>{
                                const{status}  = info.file;
                                if (status !== 'uploading') {
                                    this.saveAPhoto(info.file.originFileObj);
                                }
                            }}
                                onPreview={this.onPreview}
                                name={this.props.userInfo.userEmail+".jpg"}
                                showUploadList={false}
                            >
                                <a>Update cover </a>
                            </Upload>
                            </ImgCrop>
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
            </div>
        );
    }
}

export default WritePage;