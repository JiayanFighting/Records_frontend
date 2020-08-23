import React from 'react';
import {Layout, Button,message,Table,Select, Popconfirm, Form,DatePicker, InputNumber,Row,Col,Space,Tag} from "antd";
import 'antd/dist/antd.css';
import moment from 'moment';
import {createSprintItemService,deleteSprintService,updateSprintItemService} from '../../../services/sprintService'
import '../../../styles/Main/TeamManagement/SprintPage.css';
import Modal from '../HelperComponents/Modal'

const { RangePicker } = DatePicker;
class SprintPage extends React.Component {

    state={
        teamId:this.props.teamId,
        sprints:this.props.sprints,
        showEditPage:false,
        editSprint:[],
        columns:[
            {
              title: 'Sprint',
              dataIndex: 'sprint',
              key: 'sprint',
              editable: true,
              defaultSortOrder: 'descend',
              sorter: (a, b) => a.sprint - b.sprint,
            //   filters: [
            //     { text: 'Current', value: 'Current' },
            //     { text: 'Upcoming', value: 'Upcoming' },
            //     { text: 'Expired', value: 'Expired' },
            //   ],
            //   onFilter: (value, record) => this.sprintFilter(value,record),
            //   render: (text, record) => {
            //     const tag = this.getSprintTag(record);
            //     if(tag.text === "Current"){
            //         return (
            //             <span>
            //                 <Tag color={tag.color}>{tag.text}</Tag>
            //                 {text}
            //             </span>
            //         ) 
            //     }else{
            //         return text
            //     }
            //     return (
            //         <span>
            //             <Tag color={tag.color}>{tag.text}</Tag>
            //             {text}
            //         </span>
            //     ) 
            //   },
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                editable: true,
                filters: [
                    { text: 'Weekly', value: 'weekly' },
                    { text: 'Monthly', value: 'monthly' },
                    { text: 'Daily', value: 'daily' },
                  ],
                onFilter: (value, record) => record.type.includes(value),
            },
            {
              title: 'Start',
              dataIndex: 'beginTime',
              key: 'beginTime',
              editable: true,
              sorter: (a, b) => Date.parse(new Date(a.beginTime)) - Date.parse(new Date(b.beginTime)),
            },
            {
                title: 'End',
                dataIndex: 'endTime',
                key: 'endTime',
                editable: true,
                sorter: (a, b) => Date.parse(new Date(a.endTime)) - Date.parse(new Date(b.endTime)),
            },
            {
                title: 'Tag',
                dataIndex: 'sprint',
                key: 'sprint',
                editable: true,
                defaultSortOrder: 'descend',
                // sorter: (a, b) => a.sprint - b.sprint,
                filters: [
                  { text: 'Current', value: 'Current' },
                  { text: 'Upcoming', value: 'Upcoming' },
                  { text: 'Expired', value: 'Expired' },
                ],
                onFilter: (value, record) => this.sprintFilter(value,record),
                render: (text, record) => {
                  const tag = this.getSprintTag(record);
                  return (
                      <span>
                          <Tag color={tag.color}>{tag.text}</Tag>
                      </span>
                  ) 
                },
              },
            {
              title: 'Action',
              key: 'action',
              render: (_, record,) => {
                return (
                    <span>
                    <a onClick={() => this.onEditPage(record)} style={{ marginRight: 8 }}>
                        Edit
                    </a>
                    <Popconfirm title="Sure to Delete?" onConfirm={() => this.deleteSprint(record)}>
                      <a>Delete</a>
                    </Popconfirm>
                  </span>
                );
              },
            },
        ],
        
    };


    /**
     * filter the sprint by different tags
     * @param {*} value 
     * @param {*} record 
     */
    sprintFilter=(value,record)=>{
        let cur = moment().format('YYYY-MM-DD')
        if (cur >= record.beginTime && cur <= record.endTime) {
            if(value === "Current"){
                return true;
            }
        }else if (cur <= record.beginTime) {
            if(value === "Upcoming"){
                return true;
            }
        }else{
            if(value === "Expired"){
                return true;
            }
        }
        return false;
    };

    /**
     * get the sprint tag through the date
     * @method getSprintTag
     * @param record: current sprint info
     * @for SprintPage
     * @return none
     */
    getSprintTag=(record)=>{
        let cur = moment().format('YYYY-MM-DD')
        let tag =[];
        if (cur >= record.beginTime && cur <= record.endTime) {
            tag.color = "blue";
            tag.text = "Current";
        }else if (cur <= record.beginTime) {
            tag.color = "green";
            tag.text = "Upcoming";
        }else{
            tag.color = "gray";
            tag.text = "Expired";
        }
        return tag;
    };

    /**
     * show the edit sprint modal and carry the data
     * @method onEditPage
     * @param record: current sprint info
     * @for SprintPage
     * @return none
     */
    onEditPage=(record)=>{
        this.setState({
            showEditPage:true,
            editSprint:record,
        })
    };

    /**
     * close the modal for editing
     * @method exitEditPage
     * @for SprintPage
     * @return none
     */
    exitEditPage=()=>{
        this.setState({showEditPage:false})
    };

