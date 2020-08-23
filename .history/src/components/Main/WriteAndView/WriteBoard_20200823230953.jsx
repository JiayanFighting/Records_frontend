import React, {useState} from "react";
import marked from "marked";
import highlight from "highlight.js";
import {Button, Tooltip, Row, Col, Popover, Switch, Select, Card,message, Drawer,Menu, Dropdown,Divider} from "antd";
import {
  InfoCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  QuestionOutlined,
  VerticalAlignBottomOutlined,
  CopyOutlined,
  MailOutlined,
  SmileOutlined,
  PictureOutlined,
  SaveOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
  ContainerOutlined,
  TableOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import CodemirrorEditor, { CodemirrorHandler } from "../CodemirrorEditor";
import ReactToPrint from "react-to-print";
import FileSaver from "file-saver";
import PrintPage from "../ReportManagement/PrintPage";
import * as clipboard from "clipboard-polyfill";
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import PhotoDragger from "../WriteReport/PhotoDragger";
//reference: https://www.npmjs.com/package/codemirror
//快捷键支持
// 搜索(search) Ctrl-F (PC), Cmd-F (Mac)
// 替换(replace)   Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)
// 替换全部(replaceAll)   Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)
// 光标定位(locate cursor): Alt-G，例如输入 9:26，则光标定位到第9行第26列
// 搜索或者跳转行数出现的弹出框样式

// 当输入 '>' 或 '/' 字符的时候, 自动关闭标签
// 当光标定位于编辑器内，并且按 F11的时候编辑框全屏
// 全屏样式

import "../../../static/style/common.css";
import "../../../static/style/js-highlight.css";
import "./style.css";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/solarized.css";
import "codemirror/addon/search/search";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/display/fullscreen";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/theme/monokai.css";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/css/css";
import "codemirror/mode/sass/sass";
import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import Helper from "../WriteReport/Helper";

highlight.configure({
  tabReplace: "  ",
  classPrefix: "hljs-",
  languages: [
    "CSS",
    "HTML, XML",
    "JavaScript",
    "PHP",
    "Python",
    "Stylus",
    "TypeScript",
    "Markdown",
  ],
});

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  // sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: "hljs ",
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
});

const { Option } = Select;



