import React, {Component} from "react";
import 'antd/dist/antd.css';
import {Avatar, Button, Card, Input, List, message, Space, Table} from "antd";
import {deleteMessage, readMessage, sendMessage} from "../../../services/messageService";
import {joinTeamService} from "../../../services/teamService";
import {showError, showSuccess} from "../../../services/notificationService";
import {JOIN_OPERATION, NOTIFICATION_OPERATION} from "../../../constants";
import {parseName} from "../../../services/Utils";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Tag from "antd/es/tag";
import '../../../styles/Main/Message/Message.css'

class MessageBox extends Component {
    state = {
        selectedContent: [],
        searchText: '',
        searchedColumn: '',
        filteredInfo: null,
        sortedInfo: null,
        selectedRowKeys: []
    };

    onAccept = (team, from_email, msgId) => {
        joinTeamService(team.teamId,from_email).then((res) => {
            if(res.code === 0) {
                console.log("Join success!");
                let body = {
                    from_name: this.props.userInfo.username,
                    operation: NOTIFICATION_OPERATION,
                    from_email: this.props.userInfo.email,
                    to_email: from_email,
                    content: "Welcome to " + team.teamName + "!",
                    data: JSON.stringify({})
                };
                sendMessage(body).then((res) => {
                    console.log(res)
                }).catch((err) => {
                    console.log(err);
                    if (err === 302) {
                        this.props.onSessionExpired();
                    } else {
                        showError("Failed to send request");
                    }
                });
                deleteMessage(msgId).then((res) => {
                    this.props.initMessages();
                    console.log("suceess rejected");
                    message.success("Successfully joined");
                }).catch((err) => {
                    showError("can not delete this request")
                });

            }else{
                message.error(res.msg)
            }

            // alert("Successfully joined !")
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to join");
            }
        });
    };

    onReject = (team, from_email, msgId) => {
        deleteMessage(msgId).then((res) => {
            this.props.initMessages();
            let body = {
                from_name: this.props.userInfo.username,
                operation: NOTIFICATION_OPERATION,
                from_email: this.props.userInfo.email,
                to_email: from_email,
                content: "Sorry, your request has been rejected.",
                data: JSON.stringify({})
            };
            sendMessage(body).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to send request");
                }
            });
            showSuccess("This request has beed rejected")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to reject");
            }
        })
    };

    removeByMsgId = (msgId) => {
        let {selectedContent, selectedRowKeys} = this.state;
        let selectedContentCopy = selectedContent.slice();
        let selectedRowKeysCopy = selectedRowKeys.slice();
        for (let i = 0; i < selectedContentCopy.length; i++) {
            let cur = selectedContentCopy[i];
            if (cur.id === msgId) {
                selectedContentCopy.splice(i,1);
                let idx = selectedRowKeysCopy.indexOf(msgId);
                selectedRowKeysCopy.splice(idx,1);
            }
        }
        this.setState({selectedContent: selectedContentCopy, selectedRowKeys: selectedRowKeysCopy});
    };
    onDeleteMsg = (msgId) => {
        deleteMessage(msgId).then((res) => {
            this.props.initMessages();
            this.removeByMsgId(msgId);
            showSuccess("Successfully deleted this message")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to delete message");
            }
        })
    };
    onReadMsg = (msgId) => {
        console.log(msgId)
        readMessage(msgId).then((res) => {
            this.props.initMessages();
            this.removeByMsgId(msgId);
            showSuccess("Successfully read this message")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to read message");
            }
        })
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

    onRowSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, selectedContent: selectedRows});
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    deleteAllMsg = () => {
        const { selectedContent } = this.state;
        for (let i = 0; i < selectedContent.length; i++) {
            if (selectedContent[i].operation === JOIN_OPERATION) {
                showError("You can not delete join request, please resolve it");
                continue;
            }
            this.onDeleteMsg(selectedContent[i].id)
        }
    };

    readAllMsg = () => {
        const { selectedContent } = this.state;
        console.log(selectedContent)
        for (let i = 0; i < selectedContent.length; i++) {
            if (selectedContent[i].operation === JOIN_OPERATION) {
                showError("You can not read join request, please resolve it");
                continue;
            }
            this.onReadMsg(selectedContent[i].id)
        }
    };

    onSelected = () => {
        console.log("as")
        if (this.state.selectedContent.length === 0) {
            return <div/>
        } else {
            return (
                <div>
                    <Button type={"danger"} className={"delete-all-btn"} onClick={this.deleteAllMsg}>Delete All</Button>
                    <Button type={"dashed"} className={"read-all-btn"} onClick={this.readAllMsg}>Mark all as read</Button>
                </div>
            );
        }
    };

    render() {
        const { messageList } = this.props;

        let { sortedInfo, filteredInfo, selectedRowKeys } = this.state;
        console.log(selectedRowKeys)
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onRowSelectionChange
        };
        const columns = [
            {
                title: 'From',
                dataIndex: 'from_name',
                key: 'from_name',
                ...this.getColumnSearchProps('from_name'),
            },
            {
                title: 'Content',
                dataIndex: 'content',
                key: 'content',
                ...this.getColumnSearchProps('content'),
            },

            {
                title: 'Time',
                dataIndex: 'create_time',
                key: 'create_time',
                sorter: (a, b) => new Date(a.updateTime) - new Date(b.updateTime),
                sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Status',
                dataIndex: 'status_code',
                key: 'status_code',
                filters: [
                    { text: 'Read', value: '2' },
                    { text: 'Unread', value: '0' },
                ],
                filteredValue: filteredInfo.status_code || null,
                onFilter: (value, record) => (record.status_code + '').includes(value),
                ellipsis: true,
                render: (text, item) => {
                    return item.operation === JOIN_OPERATION ? <Tag color="gold">Pending</Tag> : item.status_code === 0 ? <Tag color="red">Pending</Tag> : <Tag color="lime">read</Tag>
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, item) => {
                    return item.operation === JOIN_OPERATION ?
                        <Space>
                            <a onClick={() => this.onAccept(JSON.parse(item.data), item.from_email, item.id)}>
                                Accept
                            </a>
                            <a onClick={() => this.onReject(JSON.parse(item.data), item.from_email, item.id)}>
                                Reject
                            </a>
                        </Space> :
                        item.status_code === 0 ?
                                <Space>

                                    <a onClick={() => this.onReadMsg(item.id)}>
                                        Read
                                    </a>
                                    <a onClick={() => this.onDeleteMsg(item.id)}>
                                        Delete
                                    </a>
                                </Space> :
                                <Space>
                                    <a onClick={() => this.onDeleteMsg(item.id)}>
                                        Delete
                                    </a>
                                </Space>
                },
            },
        ];
        return (
            <div>
                {this.onSelected()}
                <Table style = {{"position": "fixed", "top" : "100px"}}
                       rowSelection={rowSelection}
                       columns={columns}
                       dataSource={messageList}
                       onChange={this.handleChange}
                />
            </div>
        );
    }
}
export default MessageBox;