import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Row, Button, Popconfirm, message,BackTop,Dropdown,Menu} from "antd";
import { DeleteOutlined,StarOutlined,LikeOutlined,StarFilled,LikeFilled,DoubleLeftOutlined,
    EditOutlined,UpCircleOutlined,ShareAltOutlined,DownloadOutlined} from '@ant-design/icons';

//services
import {deleteNoteService} from "../../../services/noteService";
import {downloadMD} from "../../../services/downloadService";
//css
import "../../../styles/Main/NoteManagement/NoteItem.css";
//components
import PDFDownload from '../HelperComponents/PDFDownload';
import ViewBoard from '../WriteManagement/ViewBoard';


class NoteItem extends Component {
    state={
        note:this.props.note,
        isStared:false,
        isLiked:false,
        isEditing:false,
    }
    componentDidMount(){
        
    }

    deleteNote = () =>{
        console.log(this.props.note);
        deleteNoteService(this.props.note.id).then((res) => {
            this.props.deleteNote();
            this.props.closeDetail();
            message.success("删除成功");
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("删除失败");
            }
        });
    }

    changeStar=()=>{
        this.setState({isStared:!this.state.isStared});
    }

    changeLike=()=>{
        this.setState({isLiked:!this.state.isLiked});
    }

    

    render() {
        return (
           <div style={{backgroundColor:"white",paddingLeft:30,textAlign:"left"}}>
               <a onClick={()=>this.props.closeDetail()}><DoubleLeftOutlined />返回</a>
               <Row>
                <ViewBoard content={this.props.note.content} title={this.props.note.title} width={"80vw"}/>
               </Row>
               {this.getOperationList()}
               {/* 返回顶部 */}
                <BackTop>
                    <UpCircleOutlined style={{fontSize:30,color: '#1088e9',}}/>
                </BackTop>
           </div>
        );
    }

    getOperationList=()=>{
        const menu = (
            <Menu>
              <Menu.Item>
                <a onClick={()=>downloadMD(this.props.note.title,this.props.note.content)}>Markdown</a>
              </Menu.Item>
              <Menu.Item>
                  <PDFDownload title={this.props.note.title} content={this.props.note.content}/>
              </Menu.Item>
            </Menu>
        );
        if(this.props.visitor){
           return(
            <div className="operation">
                <Button onClick={()=>{this.changeStar()}}>{this.state.isStared?<StarFilled />:<StarOutlined />}收藏</Button>
                <Button onClick={()=>{this.changeLike()}}>{this.state.isLiked?<LikeFilled />:<LikeOutlined />}点赞</Button>
                <Button><ShareAltOutlined />分享</Button>
                <Dropdown overlay={menu} >
                    <Button><DownloadOutlined />下载</Button>
                </Dropdown>
            </div>
           );
        }else{
            return (
            <div className="operation">
                <Button type="primary" onClick={()=>this.props.editNote()}><EditOutlined />编辑</Button>
                <Popconfirm
                    title="你确定删除这篇笔记吗?"
                    onConfirm={()=>this.deleteNote()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger><DeleteOutlined />删除</Button>
                </Popconfirm>
                <Button><ShareAltOutlined />分享</Button>
                <Dropdown overlay={menu} >
                    <Button><DownloadOutlined />下载</Button>
                </Dropdown>
            </div>
            );
        }
    }
}

export default NoteItem;