import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import {Space, Row, Col, Button, Popconfirm, message} from "antd";
import { DeleteOutlined,StarOutlined,LikeOutlined,StarFilled,LikeFilled,DoubleLeftOutlined,EditOutlined} from '@ant-design/icons';
import ViewBoard from '../WriteManagement/ViewBoard';
import {deleteNoteService} from "../../../services/noteService";
import WriteBoard from '../WriteManagement/WriteBoard';

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

    onEditing=()=>{
        if(this.state.isEditing){
            return (
                <WriteBoard/>
            );
        }
    }

    render() {
        return (
           <div style={{backgroundColor:"white",paddingLeft:30,textAlign:"left"}}>
               <a onClick={()=>this.props.closeDetail()}><DoubleLeftOutlined />返回</a>
               {/* <Row>
                    <Col><h2><strong>{this.props.note.title}</strong></h2></Col>
               </Row> */}
               <Row>
                <ViewBoard content={this.props.note.content} title={this.props.note.title} height={"80vh"} width={"80vw"}/>
               </Row>
               <Row>
                   <Col>
                    <Button type="primary"><EditOutlined />编辑</Button>
                        <Popconfirm
                            title="你确定删除这篇笔记吗?"
                            onConfirm={()=>this.deleteNote()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger><DeleteOutlined />删除</Button>
                        </Popconfirm>
                        <Button onClick={()=>{this.changeStar()}}>{this.state.isStared?<StarFilled />:<StarOutlined />}收藏</Button>
                        <Button onClick={()=>{this.changeLike()}}>{this.state.isLiked?<LikeFilled />:<LikeOutlined />}点赞</Button>
                    </Col>
               </Row>
           </div>
        );
    }
}

export default NoteItem;