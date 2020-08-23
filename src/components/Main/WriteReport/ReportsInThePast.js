import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import {AutoComplete, Button,  DatePicker, Form, Input, Select, Space, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import marked from "marked";
import Modal from "../HelperComponents/Modal";


const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    return `<a target="_blank" href="${href}">${text}` + "</a>";
};
class ReportsInThePast extends Component {
    state = {
        searchText: '',
        searchedColumn: '',
        filteredInfo: null,
        sortedInfo: null,
        showDetailsModal: false,
        fullReport: "",
        report: {}
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
        this.setState({
            showDetailsModal: true,
            fullReport: record.content,
            report: record
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

    handleReplace = (record) => {
        this.props.handleReplace(record);
    };

    render() {
        const { data } = this.props;

        let { sortedInfo, filteredInfo, showDetailsModal } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {
                title:'Team',
                dataIndex:'teamName',
                key:'teamName',
                ...this.getColumnSearchProps('teamName'),
                ellipsis: true,
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
                title:'Sprint',
                dataIndex:'sprint',
                key:'sprint',
                ...this.getColumnSearchProps('sprint'),
                ellipsis: true,
            },
            {
                title: 'Title',
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
                    <Space>
                        <a onClick={() => {this.showDetails(record)}}>view</a>
                        <a onClick={() => {this.handleReplace(record)}}>replace</a>
                    </Space>
                ),
            },
        ];
        return (
            <div>
                <Table style = {{"width": "60vw"}}
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
                </Modal>
            </div>
        );
    }
}

export default ReportsInThePast;