export default class WriteBoard extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      aceBoxH: null,
      isFullScreen: false,
      currentTabIndex: 1,
      hasContentChanged: false,
      scale: 1,
      shortCutsHintsShown: false,
      showEmoji:false,
      showInsertImage:false,
      showHelperDrawer:false,
      functionIconSize:15,
      functionFontSize:12,
      displayDesc:'none',
      codeTheme: "solarized",
      viewBoardStyle: {
        "background-color": "#fff",
        color: "#333",
        transition: "background-color 0.3s ease",
      },
      fontSize: 12,
      isHover:-1,
      contentCopied:false
    };
    this.cacheValue();
    this.fullScreen = this.fullScreen.bind(this);
    this.requestFullScreen = this.requestFullScreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.watchFullScreen = this.watchFullScreen.bind(this);
    this.escFunction = this.escFunction.bind(this);
    document.addEventListener("keydown", this.escFunction, false);
    this.onContentChange = this.onContentChange.bind(this);
  }
  
  onRef = (ref) => {
    this.child = ref
  }

  handleVisibleChange = (shortCutsHintsShown) => {
    this.setState({ shortCutsHintsShown });
  };

  handleEmojiShow = (showEmoji) => {
    this.setState({showEmoji});
  }

  changeTheme() {
    // themes = ['solarized','monokai']; If more themes, need to refine this function
    console.log("enter change theme");

    if (this.state.codeTheme === "monokai") {
      this.setState({ codeTheme: "solarized" });
    } else if (this.state.codeTheme === "solarized") {
      this.setState({ codeTheme: "monokai" });
    }
  }

  changeFontSize = (value) => {
    console.log("font size: ", value);
    this.setState({ fontSize: value });
  };

  showInsertImage = () => {
    return (<PhotoDragger
      style={{"margin-right": "20px", "margin-left": "20px"}}
      teamId={this.props.teamInfo.id}
      insertPhotoUrl={this.props.insertPhotoUrl}
  />);

    
  }
  showEmoji = () => {
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        this.child.appendToCursor(emojiObject.emoji);
    }

    // const EmojiData = ({chosenEmoji}) => (
    //   <div>
    //     <strong>Unified:</strong> {chosenEmoji.unified}<br/>
    //     <strong>Names:</strong> {chosenEmoji.names.join(', ')}<br/>
    //     <strong>Symbol:</strong> {chosenEmoji.emoji}<br/>
    //     <strong>ActiveSkinTone:</strong> {chosenEmoji.activeSkinTone}
    //   </div>
    // );

    return (
      <div>
      <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK} groupNames={{smileys_people:"PEOPLE"}}/>
            {/* { chosenEmoji && <EmojiData chosenEmoji={chosenEmoji}/>} */}
    </div>
    );
  }

  render() {
    let state = this.state;
    const shortcutHints = (
      <div>
        <p>搜索(search): Ctrl-F (PC), Cmd-F (Mac)</p>
        <p>替换(replace) Shift-Ctrl-F (PC), Cmd-Opt-F (Mac)</p>
        <p>替换全部(replaceAll) Shift-Ctrl-R (PC), Shift-Cmd-Opt-F (Mac)</p>
        <p>
          光标定位(locate cursor): Alt-G (PC), Opt-G (Mac)，for example
          9:26，move to row 9 col 26
        </p>
      </div>
    );

    const renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
      return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title}">${text}</a>`;
    };
    const html = marked(this.props.content || "", { renderer });
    //spell check
    const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={this.download}>
              Markdown
            </a>
          </Menu.Item>
          <Menu.Item>
            <ReactToPrint
                trigger={() => <a>PDF</a>}
                content={() => this.componentRef}
            />
            <div style={{ display: "none" }}>
              <div
                  style={{ textAlign: "center" }}
                  ref={(el) => (this.componentRef = el)}
              >
                <Card title={this.props.theme}>
                  <div
                      className="preview"
                      style={{ "text-align": "left" }}
                      dangerouslySetInnerHTML={{
                        __html: marked(this.props.content, {
                          renderer: renderer,
                          breaks: true,
                          gfm: true,
                        }),
                      }}
                  />
                </Card>
              </div>
            </div>
          </Menu.Item>
        </Menu>
    );
    return [
      <div data-tut="tour_writeAndViewBoard_writeAndViewBoard">
        {this.state.showHelperDrawer?<Drawer
          title="🙆‍♀️👨‍✈️Help document🕵️‍♂️👩‍💼"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.showHelperDrawer}
          getContainer={false}
          // style={{ position: 'absolute' }}
          width="30vw"
          bodyStyle={{textAlign:"left"}}
        >
          <Helper/>
        </Drawer>:""}
        
        {/* <Row style={{backgroundColor:"#D9D9D9"}}> */}
        <Row style={{backgroundColor:"white"}}>
          <Col>
          <div className={'normal'}>
            <Switch 
            checkedChildren="Detail"
            unCheckedChildren="Detail"
            onChange={()=>{this.state.displayDesc==='none'?this.setState({displayDesc:''}):this.setState({displayDesc:'none'})}} />
            </div>
          </Col>

          <Col>
            <div className={this.props.hideSomeFunctions?"hide":(this.state.isHover === 10 ? 'change' : 'normal')}
              onMouseOver={()=>this.setState({isHover:10})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={this.fullScreen}
              >
              <FullscreenOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Full Screen</span>
            </div>
          </Col>
          <Divider  type="vertical" ></Divider>   
          
          <Col>
            <div className={'normal'}>
              <Select
                defaultValue={12}
                size="small"
                style={{ width: 60 }}
                onChange={this.changeFontSize}>
                <Option value={8}>8</Option>
                <Option value={12}>12</Option>
                <Option value={14}>14</Option>
                <Option value={18}>18</Option>
                <Option value={24}>24</Option>
                <Option value={36}>36</Option>
              </Select><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Font Size</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===1 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:1})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY("**","**","Bold")}}
              >
              <BoldOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Bold</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===2 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:2})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY(" _","_ ","Italic")}}
              >
              <ItalicOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Italic</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===3 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:3})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY("~~","~~","Strikethrough")}}
              >
              <StrikethroughOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Strikethrough</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===4 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:4})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY("\n* ","","list item\n")}}
              >
              <UnorderedListOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Unordered</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===5 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:5})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY("\n1. ","","list item\n")}}
              >
              <OrderedListOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Ordered</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover ===7 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:7})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.appendToCursor("***\n")}}
              >
              <MinusOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Line</span>
            </div>
          </Col>
          <Col>
            <Popover 
              content={this.showInsertImage}
              trigger="click"
              // visible={this.state.showEmoji}
              // onVisibleChange={() => this.handleEmojiShow("showEmoji")}
            >
            <div className={this.props.hideSomeFunctions?"hide":(this.state.isHover === 8 ? 'change' : 'normal')}
              onMouseOver={()=>this.setState({isHover:8})} 
              onMouseOut={()=>this.setState({isHover:-1})}>
              <PictureOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Image</span>
            </div>
            
            </Popover>
          </Col>
          <Col>
            <div className={this.state.isHover ===9 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:9})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>this.child.appendToCursor("\n|  |  |\n|--|--|\n|  |  |\n")}
              >
              <TableOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Table</span>
            </div>
          </Col>
          <Col>
            <Popover 
              content={this.showEmoji}
              trigger="click"
              visible={this.state.showEmoji}
              onVisibleChange={this.handleEmojiShow}
            >
              <div className={this.state.isHover ===11 ? 'change' : 'normal'}
                onMouseOver={()=>this.setState({isHover:11})} 
                onMouseOut={()=>this.setState({isHover:-1})}>
                <SmileOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
                <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Emoji</span>
              </div>
            </Popover>
          </Col>
          <Col>
            <div className={this.state.isHover ===6 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:6})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.child.surroundContentToCursorDIY("```\n","\n```","Insert code here")}}
              >
              <CodeOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Code</span>
            </div>
          </Col>
          {/* <Divider type="vertical" /> */}
          <Col>
            <Dropdown overlay={menu} >
              <div className={this.state.isHover === 12 ? 'change' : 'normal'}
                onMouseOver={()=>this.setState({isHover:12})} 
                onMouseOut={()=>this.setState({isHover:-1})}>
                <DownloadOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
                <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Download</span>
              </div>
            </Dropdown>
          </Col>
          <Col>
            <div className={this.props.hideSomeFunctions?"hide":(this.state.isHover === 13 ? 'change' : 'normal')}
              onMouseOver={()=>this.setState({isHover:13})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={()=>{this.props.saveDraft(this.props.content);}}>
              <SaveOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Save Draft</span>
            </div>
          </Col>
          
          <Col>
            <Tooltip title="Due to no permission, please use the copy button, paste and send email by youself"> 
              <div className={this.state.isHover === 14 ? 'change' : 'normal'}
                onMouseOver={()=>this.setState({isHover:14})} 
                onMouseOut={()=>this.setState({isHover:-1})}
                onClick={() =>  {
                  const item = new clipboard.ClipboardItem({
                    "text/html":new Blob(
                      [html],
                      {type: "text/html"}
                    )
                  });
                  clipboard.write([item]);
                  message.success("Content Copied Successfully")
                  this.setState({ contentCopied: true });
                }}
              >
                <CopyOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
                <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Copy</span>
              </div>
            </Tooltip>
          </Col>
          <Col>
            <div className={this.props.hideSomeFunctions?"hide":(this.state.isHover === 15 ? 'change' : 'normal')}
              onMouseOver={()=>this.setState({isHover:15})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={this.props.onShowReportsInThePastClicked}>
              <ContainerOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>History</span>
            </div>
          </Col>
          <Col>
            <div className={this.state.isHover === 16 ? 'change' : 'normal'}
              onMouseOver={()=>this.setState({isHover:16})} 
              onMouseOut={()=>this.setState({isHover:-1})}
              onClick={this.showDrawer}>
              <QuestionCircleOutlined style={{fontSize:this.state.functionIconSize}}/><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Help</span>
            </div>
          </Col>
          <Col>
            <div className={'normal'}>
              <Switch
                checkedChildren="Dark"
                unCheckedChildren="Dark"
                defaultUnChecked
                onClick={() => this.changeTheme()}
              /><br/>
              <span style={{fontSize:this.state.functionFontSize,display:this.state.displayDesc}}>Mode</span>
            </div>
          </Col>  
        </Row>
        {/* <Row style={{ backgroundColor: "white" }} justify="start">
          <Col>
            <Switch
                size="medium"
                checkedChildren="dark"
                unCheckedChildren="dark"
                defaultUnChecked
                onClick={() => this.changeTheme()}
            />
          </Col>
          <Col>
            <Select
                defaultValue={12}
                size="small"
                style={{ width: 60 }}
                onChange={this.changeFontSize}
            >
              <Option value={8}>8</Option>
              <Option value={12}>12</Option>
              <Option value={14}>14</Option>
              <Option value={18}>18</Option>
              <Option value={24}>24</Option>
              <Option value={36}>36</Option>
            </Select>
          </Col>
          <Col>
            <Button
              size="small"
              data-tut="tour_writeAndViewBoard_fullScreen"
              onClick={this.fullScreen}
              icon={
                !this.state.isFullScreen ? (
                  <FullscreenOutlined />
                ) : (
                  <FullscreenExitOutlined />
                )
              }
            >
            </Button>
          </Col>
          <Col>
          <Popover 
            content={this.showEmoji}
            trigger="click"
            visible={this.state.showEmoji}
            onVisibleChange={this.handleEmojiShow}
          >
            <Button
              size="small"
              data-tut="tour_writeAndViewBoard_fullScreen"
              icon={
                  <SmileOutlined />
              }
            >
            </Button>
            </Popover>
          </Col>
          <Col>
            <Dropdown overlay={menu} >
              <Button  size="small" icon = {<VerticalAlignBottomOutlined/>}>
              </Button>
            </Dropdown>
          </Col>
          <Col>
          <Tooltip title="Due to no permission, please use the copy button, paste and send email by youself">
          <Button
                icon = {<CopyOutlined />}
                size = "small"
                type = {this.state.contentCopied ? "loading" : "default"}
                disabled = {this.state.contentCopied ? true : false}
                onClick={() =>  {
                  const item = new clipboard.ClipboardItem({
                    "text/html":new Blob(
                      [html],
                      {type: "text/html"}
                    )
                  });
                  clipboard.write([item]);
                  message.success("Content Copied Successfully")
                  this.setState({ contentCopied: true });
                }}
              >
              </Button>    
              </Tooltip> 
          </Col>
          <Col>
            <Popover
                content={shortcutHints}
                trigger="click"
                visible={this.state.shortCutsHintsShown}
                onVisibleChange={this.handleVisibleChange}
            >
              <Button size="small" icon={<InfoCircleOutlined />}>
              </Button>
            </Popover>
          </Col>
          <Col>
            <Button size="small" icon={<QuestionOutlined />} onClick={this.showDrawer}>
            </Button>
          </Col>
        </Row>
        */}
        <header className="edit-header" key="header" style={{height:"48px"}}> 
          <input
            style={{
              "text-align": "left",
              background: "white",
              "font-size": "18px",
              "padding-left": "40px",
            }}
            type="text"
            className="title-input"
            placeholder="Enter a title"
            value={this.props.theme ? this.props.theme : ""}
            spellCheck="true"
            onChange={(e) => {
              this.props.setTheme(e.target.value);
            }}
          />
        </header>
        <div
          id="main"
          className="editor-main-c"
          ref={(node) => (this.aceBox = node)}
          style={{
            height: state.editorBoxH + "px",
            minHeight: "700px",
            "text-align": "left",
            background: "white",
            padding: 5,
            "font-size": state.fontSize,
            "white-space": "normal", //solve safari not-change-line issue
          }}
          key="main"
        >
          <Tooltip title="Markdown Writer">
            <div
              className="common-container editor-container"
              onMouseOver={this.setCurrentIndex.bind(this, 1)}
              ref={(node) => (this.editContainer = node)}
            >
              {state.editorBoxH && (
                <CodemirrorEditor
                  onScroll={this.containerScroll.bind(this, 1)}
                  onChange={this.onContentChange}
                  ref="editor"
                  options={{
                    lineNumbers: true,
                    theme: this.state.codeTheme,
                    tabSize: 2,
                    lineWrapping: true,
                    readOnly: false,
                    mode: "markdown",
                    styleActiveLine: true,
                    // codemirror/addon/edit/closetag
                    autoCloseTags: true,
                    // diy shortcuts
                    extraKeys: this.setExtraKeys(),
                  }}
                  autoFocus={true}
                  value={this.props.content}
                  onRef={this.onRef}
                />
              )}
            </div>
          </Tooltip>
          <Tooltip title="Preview">
            <div
              className="common-container preview-container"
              ref={(node) => (this.previewContainer = node)}
              onMouseOver={this.setCurrentIndex.bind(this, 2)}
              onScroll={this.containerScroll.bind(this, 2)}
              // style={this.state.viewBoardStyle}
            >
              <div
              id = "preview-html"
                style={{
                  "text-align": "left",
                  "margin-top": 5,
                  "font-size": state.fontSize,
                }}
                className="markdown-body preview-wrapper"
                ref={(node) => (this.previewWrap = node)}
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              ></div>
            </div>
          </Tooltip>
        </div>
      </div>,
    ];
  }

  componentDidMount() {
    this.setState({
      editorBoxH:
        document.documentElement.clientHeight -
        document.querySelector(".edit-header").offsetHeight,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  //update left writing board by determin whether current content is the same with props'
  // componentDidUpdate() {
  //   if (this.props.content !== this.state.content) {
  //     console.log("update: ", this.props.content);
  //     this.setState({ content: this.props.content });
  //   }
  // }

  //helper function for auto focus scrolling
  cacheValue() {
    this.currentTabIndex = 1;
    this.hasContentChanged = false;
    this.scale = 1;
  }

  //helper function for auto focus scrolling
  setCurrentIndex(index) {
    this.setState({
      currentTabIndex: index,
    });
  }

  // help determine the position of scrolling

  containerScroll(index, e) {
    let state = this.state;
    state.hasContentChanged && this.setScrollValue();
    if (state.currentTabIndex === 1 && index === 1) {
      this.previewContainer.scrollTop = e.top * state.scale;
    } else if (state.currentTabIndex === 2 && index === 2) {
      CodemirrorHandler.scrollTo(
        null,
        this.previewContainer.scrollTop / state.scale
      );
    }
  }

  // handle content change
  onContentChange(newCode) {
    this.props.setContent(newCode);
    this.setState({contentCopied:false});
    !this.state.hasContentChanged && this.setState({ hasContentChanged: true });
  }

  //use ratio to determine how manny we need to scroll
  setScrollValue() {
    let containerH = this.previewContainer.offsetHeight;
    this.setState({
      scale:
        (this.previewWrap.offsetHeight - containerH) /
        (CodemirrorHandler.getScrollInfo().height - containerH),
      hasContentChanged: false,
    });
  }

  /**
   * full screen support
   */
  fullScreen() {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
    } else {
      this.exitFullscreen();
    }
    this.setState({
      isFullScreen: false,
    });
  }

  requestFullScreen() {
    var dom = document.getElementById("main");
    if (dom.requestFullscreen) {
      dom.requestFullscreen();
    } else if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen();
    } else if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen();
    }
  }

  exitFullscreen() {
    var dom = document.getElementById("main");
    if (dom.exitFullscreen) {
      dom.exitFullscreen();
    } else if (dom.mozCancelFullScreen) {
      dom.mozCancelFullScreen();
    } else if (dom.webkitCancelFullScreen) {
      dom.webkitCancelFullScreen();
    }
  }
  watchFullScreen() {
    console.log(document.webkitIsFullScreen);
    const _self = this;
    document.addEventListener(
      "webkitfullscreenchange",
      function() {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen,
        });
      },
      false
    );
  }

  setExtraKeys() {
    // 自定义快捷键
    const that = this;
    let appendTxtFn = () => {
      let resultObj = {};
      let key2Command = [
        { name: "Ctrl-H", value: "## ", offset: 0 },
        { name: "Ctrl-B", value: "**", offset: 1 },
        { name: "Ctrl-K", value: "[]()", offset: 3 },
        { name: "Alt-K", value: "``", offset: 1 },
        { name: "Alt-C", value: "```js\n\n```", offset: 0, offsetLine: 1 },
        { name: "Alt-I", value: "![alt]()", offset: 1 },
        { name: "Alt-L", value: "* ", offset: 0 },
      ];
      key2Command.forEach((item, index) => {
        resultObj[item.name] = (cm) => {
          that.setCursor(cm, item.value, item.offset, item.offsetLine);
        };
      });
      return resultObj;
    };
    let otherKeys = {
      F11(cm) {
        // 全屏
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      Esc(cm) {
        // 退出全屏
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      },
    };
    return Object.assign(otherKeys, appendTxtFn());
  }

  setCursor(cm, appendValue, offset = 0, offsetLine = 0) {
    let newValue = cm.getValue() + appendValue;
    cm.setValue(newValue);
    let lastLine = cm.lastLine() - offsetLine;
    cm.setCursor(lastLine, cm.getLine(lastLine).length - offset);
    this.onContentChange(newValue);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      console.log("esc pressed");
      this.setState({ isFullScreen: false });
    }
  }

  download = () => {
    let content = this.props.content;
    let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    let title =
      (!this.props.theme || this.props.theme.length === 0)
        ? "Report"
        : this.props.theme;
    FileSaver.saveAs(blob, title + ".md");
  };

  showDrawer = () => {
    this.setState({
      showHelperDrawer: true,
    });
  };

  onClose = () => {
    this.setState({
      showHelperDrawer: false,
    });
  };
}
