import React, {Component} from 'react';
import {Card,Layout,List,Select, Row, Col, Button,message,Form, Tag,Popconfirm} from "antd";
import { EditOutlined, DoubleLeftOutlined, DeleteOutlined} from '@ant-design/icons';
import {createTemplateService,deleteTemplateService,updateTemplateService,getTemplatesInTeamService,searchTemplatesService} from '../../../services/templateService'
import 'antd/dist/antd.css';
import marked from "marked";
import WriteAndViewBoard3 from "../WriteAndViewBoard3/WriteAndViewBoard3";
import {showError} from "../../../services/notificationService";


const { Option } = Select;


class TemplatePage extends Component {

    state={
        teamId:this.props.teamId,
        templates:this.props.templates,
        editTemplate:[],
        showEditPage:false,
        showCreatePage:false,
        searchType:"weekly",
        content:"",
        theme: "",
    }

    getTemplates=()=>{
        getTemplatesInTeamService(this.state.teamId).then((res) => {
            this.setState({
                templates:res.templates
            })
        }).catch((err) => {
            message.error("Failed!");
        });
    }

    /**
     * show editing the template page and carry the data
     * @param {} template 
     */
    showEditTemplate=(template)=>{
        this.setState({
            editTemplate:template,
            theme:template.theme,
            showEditPage:true,
            content:template.content,
        })
    }

    /**
     * exit editing page
     */
    exitEditPage=()=>{
        this.setState({
            showEditPage:false,
        })
    }

    /**
     * show creating page and init the content and theme
     */
    showCreateTemplate=()=>{
        this.setState({
            showCreatePage:true,
            content:"",
            theme:"",
        })
    }

    /**
     * exit the create page
     */
    exitCreatePage=()=>{
        this.setState({
            showCreatePage:false,
        })
    }

    /**
     * handle deleting template
     */
    handleOkDelete = (id) => {
        deleteTemplateService(id).then((res) => {
           message.success("Successfully deleted ! ")
           let leftTemplate = []
           this.state.templates.forEach(template => {
               if(template.id !== id) {
                   leftTemplate.push(template)
               }
           });
           this.setState({templates:leftTemplate})
        }).catch((err) => {
            showError("Failed to delete!");
        });
      };

    setContent = (content) => {
        this.setState({content:content});
    }

