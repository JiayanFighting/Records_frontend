import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { List, Avatar, Space, message, Tag, Typography} from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined,UserOutlined } from '@ant-design/icons';
// CSS
import '../../../styles/Main/ReportManagement/ReportManagement.css';
// components
import NoteItem from './NoteItem';
// services
import {getNotesListService} from "../../../services/noteService";
// const
import { IMAGE_ROOT } from '../../../constants';
const { Paragraph } = Typography;
const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

const tagColors = ["blue","red","geekblue","purple","magenta","volcano","orange","gold","lime","green","cyan"];

class MyNotesPage extends Component {
    state={
        notes:[],
        note:[],
        showNoteDetailPage:false,
        allTags:[],
    }
    componentDidMount(){
        getNotesListService(this.props.userInfo.id).then((res) => {
            console.log(res)
            if(res.code === 0){
                this.setState({notes:res.list});
                this.getAllTags();
            }else{
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

    getAllTags=()=>{
        let tagset = new Set()
        this.state.notes.forEach((item)=>{
            let itags = item.tags;
            itags.split(";").map((tag)=>{
                console.log(tag);
                tagset.add(tag);
            });
        });
        this.setState({allTags:tagset});
    }

    showDetail=(item)=>{
        this.setState({showNoteDetailPage:true,note:item});
    }

    closeDetail=()=>{
        this.setState({showNoteDetailPage:false,note:[]});
    }

    getNoteDetail=()=>{
        if(this.state.showNoteDetailPage) {
            return (
                <NoteItem note = {this.state.note} closeDetail={this.closeDetail} deleteNote={this.deleteNote}  visitor={this.props.visitor}></NoteItem>
            );
        }
    }

    filterNoteByTag=(tag)=>{

    }

    deleteNote=()=>{
        this.setState({
            notes:this.state.notes.filter(item => item.id !== this.state.note.id)
        })
    }

    render() {
        return (
           <div style={{backgroundColor:"white"}}>
               <div style={this.state.showNoteDetailPage?{display:'none'}:{}}>
                   <div style={{paddingTop:5,paddingLeft:5}}>
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
                        renderItem={(item,index) => (
                        <List.Item>
                            <Tag color={tagColors[index%tagColors.length]}>{item}</Tag>
                        </List.Item>
                        )}
                    />
                   </div>
                    <List
                        style={{textAlign:"left",padding:"2px 20px",}}
                        itemLayout="vertical"
                        // size="large"
                        pagination={{pageSize: 5}}
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
                            item.cover === null || item.cover.length ===0?'':
                            <img
                                height={200}
                                alt="logo"
                                src={item.cover}
                            />
                            }
                        >
                            <List.Item.Meta
                            // 我的笔记 不需要头像
                            // avatar={this.props.userInfo.avatar === null || this.props.userInfo.avatar.length === 0?
                            //     <Avatar icon={<UserOutlined />} />:
                            //     <Avatar src={IMAGE_ROOT+this.props.userInfo.avatar} />
                            // }
                            title={<a onClick={()=>this.showDetail(item)}><h3>{item.title}</h3></a>}
                            description={
                                item.tags.split(';').map((tag,index)=>{
                                    return <Tag color={tagColors[index%tagColors.length]}>{tag}</Tag>
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

                {this.getNoteDetail()}
           </div>
        );
    }
}

export default MyNotesPage;