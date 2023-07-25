import React, { Component } from 'react';
import { Col, Row, Button, Input, Spin, message, Form, Upload, Tree, Card, Layout, List, Select, Tag, Popconfirm } from "antd";
import 'antd/dist/antd.css';
import { DeleteOutlined, EditOutlined, DoubleLeftOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import marked from "marked";
import { IMAGE_ROOT } from '../../../constants';
// self components
import EditableTagGroup from './EditableTagGroup';
import ImgCrop from 'antd-img-crop';
import WriteBoard from '../WriteManagement/WriteBoard';
import ViewBoard from '../WriteManagement/ViewBoard'
import Modal from "../../Main/HelperComponents/Modal";
// services
import { submitNoteService } from "../../../services/noteService";
import { saveCover } from '../../../services/photoService';
import { getDirectoryListOnlyService } from "../../../services/noteService";
// CSS
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import NoteDirectory from '../NoteManagement/NoteDirectory';
import NoteDirectoryOnly from '../NoteManagement/NoteDirectoryOnly';
import {
    getAllTemplatesService,
    createTemplateService
} from "../../../services/templateService";
const { DirectoryTree } = Tree;
class WritePage extends Component {
    state = {
        content: "",
        templateContent: "",
        title: "",
        templateTitle: "",
        showSubmitModal: false,
        showSubmitTemplateModal: false,
        showTemplatesModal: false,
        templates: [],
        isLoading: false,
        tags: [],
        coverUrl: "",
        directorys: [],
        selectedDirectory: 0,
    }

    setContent = (content) => {
        this.setState({ content: content, templateContent: content });
    };

    setTheme = (title) => {
        this.setState({ title: title, templateTitle: title });
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
        console.log("Image Path=" + IMAGE_ROOT + url)
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
        if (modalName === "showSubmitModal" && this.state.title.length === 0) {
            message.error("请输入标题");
            return;
        }
        if (modalName === "showSubmitModal") {
            this.getDirectorys();
        }
        this.setState({
            [modalName]: true,
        });
    };

    submitNote = (values) => {
        console.log(values)
        this.setState({ isLoading: true });
        let tagString = "";
        this.state.tags.forEach((item, index) => {
            if (index === 0) {
                tagString = item;
            } else {
                tagString = tagString + ";" + item;
            }
        });
        console.log(tagString);
        let params = {
            userId: this.props.userInfo.id,
            directory: this.state.selectedDirectory,
            type: values.type,
            tags: tagString,
            title: this.state.title,
            content: this.state.content,
            cover: this.state.coverUrl,
            // thumbUp:14,
            // star:34,
        }
        submitNoteService(params).then((res) => {
            message.success("Successfully submitted!");
            this.setState({ showSubmitModal: false, isLoading: false });
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to submit!");
            }
        });
    }

    handleAddTag = (inputValue) => {
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({ tags, });
    }

    handleDeleteTag = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    saveAPhoto = (file) => {
        console.log(this.props.userInfo.id)
        const data = new FormData();
        data.append('photo', file);
        data.append('userId', this.props.userInfo.id);
        saveCover(data).then((res) => {
            console.log(IMAGE_ROOT + res.url);
            this.setState({ coverUrl: IMAGE_ROOT + res.url });
        }).catch((err) => {
            message.error(err);
        });
    }

    getDirectorys = () => {
        getDirectoryListOnlyService().then((res) => {
            this.setState({ directorys: res.all.children });
            // message.success("success");
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("获取目录失败");
            }
        });
    }

    createTemplate = (values) => {
        let template = {
            type: values.type,
            title: this.state.title,
            content: this.state.content,
        };
        createTemplateService(template).then((res) => {
            if (res.code === 0) {
                message.success("创建成功")
                this.setState({
                    showSubmitTemplateModal: false
                })
            } else {
                message.error("创建失败")
            }
        }).catch((err) => {
            message.error("创建失败")
        });
    }

    getTemplatesAndShowModal = () => {
        this.getTemplates();
        this.setState({
            showTemplatesModal: true,
        });
    };


    getTemplates = () => {
        console.log("1111")
        let template = {
            teamId: null,
            type: null,
            title: null,
            content: null,
        };
        getAllTemplatesService(template).then((res) => {
            console.log(res)
            if (res.code === 0) {
                this.setState({
                    templates: res.templates
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    chooseTemplate = (template) => {
        console.log(template)
        this.setState({
            title: template.title,
            content: template.content,
            showTemplatesModal: false,
        })
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
        console.log(event.node.key);
        this.setState({ selectedDirectory: parseInt(event.node.key) });
    };

    render() {
        const renderer = new marked.Renderer();
        renderer.link = function (href, title, text) {
            return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title}">${text}</a>`;
        };
        return (
            <div style={{ backgroundColor: "white" }}>
                <Row justify="end" style={{ paddingTop: 5 }}>
                    <Col span={2}>
                        <Button type="primary" onClick={() => this.showModal("showSubmitModal")}>提交</Button>
                    </Col>
                    <Col span={2}>
                        <Button onClick={() => this.getTemplatesAndShowModal()}>选择模版</Button>
                    </Col>
                    <Col span={2}>
                        <Button onClick={() => this.showModal("showSubmitTemplateModal")}>保存为模板</Button>
                    </Col>
                </Row>
                <WriteBoard
                    setContent={this.setContent.bind(this)}
                    setTheme={this.setTheme.bind(this)}
                    content={this.state.content}
                    theme={this.state.title}
                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                    insertPhotoUrl={this.insertPhotoUrl}
                    saveDraft={this.saveDraft}
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
                        <div style={{ textAlign: "left", width: "60vw" }}>
                            <Row>
                                <Col span={12}>
                                    {/* <Spin tip="Loading..." spinning={this.state.isLoading}> */}
                                    <ViewBoard content={this.state.content} title={this.state.title} height={"75vh"} />
                                    {/* </Spin> */}
                                </Col>

                                <Col span={8}>
                                    <Form
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 12 }}
                                        name="basic"
                                        onFinish={this.submitNote}
                                    >
                                        <Form.Item label="Type" name="type"
                                            rules={[{ required: true, message: '请选择分类!' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item label="标签" name="tags"
                                        // rules={[{ required: true, message: '至少设置一个标签' }]}
                                        >
                                            <EditableTagGroup initTags={this.state.tags} handleAddTag={this.handleAddTag} handleDeleteTag={this.handleDeleteTag} />

                                        </Form.Item>

                                        <Form.Item label="封面图片" name="cover">
                                            { }
                                            <ImgCrop rotate>
                                                <Upload
                                                    // defaultFileList={fileList}
                                                    listType="text"
                                                    // fileList={fileList}
                                                    onChange={(info) => {
                                                        const { status } = info.file;
                                                        if (status !== 'uploading') {
                                                            this.saveAPhoto(info.file.originFileObj);
                                                        }
                                                    }}
                                                    onPreview={this.onPreview}
                                                    name={this.props.userInfo.email + ".jpg"}
                                                    showUploadList={false}
                                                >
                                                    {this.state.coverUrl.length === 0 ? <a>Update cover </a> :
                                                        <span>
                                                            <a style={{ marginRight: 10 }}>{this.state.coverUrl} </a>
                                                            <a onClick={() => this.setState({ coverUrl: '' })}><DeleteOutlined /></a>
                                                        </span>}
                                                </Upload>
                                            </ImgCrop>
                                        </Form.Item>

                                        <div style={{ height: "30vh", overflow: "scroll" }}>
                                            <DirectoryTree
                                                onSelect={this.onSelect}
                                                onExpand={this.onExpand}
                                                treeData={this.state.directorys}
                                                style={{ textAlign: "left" }}
                                            />
                                        </div>
                                        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                            <Button onClick={() => this.exitModal("showSubmitModal")} style={{ marginRight: 20 }}>取消</Button>
                                            <Button type="primary" htmlType="submit" >提交</Button>
                                        </Form.Item>
                                    </Form>
                                </Col>

                            </Row>

                        </div>
                    </Modal>
                </div>

                {/* 提交模版窗口 */}
                <div>
                    <Modal
                        show={this.state.showSubmitTemplateModal}
                        showOk={false}
                        showCancel={false}
                        handleCancel={() => this.exitModal("showSubmitTemplateModal")}
                        handleOk={() => this.createTemplate("")}
                        okMessage={"提交"}
                        cancelMessage={"取消"}
                        cancelBtnType={""}
                        okBtnType={"primary"}
                        title={"提交模板"}
                    >
                        <div style={{ textAlign: "left", width: "60vw" }}>
                            <Row>
                                <Col span={12}>
                                    {/* <Spin tip="Loading..." spinning={this.state.isLoading}> */}
                                    <ViewBoard content={this.state.content} title={this.state.title} height={"75vh"} />
                                    {/* </Spin> */}
                                </Col>

                                <Col span={8}>
                                    <Form
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 12 }}
                                        name="basic"
                                        onFinish={this.createTemplate}
                                    >
                                        <Form.Item label="Type" name="type"
                                            rules={[{ required: true, message: '请选择分类!' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                            <Button onClick={() => this.exitModal("showSubmitTemplateModal")} style={{ marginRight: 20 }}>取消</Button>
                                            <Button type="primary" htmlType="submit" >保存</Button>
                                        </Form.Item>
                                    </Form>
                                </Col>

                            </Row>

                        </div>
                    </Modal>
                </div>

                {/* 选择模版窗口 */}
                <div>
                    <Modal
                        show={this.state.showTemplatesModal}
                        showOk={false}
                        showCancel={false}
                        handleCancel={() => this.exitModal("showTemplatesModal")}
                        handleOk={() => this.createTemplate("")}
                        okMessage={"提交"}
                        cancelMessage={"取消"}
                        cancelBtnType={""}
                        okBtnType={"primary"}
                        title={"提交模板"}
                    >
                        <div style={{ textAlign: "left", width: "60vw" }}>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={this.state.templates}
                                pagination={{
                                    pageSize: 4,
                                    size: "small",
                                }}
                                renderItem={item => (
                                    <List.Item>
                                        <Row>
                                            <Card title={item.title}
                                                style={{ width: "25vw" }}
                                                actions={[
                                                    <CheckCircleOutlined onClick={() => this.chooseTemplate(item)} />,
                                                ]} >
                                                <Tag color="blue">{item.type}</Tag>
                                                <div
                                                    style={{ "textAlign": "left", height: 250, background: "white", overflow: "scroll", padding: 10, "marginTop": 10 }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: marked(item.content, {
                                                            renderer: renderer,
                                                            breaks: true,
                                                            gfm: true,
                                                        }),
                                                    }}
                                                />
                                            </Card>
                                        </Row>
                                    </List.Item>
                                )}
                            />

                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default WritePage;