    /**
     * handle updating template
     * @param {*} values 
     */
    updateTemplate=(values)=>{
        if(this.state.theme === undefined || this.state.theme === ''){
            message.error("Please input the title!");
            return;
        }
        let template = {
            id:this.state.editTemplate.id,
            teamId: this.state.teamId,
            content:this.state.content,
            theme:this.state.theme,
            type:values.template.type,
        };
        updateTemplateService(template).then((res) => {
            if(res.code === 0) {
                message.success("Successfully updated!")
                this.setState({
                    showEditPage:false,
                    editTemplate:[],
                })
                this.getTemplates();
            }else{
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
    createTemplate=(values)=>{
        values.template.type = values.template.type === undefined? "weekly":values.template.type;
        if(this.state.theme === undefined || this.state.theme === ''){
            message.error("Please input the title!");
            return;
        }
        let template = {
            teamId: this.state.teamId,
            type:values.template.type,
            theme:this.state.theme,
            content:this.state.content,
        };
        createTemplateService(template).then((res) => {
            if(res.code === 0) {
                message.success("Successfully created!")
                this.setState({
                    showCreatePage:false,
                    editTemplate:[],
                })
                this.getTemplates();
            }else{
                message.error("Failed to create!")
            }
        }).catch((err) => {
            message.error("Failed to create!")
        });
    }

    onChangeSearch=(value)=> {
        this.setState({
            searchType:value
        })
    }

    /**
     * search template by type
     */
    searchTemplate=()=>{
        searchTemplatesService(this.state.teamId,this.state.searchType).then((res) => {
            if(res.code === 0) {
                this.setState({
                    templates:res.templates
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    setTheme = (theme) => {
        this.setState({theme:theme});
    }

    render() {
        //markdown to html
        const renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
        return `<a target="_blank" rel="noopener noreferrer" href="${ href }" title="${ title }">${ text }</a>`;
        };
        return (
            <Layout style={{background:"white"}}>
                {/* List the templates */}
                <div style={!this.state.showEditPage && !this.state.showCreatePage ? {} : {'display': 'none'}}>
                    {/* Search and create section */}
                    <Row style={{margin:10}}>
                        <Col span={2}>
                        Type:
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
                            <Button type="primary" onClick={this.searchTemplate}>Search</Button>
                        </Col>
                        <Col span={6} offset={8}>
                            <Button type="primary" onClick={this.showCreateTemplate}>Create A New Template</Button>
                        </Col>
                    </Row>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={this.state.templates}
                        pagination={{
                            pageSize: 4,
                            size:"small",
                        }}
                        locale={{emptyText:"The team don't have any templates yet, try creating one!"}}
                        renderItem={item => (
                        <List.Item>
                            <Row>
                            <Card title={item.theme}
                            style={{width:"25vw"}}
                            actions={[
                                <Popconfirm title="Sure to Delete?" onConfirm={() => this.handleOkDelete(item.id)}>
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>,
                                <EditOutlined key="edit" 
                                onClick= {()=>this.showEditTemplate(item) }
                                />,
                            ]}
                            >
                                {/* type: {item.type} */}
                                <Tag color="blue">{item.type}</Tag>
                                <div
                                    style={{ "textAlign": "left" ,height:250,background:"white",overflow:"scroll",padding:10,"marginTop":10}}
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

                {/* Edit Template Page */}
                {this.state.showEditPage ? <div>
                    <Col span={4}>
                        <a  onClick={()=>{this.exitEditPage()}}><DoubleLeftOutlined/>Back to template list</a>
                    </Col>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 8} }
                            onFinish={this.updateTemplate}>
                                <Form.Item name={['template', 'type']} label="Type">
                                    <Select
                                        showSearch
                                        style={{ width: "15vw" }}
                                        placeholder={this.state.editTemplate.type}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="weekly">Weekly</Option>
                                        <Option value="monthly">Monthly</Option>
                                        <Option value="daily">Daily</Option>
                                    </Select>
                                </Form.Item>

                                <WriteAndViewBoard3
                                    setContent={this.setContent.bind(this)}
                                    content={this.state.content}
                                    defaultText={"defaultText"}
                                    setTheme={this.setTheme.bind(this)}
                                    theme={this.state.theme}
                                    // sprintObj={this.props.sprintObj}
                                    teamInfo={this.props.teamInfo}
                                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                                    // insertPhotoUrl = {this.insertPhotoUrl}
                                    // saveDraft = {this.saveDraft}
                                    hideSomeFunctions={true}
                                />
                                <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                                        <Button type="primary" htmlType="submit">
                                            Save Changes
                                        </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
                : <div></div>}

                {/* Create Template Page */}
                {this.state.showCreatePage ? <div>
                    <Col span={4}>
                        <a  onClick={()=>{this.exitCreatePage()}}><DoubleLeftOutlined/>Back to template list</a>
                    </Col>
                    <Row type={"flex"} justify={"center"} align={"top"}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 8} }
                            onFinish={this.createTemplate}>
                                <Form.Item name={['template', 'type']} label="Type">
                                    <Select
                                        showSearch
                                        style={{ width: "15vw" }}
                                        placeholder="Select The Type"
                                        defaultValue="weekly"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="weekly">weekly</Option>
                                        <Option value="monthly">monthly</Option>
                                        <Option value="daily">daily</Option>
                                    </Select>
                                </Form.Item>

                                <WriteAndViewBoard3
                                    setContent={this.setContent.bind(this)}
                                    content={this.state.content}
                                    defaultText={"defaultText"}
                                    setTheme={this.setTheme.bind(this)}
                                    theme={this.state.theme}
                                    // sprintObj={this.props.sprintObj}
                                    teamInfo={this.props.teamInfo}
                                    // onShowReportsInThePastClicked = {this.onShowReportsInThePastClicked}
                                    // insertPhotoUrl = {this.insertPhotoUrl}
                                    // saveDraft = {this.saveDraft}
                                    hideSomeFunctions={true}
                                />

                                <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
                : <div></div>}

            </Layout>
            
        );
    }
}

export default TemplatePage;