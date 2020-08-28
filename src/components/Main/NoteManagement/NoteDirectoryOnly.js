import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Tree, Input, message} from "antd";
import { CarryOutOutlined} from '@ant-design/icons';
import {getDirectoryListOnlyService} from "../../../services/noteService";
import "../../../styles/Main/NoteManagement/NoteItem.css";

const { DirectoryTree } = Tree;
class NoteDirectoryOnly extends Component {
    state={
        autoExpandParent: true,
        directoryData: [],
    }


    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
        // if(event.node.noteId > 0){
        //     console.log("选中博客");
        //     this.props.showDetail(event.node.noteId);
        // }
    };
    
    onExpand = () => {
        console.log('Trigger Expand');
    };
    
    render(){
        return (
            <DirectoryTree
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                treeData={this.props.directoryData}
                style={{textAlign:"left"}}
            />
            
        );
    }
}

export default NoteDirectoryOnly;