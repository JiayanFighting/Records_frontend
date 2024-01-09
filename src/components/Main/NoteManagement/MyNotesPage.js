import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { List, Drawer, Space, message, Tag, Typography, Button, Layout, Card, Select, Row, Col, Form, Popconfirm, SelectProps, Input } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined, DoubleLeftOutlined, SearchOutlined } from '@ant-design/icons';

// CSS
import '../../../styles/Main/ReportManagement/ReportManagement.css';
// components
import NoteItem from './NoteItem';
// services
import {
    getNotesListService, updateNoteService, getNoteService,
    getAllTypesService,
    getAllTagsService,
    queryNoteService
} from "../../../services/noteService";

// const
import { IMAGE_ROOT } from '../../../constants';
import WriteBoard from '../WriteManagement/WriteBoard';
import NoteDirectory from './NoteDirectory';
const { Paragraph } = Typography;
const { Sider, Content, Header, Footer } = Layout;
const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
const { Option } = Select;

const tagColors = ["blue", "red", "geekblue", "purple", "magenta", "volcano", "orange", "gold", "lime", "green", "cyan"];

class MyNotesPage extends Component {
    state = {
        notes: [],
        note: [],
        showNoteDetailPage: false,
        showEditNotePage: false,
        allTags: [],
        allTypes: [],
        allDbTags: [],
        content: "",
        title: "",
        showDrawer: false,
    }
    componentDidMount() {
        getNotesListService(this.props.userInfo.id).then((res) => {
            if (res.code === 0) {
                this.setState({ notes: res.list });
                this.getAllTags();
                this.getAllTypes();
                this.getDbAllTags();
            } else {
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });

    }

    getAllTypes = () => {
        getAllTypesService().then((res) => {
            if (res.code === 0) {
                let types = [];
                res.list.forEach(item => {
                    types.push({ "label": item, "value": item })
                })
                this.setState({ allTypes: types });
            } else {
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });
    }

    getDbAllTags = () => {
        getAllTagsService().then((res) => {
            if (res.code === 0) {
                let tags = [];
                res.list.forEach(item => {
                    tags.push({ "label": item, "value": item })
                })
                this.setState({ allDbTags: tags });
            } else {
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });
    }

    getAllTags = () => {
        let tagset = new Set()
        this.state.notes.forEach((item) => {
            let itags = item.tags;
            itags.split(",").map((tag) => {
                tagset.add(tag);
            });
        });
        this.setState({ allTags: tagset });
    }

    showNoteDetailByDirecctory = (id) => {
        getNoteService(id).then((res) => {
            if (res.code === 0) {
                this.showDetail(res.note);
            } else {
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });
    }

    showDetail = (item) => {
        this.setState({ showNoteDetailPage: true, note: item });
    }

    closeDetail = () => {
        this.setState({ showNoteDetailPage: false, note: [] });
    }

    closeEditing = () => {
        this.setState({ showNoteDetailPage: true, showEditNotePage: false });
    }

    getNoteDetail = () => {
        if (this.state.showNoteDetailPage) {
            return (
                <NoteItem
                    note={this.state.note}
                    closeDetail={this.closeDetail}
                    deleteNote={this.deleteNote}
                    editNote={this.onEditing}
                    visitor={this.props.visitor}
                />
            );
        }
    }

    onEditing = () => {
        this.setState({
            content: this.state.note.content,
            title: this.state.note.title,
            showEditNotePage: true,
            showNoteDetailPage: false
        })
    }

    getEditNotePage = () => {
        if (this.state.showEditNotePage) {
            return (
                <div>
                    <Col span={2}>
                        <Button type="link" onClick={() => this.closeEditing()}><DoubleLeftOutlined />返回</Button>
                    </Col>
                    <Col><Button type="primary" onClick={() => this.updateNote()}>更新</Button></Col>
                    <WriteBoard
                        setContent={this.setContent.bind(this)}
                        setTheme={this.setTitle.bind(this)}
                        content={this.state.content}
                        theme={this.state.title}
                        insertPhotoUrl={this.insertPhotoUrl}
                        saveDraft={this.saveDraft}
                        hideSomeFunctions={true}
                    />
                </div>
            );
        }
    }

    setContent = (content) => {
        this.setState({ content: content });
    };

    setTitle = (title) => {
        this.setState({ title: title });
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

    filterNoteByTag = (tag) => {

    }

    deleteNote = () => {
        this.setState({
            notes: this.state.notes.filter(item => item.id !== this.state.note.id)
        })
    }

    updateNote = () => {
        let note = this.state.note;
        note.title = this.state.title;
        note.content = this.state.content;
        updateNoteService(note).then((res) => {
            if (res.code === 0) {
                this.setState({ note: note });
                this.closeEditing();
                message.success("更新成功")
            } else {
                message.error(res.msg);
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });
    }

    searchNote = (values) => {
        queryNoteService(values).then((res) => {
            if (res.code === 0) {
                this.setState({ notes: res.list });
            } else {
                message.error(res.msg);
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("查询失败");
            }
        });
    }

    filterNode = (item) => {
        let search = { "types": [], "tags": [], "title": "", "content": "" };
        search.tags.push(item);
        this.searchNote(search);
    }

    closeDrawer = () => {
        this.setState({ showDrawer: false, });
    };

    render() {
        return (
            <div style={{ backgroundColor: "white" }}>
                <Layout style={{ backgroundColor: "white" }}>
                    {this.state.showDrawer ?
                        <Drawer
                            title="目录"
                            placement="right"
                            closable={true}
                            onClose={this.closeDrawer}
                            visible={this.state.showDrawer}
                            getContainer={false}
                            width="25vw"
                            bodyStyle={{ textAlign: "left" }}
                        >
                            <NoteDirectory showDetail={this.showNoteDetailByDirecctory} />
                        </Drawer>
                        : ""}
                    <Content>
                        <div style={this.state.showNoteDetailPage || this.state.showEditNotePage ? { display: 'none' } : {}}>
                            {/* 查询模块 */}
                            <div style={{ paddingTop: 5, paddingLeft: 5 }}>
                                <Form layout='inline' name="basic" initialValues={{ remember: true }}
                                    onFinish={this.searchNote}
                                    ref={"searchForm"}>
                                    <Form.Item label="分类" name="type"  >
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '130px' }}
                                            placeholder="请选择分类"
                                            options={this.state.allTypes}
                                        />
                                    </Form.Item>
                                    <Form.Item label="标签" name="tags" >
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '130px' }}
                                            placeholder="请选择标签"
                                            options={this.state.allDbTags}
                                        />
                                    </Form.Item>
                                    <Form.Item label="标题" name="title"  >
                                        <Input placeholder="支持模糊查询" />
                                    </Form.Item>
                                    <Form.Item label="内容" name="content"  >
                                        <Input placeholder="支持模糊查询" />
                                    </Form.Item>
                                    <Form.Item  >
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                    </Form.Item>
                                    <Form.Item >
                                        <Button htmlType="reset">重置</Button>
                                    </Form.Item>
                                </Form>

                            </div>
                            {/* tag展示模块 */}
                            <div style={{ paddingTop: 5, paddingLeft: 5 }}>
                                <List
                                    grid={{
                                        gutter: 2,
                                        xs: 10,
                                        sm: 15,
                                        md: 15,
                                        lg: 15,
                                        xl: 15,
                                        xxl: 20,
                                    }}
                                    // pagination={{pageSize: 20}}
                                    dataSource={this.state.allTags}
                                    renderItem={(item, index) => {
                                        if (item == null || item == "") {
                                            return null;
                                        }
                                        return <List.Item>
                                            <a onClick={() => this.filterNode(item)}>
                                                <Tag color={tagColors[index % tagColors.length]}>{item}</Tag></a>
                                        </List.Item>
                                    }}
                                />
                            </div>
                            {/* 笔记列表模块 */}
                            <div style={{ border: "1px solid #ddd" }}>
                                <List
                                    style={{ textAlign: "left", padding: "1px 20px", }}
                                    itemLayout="vertical"
                                    // size="large"
                                    pagination={{ pageSize: 5 }}
                                    dataSource={this.state.notes}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.title}
                                            actions={[
                                                <IconText icon={StarOutlined} text={item.star} key="list-vertical-star-o" />,
                                                <IconText icon={LikeOutlined} text={item.thumbUp} key="list-vertical-like-o" />,
                                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                            ]}
                                            extra={
                                                item.cover === null || item.cover.length === 0 ? '' :
                                                    <img
                                                        height={200}
                                                        alt="logo"
                                                        src={item.cover}
                                                    />
                                            }
                                        >
                                            <List.Item.Meta
                                                title={
                                                    <Button type="link" size="large" style={{ color: "black", paddingLeft: "0px" }} onClick={() => this.showDetail(item)} >
                                                        <strong>{item.title}</strong>
                                                    </Button>
                                                }
                                                description={
                                                    item.tags.split(',').map((tag, index) => {
                                                        if (tag == null || tag == "" || tag == ' ') {
                                                            return "";
                                                        }
                                                        return <Tag color={tagColors[index % tagColors.length]}>{tag}</Tag>
                                                    })
                                                }
                                            />
                                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                                {item.content}
                                            </Paragraph>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                        {this.getNoteDetail()}
                        {this.getEditNotePage()}
                    </Content>
                    <Sider style={{ backgroundColor: "white" }}>
                        <div style={{ textAlign: "left", marginLeft: 20 }}>
                            <a onClick={() => this.setState({ showDrawer: true })}>目录</a>
                        </div>
                        <NoteDirectory showDetail={this.showNoteDetailByDirecctory} />
                    </Sider>
                </Layout>
            </div>
        );
    }
}

export default MyNotesPage;