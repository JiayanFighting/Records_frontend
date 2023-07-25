import React, { Component } from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import { Card, Layout, List, Select, Row, Col, Button, message, Form, Tag, Popconfirm, Input } from "antd";
import { EditOutlined, DoubleLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import marked from "marked";
import WriteAndViewBoard3 from "../WriteAndViewBoard3/WriteAndViewBoard3";
import WriteBoard from '../WriteManagement/WriteBoard';
import { showError } from "../../../services/notificationService";
import {
    createTemplateService,
    searchTemplatesService,
    getAllTemplatesService,
    updateTemplateService,
    deleteTemplateService
} from "../../../services/templateService";


const { Option } = Select;

class TemplatesPage extends Component {
    state = {
        templates: [],
        editTemplate: [],
        showEditPage: false,
        showCreatePage: false,
        searchType: "weekly",
        content: "",
        title: "",
    }

    componentDidMount() {
        this.getTemplates();
    }

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

    showEditTemplate = (template) => {
        this.setState({
            editTemplate: template,
            title: template.title,
            showEditPage: true,
            content: template.content,
        })
    }

    closeEditPage = () => {
        this.setState({
            showEditPage: false,
        })
    }

    showCreateTemplate = () => {
        this.setState({
            showCreatePage: true,
            content: "",
            title: "",
        })
    }

    closeCreatePage = () => {
        this.setState({ showCreatePage: false, })
    }

    handleOkDelete = (id) => {
        deleteTemplateService(id).then((res) => {
            message.success("删除成功")
            let leftTemplate = []
            this.state.templates.forEach(template => {
                if (template.id !== id) {
                    leftTemplate.push(template)
                }
            });
            this.setState({ templates: leftTemplate })
        }).catch((err) => {
            showError("删除失败");
        });
    };

    setContent = (content) => {
        this.setState({ content: content });
    }

    setTitle = (title) => {
        this.setState({ title: title });
    }

    updateTemplate = (values) => {
        if (this.state.title === undefined || this.state.title === '') {
            message.error("请输入标题!");
            return;
        }
        let template = {
            id: this.state.editTemplate.id,
            teamId: this.state.teamId,
            content: this.state.content,
            title: this.state.title,
            type: values.template.type,
        };
        updateTemplateService(template).then((res) => {
            if (res.code === 0) {
                message.success("Successfully updated!")
                this.setState({
                    showEditPage: false,
                    editTemplate: [],
                })
                this.getTemplates();
            } else {
                message.error("Failed to update!")
            }

        }).catch((err) => {
            message.error("Failed to update!")
        });
    }

    /**
     * handle creating template
     * @param {*} values 
     */
    createTemplate = (values) => {
        console.log(values)
        values.template.type = values.template.type === undefined ? "weekly" : values.template.type;
        if (this.state.title === undefined || this.state.title === '') {
            message.error("Please input the title!");
            return;
        }
        let template = {
            teamId: this.state.teamId,
            type: values.template.type,
            title: this.state.title,
            content: this.state.content,
        };
        console.log(values);
        createTemplateService(template).then((res) => {
            if (res.code === 0) {
                message.success("Successfully created!")
                this.setState({
                    showCreatePage: false,
                    editTemplate: [],
                })
                this.getTemplates();
            } else {
                message.error("Failed to create!")
            }
        }).catch((err) => {
            message.error("Failed to create!")
        });
    }

    onChangeSearch = (value) => {
        this.setState({
            searchType: value
        })
    }

    /**
     * search template by type
     */
    searchTemplate = () => {
        searchTemplatesService(this.state.teamId, this.state.searchType).then((res) => {
            if (res.code === 0) {
                this.setState({
                    templates: res.templates
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    render() {
        const renderer = new marked.Renderer();
        renderer.link = function (href, title, text) {
            return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title}">${text}</a>`;
        };

        return (
            <Layout style={{ background: "white" }}>
                {/* List the templates */}
                <div style={!this.state.showEditPage && !this.state.showCreatePage ? {} : { 'display': 'none' }}>
                    {/* Search and create section */}
                    <Row style={{ margin: 10 }}>
                        {/* <Col span={2}>
                            类型:
                        </Col>
                        <Col span={4}>
                            <Select
                                showSearch
                                style={{ width: "15vw" }}
                                placeholder="Select The Type"
                                optionFilterProp="children"
                                defaultValue="weekly"
                                onChange={this.onChangeSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="weekly">weekly</Option>
                                <Option value="monthly">monthly</Option>
                                <Option value="daily">daily</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={this.searchTemplate}>查询</Button>
                        </Col> */}
                        <Col span={6} offset={8}>
                            <Button type="primary" onClick={this.showCreateTemplate}>新增模板</Button>
                        </Col>
                    </Row>
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
                                            <Popconfirm title="确认删除?" onConfirm={() => this.handleOkDelete(item.id)} okText="是"
                                                cancelText="否">
                                                <DeleteOutlined key="delete" />
                                            </Popconfirm>,
                                            <EditOutlined key="edit"
                                                onClick={() => this.showEditTemplate(item)}
                                            />,
                                        ]}
                                    >
                                        {/* type: {item.type} */}
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

                {/*更新模板页面 */}
                {this.state.showEditPage ? <div>
                    <Col span={4}>
                        <Button type="link" onClick={() => { this.closeEditPage() }}>
                            <DoubleLeftOutlined />返回
                        </Button>
                    </Col>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={24}>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                                onFinish={this.updateTemplate}>
                                <Form.Item wrapperCol={{ span: 8, offset: 0 }} label="Type" name={['template', 'type']} rules={[{ required: true, message: '请选择分类!' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 4, offset: 0 }}>
                                    <Button type="primary" htmlType="submit">
                                        更新
                                    </Button>
                                </Form.Item>
                                <WriteBoard
                                    setContent={this.setContent.bind(this)}
                                    setTheme={this.setTitle.bind(this)}
                                    content={this.state.content}
                                    theme={this.state.title}
                                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                                    insertPhotoUrl={this.insertPhotoUrl}
                                    // saveDraft = {this.saveDraft}
                                    hideSomeFunctions={false}
                                />

                            </Form>
                        </Col>
                    </Row>
                </div>
                    : <div></div>}

                {/* 创建模板页面 */}
                {this.state.showCreatePage ? <div>
                    <Row justify="begin" style={{ paddingTop: 5 }}>
                        <Col span={2}>
                            <Button type="link" onClick={() => { this.closeCreatePage() }}>
                                <DoubleLeftOutlined />返回
                            </Button>
                        </Col>
                    </Row>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={24}>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                                onFinish={this.createTemplate}>
                                <Form.Item name={['template', 'type']} label="类型" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Form.Item>
                                <WriteBoard
                                    setContent={this.setContent.bind(this)}
                                    setTheme={this.setTitle.bind(this)}
                                    content={this.state.content}
                                    theme={this.state.title}
                                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                                    insertPhotoUrl={this.insertPhotoUrl}
                                    // saveDraft = {this.saveDraft}
                                    hideSomeFunctions={false}
                                />
                                {/* <WriteAndViewBoard3
                                    setContent={this.setContent.bind(this)}
                                    content={this.state.content}
                                    defaultText={"defaultText"}
                                    setTheme={this.setTitle.bind(this)}
                                    theme={this.state.title}
                                    // sprintObj={this.props.sprintObj}
                                    teamInfo={this.props.teamInfo}
                                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                                    // insertPhotoUrl = {this.insertPhotoUrl}
                                    // saveDraft = {this.saveDraft}
                                    hideSomeFunctions={true}
                                /> */}
                            </Form>
                        </Col>
                    </Row>
                </div>
                    : <div></div>}

            </Layout>
        );
    }
}

export default TemplatesPage;