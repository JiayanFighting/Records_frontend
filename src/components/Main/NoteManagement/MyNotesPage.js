import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { List, Avatar, Space, message, Tag, Typography, Button} from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined,DoubleLeftOutlined } from '@ant-design/icons';
// CSS
import '../../../styles/Main/ReportManagement/ReportManagement.css';
// components
import NoteItem from './NoteItem';
// services
import {getNotesListService,updateNoteService} from "../../../services/noteService";
// const
import { IMAGE_ROOT } from '../../../constants';
import WriteBoard from '../WriteManagement/WriteBoard';
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
        showEditNotePage:false,
        allTags:[],
        content:"",
        title:"",
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

    closeEditing=()=>{
        this.setState({showNoteDetailPage:true,showEditNotePage:false});
    }

    getNoteDetail=()=>{
        if(this.state.showNoteDetailPage) {
            return (
                <NoteItem 
                    note = {this.state.note} 
                    closeDetail={this.closeDetail} 
                    deleteNote={this.deleteNote}  
                    editNote={this.onEditing}
                    visitor={this.props.visitor}
                />
            );
        }
    }

    onEditing=()=>{
        this.setState({
            content:this.state.note.content,
            title:this.state.note.title,
            showEditNotePage:true,
            showNoteDetailPage:false
        })
    }

    getEditNotePage=()=>{
        if(this.state.showEditNotePage){
            return(
                <div>
                    <a onClick={()=>this.closeEditing()}><DoubleLeftOutlined />返回</a>
                    <Button type ="primary" onClick={()=>this.updateNote()}>更新</Button>
                    <WriteBoard 
                        setContent={this.setContent.bind(this)}
                        setTheme={this.setTitle.bind(this)}
                        content={this.state.content}
                        theme={this.state.title}
                        insertPhotoUrl = {this.insertPhotoUrl}
                        saveDraft = {this.saveDraft}
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
        console.log("Image Path="+IMAGE_ROOT+ url )
        this.setState({ content: content });
    };

    saveDraft = (content) => {
    }

    filterNoteByTag=(tag)=>{

    }

    deleteNote=()=>{
        this.setState({
            notes:this.state.notes.filter(item => item.id !== this.state.note.id)
        })
    }

    updateNote=()=>{
        let note = this.state.note;
        note.title = this.state.title;
        note.content = this.state.content;
        updateNoteService(note).then((res) => {
            console.log(res)
            if(res.code === 0){
                this.setState({note:note});
                this.closeEditing();
                message.success("更新成功")
            }else{
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

    render() {
        return (
           <div style={{backgroundColor:"white"}}>
               <div style={this.state.showNoteDetailPage||this.state.showEditNotePage?{display:'none'}:{}}>
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

                {this.getEditNotePage()}
           </div>
        );
    }
}

export default MyNotesPage;