    /**
     * add sprint
     * @method handleAdd
     * @param values: new report info
     * @for SprintPage
     * @return none
     */
    handleAdd = (values) => {
        let beginTime = values.date === undefined ? moment().format('YYYY-MM-DD') : values.date[0].format('YYYY-MM-DD');
        let endTime = values.date === undefined ? moment().add(7, 'days').format('YYYY-MM-DD') : values.date[1].format('YYYY-MM-DD');
        let type = values.type === undefined ? "weekly" : values.type;
        const {sprints } = this.state;
        let sprintItem = {
            teamId:this.props.teamId,
            type:type,
            sprint:values.sprint,
            beginTime: beginTime,
            endTime: endTime,
        };
        createSprintItemService(sprintItem).then((res) => {
            if(res.code === 0){
                message.success("Successfully !");
                let newSprintItem = sprintItem;
                newSprintItem.id = res.id;
                this.setState({
                    sprints: [...sprints, newSprintItem],
                });
            }else{
                message.error("Failed! Please check that the sprint has been created or that the parameters are correct")
            }
        }).catch((err) => {
            message.error("Failed!");
        });
    };

    /**
     * delete sprint
     * @method deleteSprint
     * @param record: row data contains sprint info
     * @for SprintPage
     * @return none
     */
    deleteSprint=(record)=>{
        deleteSprintService(record.id).then((res) => {
            const sprints = [...this.state.sprints];
            this.setState({
                sprints: sprints.filter(item => item.id !== record.id),
            });
            message.success("Successfully deleted!")
        }).catch((err) => {
            message.error("Failed!");
        });
    };

    /**
     * update sprint
     * @method updateSprint
     * @param sprintItem: new sprint info
     * @for SprintPage
     * @return none
     */
    updateSprint=(sprintItem)=>{
        sprintItem.id = this.state.editSprint.id;
        if(sprintItem.date !== undefined){
            let beginTime = sprintItem.date[0].format('YYYY-MM-DD');
            let endTime = sprintItem.date[1].format('YYYY-MM-DD');
            sprintItem.beginTime = beginTime;
            sprintItem.endTime = endTime;
        }
        updateSprintItemService(sprintItem).then((res) => {
            if(res.code === 0){
                message.success("Successfully updated!");
                // update table data
                const newData = [...this.state.sprints];
                const index = newData.findIndex(item => sprintItem.id === item.id);
                let newRow = this.state.editSprint;
                if(sprintItem.date !== undefined){
                    newRow.beginTime = sprintItem.beginTime;
                    newRow.endTime = sprintItem.endTime;
                }
                if(sprintItem.type !== undefined){
                    newRow.type = sprintItem.type;
                }
                if(sprintItem.sprint !== undefined){
                    newRow.sprint = sprintItem.sprint;
                }
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...newRow });
                    this.setState({
                        sprints:newData,
                    });
                } else {
                    newData.push(newRow);
                    this.setState({
                        sprints:newData,
                    });
                }
            }else{
                message.error("Failed! Please check that the sprint has been created or that the parameters are correct");
            }
            
        }).catch((err) => {
            message.error("Failed!");
        });
        this.exitEditPage();
    };
    
    render() {
        return (
            <Layout style={{background:"white"}}>
                <div>
                    <Form
                        onFinish={this.handleAdd}
                        onFinishFailed={this.onFinishFailed}
                        layout="inline"
                        style={{margin:10}}
                    >
                        <Form.Item label="Sprint" name={"sprint"}  rules={[{ type: 'number', min: 1 },{ required: true}]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Type" name={"type"}>
                            <Select defaultValue="weekly" style={{"minWidth" : "100px"}}>
                                <Select.Option value="weekly">weekly</Select.Option>
                                <Select.Option value="monthly">monthly</Select.Option>
                                <Select.Option value="daily">daily</Select.Option>
                            </Select>
                        </Form.Item>
                        
                        <Form.Item label="Date Range" name="date" >
                            <RangePicker defaultValue={[moment(),moment().add(7, 'days')]} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create a New Sprint
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Table
                    bordered
                    dataSource={this.state.sprints}
                    columns={this.state.columns}
                    rowClassName="editable-row"
                    pagination={{
                    onChange: this.cancel,
                    pageSize:5,
                    }}
                    locale={{
                        emptyText:"The team don't have any sprints yet, try creating one!"}}
                />

                {/* Edit Sprint Modal */}
                <div >
                    <Modal show={this.state.showEditPage}
                        showOk={false}
                        showCancel={false}
                        handleCancel={this.exitEditPage}
                        title="Edit"
                    >
                    <Row type={"flex"} justify={"center"} align={"top"} style={{width:600}}>
                        <Col span={24}>
                            <Form 
                            labelCol={ {span: 8} }
                            wrapperCol={ {span: 12} }
                            name="nest-messages" 
                            onFinish={this.updateSprint}
                            >
                                <Form.Item  name="sprint" label="Sprint" rules={[{ type: 'number', min: 1 }]}
                                initialValue={this.state.editSprint.sprint}
                                >
                                    <InputNumber placeholder={this.state.editSprint.sprint}/>
                                </Form.Item>
                                <Form.Item name="type" label="Type">
                                    <Select defaultValue={this.state.editSprint.type} style={{"min-width" : "100px"}}>
                                        <Select.Option value="weekly">weekly</Select.Option>
                                        <Select.Option value="monthly">monthly</Select.Option>
                                        <Select.Option value="daily">daily</Select.Option>
                                    </Select>
                                </Form.Item>
                                
                                <Form.Item label="Date Range" name="date" >
                                    <RangePicker defaultValue={[moment(this.state.editSprint.beginTime, 'YYYY-MM-DD'), moment(this.state.editSprint.endTime, 'YYYY-MM-DD')]} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                                    <Space size={100}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button onClick={this.exitEditPage}>
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    </Modal>
                </div>
            
            </Layout>
            
        );
    }
}

export default SprintPage;