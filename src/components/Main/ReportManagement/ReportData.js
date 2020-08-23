import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import {AutoComplete, Button,  DatePicker, Form, Input, Select, Space, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import marked from "marked";
import Modal from "../HelperComponents/Modal";
import moment from 'moment';
import FileSaver from 'file-saver';
import PrintPage from './PrintPage';
import ReactToPrint from 'react-to-print';
import {getSprintService} from "../../../services/sprintService.js";

const { RangePicker } = DatePicker;
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    return `<a target="_blank" href="${href}">${text}` + "</a>";
};
class ReportData extends Component {
    state = {
        selectedContent: [],
        searchText: '',
        searchedColumn: '',
        filteredInfo: null,
        sortedInfo: null,
        showDetailsModal: false,
        needUpdate:false,
        fullReport: "",
        report:[],
        sprintObj:{},
        userEmail:this.props.userEmail,
        role:!this.props.isSender,
    };

    // 点击下载
    download = () => {
        let content = this.state.fullReport;
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        let title = this.state.report.theme===null||this.state.report.theme.length===0?"Report":this.state.report.theme;
        FileSaver.saveAs(blob, title+".md");
    };

    update = () => {
        this.props.handleUpdate(this.state.report,this.state.sprintObj);
    };

    onSubmit = (values) => {
        this.props.onSearchReports(values);
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    showDetails = (record) => {
        let teamId = record.teamId;
        let sprint = record.sprint;
        let type = record.type;
        let findTeam = this.props.teamMapData[record.teamName];
        getSprintService(teamId,sprint,type).then((res)=>{
            let cur = moment().format('YYYY-MM-DD');
            if(res.res.statusCode === 0 && cur >= res.res.beginTime && cur <= res.res.endTime && record.fromEmail===this.state.userEmail&&findTeam!==undefined){
                this.setState({
                    showDetailsModal: true,
                    fullReport: record.content,
                    report:record,
                    needUpdate:true,
                    sprintObj:res.res,
                });
            }else{
                console.log(this.state.showDetailsModal);
                this.setState({
                    showDetailsModal: true,
                    fullReport: record.content,
                    report:record,
                    needUpdate:false,
                });
            }
        })
            .catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                }
            });
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleCancel = () => {
        this.setState({showDetailsModal: false})
    };

    onReset = () => {
        this.props.initReportMgt();
    };

    render() {
        const { teamData, role, roleName, data, showSelection } = this.props;
        const rowSelection = {
            onChange: this.props.onRowSelectionChange
        };
        const selection = showSelection === undefined ? undefined : (showSelection ? {rowSelection} : undefined);
        let { sortedInfo, filteredInfo, showDetailsModal } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {
                title: 'Name',
                dataIndex: 'fromName',
                key: 'name',
                ...this.getColumnSearchProps('fromName'),
            },
            {
                title: 'Team',
                dataIndex: 'teamName',
                key: 'team',
                ...this.getColumnSearchProps('teamName'),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                filters: [
                    { text: 'Weekly', value: 'weekly' },
                    { text: 'Monthly', value: 'monthly' },
                ],
                filteredValue: filteredInfo.type || null,
                onFilter: (value, record) => record.type.includes(value),
                ellipsis: true,
            },
            {
                title: 'Sprint',
                dataIndex: 'sprint',
                key: 'sprint',
                ellipsis: true,
            },
            {
                title: 'Theme',
                dataIndex: 'theme',
                key: 'theme',
                ...this.getColumnSearchProps('theme'),
            },
            {
                title: 'Report',
                dataIndex: 'content',
                key: 'report',
                ...this.getColumnSearchProps('content'),
                ellipsis: true,
            },
            {
                title: 'Time',
                dataIndex: 'updateTime',
                key: 'time',
                sorter: (a, b) => new Date(a.updateTime) - new Date(b.updateTime),
                sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Button type={"primary"} onClick={() => {this.showDetails(record)}}>Details</Button>
                ),
            },
        ];
        return (
            <div>
                <div className={"filters"}>
                    <Form
                        onFinish={this.onSubmit}
                        onFinishFailed={this.onFinishFailed}
                        layout="inline"
                        data-tut="tour_reportData_search"
                    >
                        <Form.Item label="Team Name"
                                   name={"teamname"}
                                   rules={[
                                       {
                                        //    required: this.state.role,
                                           message: 'Please input your team name!',
                                       },
                                   ]}
                        >
                            <AutoComplete
                                style={{ width: 100 }}
                                options={teamData}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        </Form.Item>
                        <Form.Item label={role}
                                   name={roleName}
                        >
                            <Input style={{ width: 100 }}/>
                        </Form.Item>

                        <Form.Item label="Type"
                                   name={"type"}
                        >
                            <Select style={{ width: 100 }} allowClear>
                                <Select.Option value="weekly">weekly</Select.Option>
                                <Select.Option value="monthly">monthly</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Sprint"
                                   name={"sprint"}
                                   rules={[
                                       {
                                        //    required: this.state.role,
                                           message: 'Please input your sprint!',
                                       },
                                   ]}
                        >
                            <Input style={{ width: 50 }}/>
                        </Form.Item>

                        <Form.Item label="Date Range"
                                   name="date"
                        >
                            <RangePicker defaultValue={[moment().subtract(7, 'days'), moment()]} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.props.initReportMgt} >Reset</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type={"primary"} disabled={!this.props.IntegrateEnabled} onClick={this.props.handleIntegrationOption} data-tut="tour_reportManagement_aggregate">Aggregate</Button>
                        </Form.Item>
                    </Form>
                </div>
                
                <Table style = {{"padding" : "50px"}}
                       {...selection}
                       columns={columns}
                       dataSource={data}
                       onChange={this.handleChange} />
                <Modal show={showDetailsModal}
                       title={this.state.report.theme}
                       showOk={false}
                       showCancel={false}
                       handleCancel={this.handleCancel}
                >
                    <div
                        className="preview"
                        style={{"text-align": "left",height:500,overflow:"scroll", width: 500}}
                        dangerouslySetInnerHTML={{
                            __html: marked(this.state.fullReport, {
                                renderer: renderer,
                                breaks: true,
                                gfm: true,
                            }),
                        }}
                    >
                    </div>
                    <a style={{marginTop:5,marginRight:5}}>
                        {this.state.needUpdate===false?[]:[<Button type="primary" onClick={this.update}>Update</Button>]}
                    </a>
                    <Button type="primary" style={{marginTop:5,marginRight:5}} onClick={this.download}>
                        Download MD
                    </Button>
                    <ReactToPrint
                    trigger={() => 
                                <Button  type="primary">Download PDF</Button>}
                                content={() => this.componentRef}
                    />
                    <div style={{'display': 'none'}}>
                    <PrintPage report={this.state.report}  ref={el => (this.componentRef = el)} />
                    </div>
                    
                </Modal>
            </div>
        );
    }
}

export default ReportData;