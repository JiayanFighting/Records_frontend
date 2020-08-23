import React, {Component} from 'react';
import { Upload,message,Spin } from 'antd';
import { InboxOutlined} from '@ant-design/icons';
import {savePhoto} from '../../../services/photoService';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PhotoDragger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      url:'',
      uploadSuccess:true,
      isLoading:false,
    };
  }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  insertInline = async file => {
    if (!this.state.uploadSuccess) return;
    let url = await getBase64(file.originFileObj);
    this.props.insertPhotoUrl(url);
  }

  //input a originFileObj
  // save linked image into database
  saveAPhoto= (file) => {
    this.setState({isLoading:true});
    if (!this.state.uploadSuccess) return;
    const data = new FormData();
    data.append('photo',file);
    data.append('teamId',this.props.teamId);
    savePhoto(data).then((res) => {
        this.props.insertPhotoUrl(res.url);
        this.setState({isLoading:false});
    }).catch((err) => {
      message.error(err);
      this.setState({isLoading:false});
    });
  }

  //before upload, check size etc..
  beforeUpload = (file) => {
    console.log("file: "+file.originFileObj);
    const isLt5M = file.size / 1024 / 1024 < 2;
    if (!isLt5M) { 
        console.log('oversize');
        message.error('image too large, please within 2 MB')
        this.setState({uploadSuccess:false})
        return false;
    }
    this.setState({uploadSuccess:true});
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isIMG = !isJPG || !isPNG || !isGIF;
    if (!isIMG) {
        console.log('Format not right');
        this.setState({uploadSuccess:false})
        return false;
    }
    this.setState({uploadSuccess:true});
    message.success(file.name+" file uploaded successfully")
    return true;
};
    

  render() {
    const { Dragger } = Upload;
    const props = {
        name: 'file',
        multiple: true,
      };
    return (
      <Spin tip="Loading..." spinning={this.state.isLoading}>
        <Dragger {...props} 
        beforeUpload = {this.beforeUpload}
        showUploadList={false}
        onChange={(info)=>{
            const{status}  = info.file;
            if (status !== 'uploading') {
                console.log("upload",info.file, info.fileList);
                this.saveAPhoto(info.file.originFileObj); //linking image
                // this.insertInline(info.file);
            }
        }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </Dragger>
      </Spin>
    );
  }
}

export default PhotoDragger;
