import React from "react";
import marked from "marked";
import highlight from "highlight.js";
import "../../../static/style/common.css";
import "../../../static/style/js-highlight.css";
import "./style.css";
import { Button,Tooltip} from "antd";
import {FullscreenOutlined,FullscreenExitOutlined} from "@ant-design/icons";

/**
 * This is a new version of write and view board, which provides functionalities of colorful coding and synchronized scrolling
 * fully controller component
 * example use case:
 * <WriteAndViewBoard2
            setContent={this.setContent.bind(this)}
            setDefaultContent={this.setDefaultContent.bind(this)}
            setTheme={this.setTheme.bind(this)}
            integratedContent={this.props.integratedContent}
            content={this.state.content}
            defaultText={defaultText}
            theme={this.state.theme}
  ></WriteAndViewBoard2>
 */
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
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
});

const renderer = new marked.Renderer();

renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + "</a>";
};

export default class WriteAndViewBoard2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aceBoxH: null,
      isFullScreen: false
    };
    this.cacheValue();
    this.containerScroll = this.containerScroll.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.fullScreen=this.fullScreen.bind(this);
    this.requestFullScreen=this.requestFullScreen.bind(this);
    this.exitFullscreen=this.exitFullscreen.bind(this);
    this.watchFullScreen=this.watchFullScreen.bind(this);
    this.escFunction = this.escFunction.bind(this);
    document.addEventListener("keydown", this.escFunction, false);
  }
  render() {
    let state = this.state;
    return [
      <div data-tut="tour_writeAndViewBoard_writeAndViewBoard">
      <header className="edit-header" key="header">
        <input
          style={{
            "text-align": "center",
            background: "white",
            "font-size": "22px",
          }}
          type="text"
          className="title-input"
          placeholder="Must enter a title"
          value={this.props.theme ? this.props.theme : ""}
          spellCheck="false"
          onChange={(e) => {
            this.props.setTheme(e.target.value);
          }}
        />
        <Button data-tut="tour_writeAndViewBoard_fullScreen" 
                onClick={this.fullScreen} icon={!this.state.isFullScreen ? <FullscreenOutlined/> : <FullscreenExitOutlined/>}></Button>
      </header>
      <div>
      </div>
      <div
          id='main'
        className="editor-main-a"
        ref={(node) => (this.aceBox = node)}
        style={{ height: state.aceBoxH}}
        key="main"
      >
        <Tooltip title="Markdown Writer">
        <div
          className="common-container editor-container"
          onMouseOver={this.setCurrentIndex.bind(this, 1)}
          onScroll={this.containerScroll}
          ref={(node) => (this.editContainer = node)}
        >
          <div
            contentEditable="plaintext-only"
            style={{
              "text-align": "left",
              background: "white",
              padding: 5,
              "margin-top": 5,
              "font-size": "18px",
              "white-space": "normal" //solve safari not-change-line issue
            }}
            name="editor-wrapper"
            id="editor-wrapper"
            className="common-wrapper editor-wrapper"
            onInput={this.onContentChange}
            ref={(node) => (this.editWrap = node)}
          ></div>
        </div>
        </Tooltip>
        <Tooltip title="Preview">
        <div
          className="common-container preview-container"
          ref={(node) => (this.previewContainer = node)}
          onMouseOver={this.setCurrentIndex.bind(this, 2)}
          onScroll={this.containerScroll}
        >
          <div
            style={{
              "text-align": "left",
              background: "white",
              padding: 5,
              "margin-top": 5,
            }}
            className="markdown-body common-wrapper preview-wrapper"
            ref={(node) => (this.previewWrap = node)}
            dangerouslySetInnerHTML={{
              __html: marked(this.props.content, {
                renderer: renderer,
                breaks: true,
                gfm: true,
              }),
            }}
          ></div>
        </div>
        </Tooltip>
      </div>
      </div>
    ];
    
  }

  componentDidMount() {
    this.setState({
      aceBoxH:
        document.documentElement.clientHeight -
        document.querySelector(".edit-header").offsetHeight +
        "px",
      previewContent: this.props.content,
    });
  }
  
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }

  //update left writing board by determin whether current content is the same with props'
  componentDidUpdate() {
    if (this.props.content !== this.editWrap.innerText) {
      this.editWrap.innerText = this.props.content;
    }
  }

  //helper function for auto focus scrolling
  cacheValue() {
    this.currentTabIndex = 1;
    this.hasContentChanged = false;
    this.scale = 1;
  }

  //helper function for auto focus scrolling
  setCurrentIndex(index) {
    this.currentTabIndex = index;
  }

  // help determine the position of scrolling
  containerScroll(e) {
    this.hasContentChanged && this.setScrollValue();
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop =
        this.editContainer.scrollTop * this.scale;
    } else {
      this.editContainer.scrollTop =
        this.previewContainer.scrollTop / this.scale;
    }
  }

  // handle content change
  onContentChange(e) {
    this.setState({
      previewContent: marked(e.target.innerText),
    });
    this.props.setContent(e.target.innerText);
    !this.hasContentChanged && (this.hasContentChanged = true);
  }

  //use ratio to determine how manny we need to scroll
  setScrollValue() {
    this.scale =
      (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) /
      (this.editWrap.offsetHeight - this.editContainer.offsetHeight);
    this.hasContentChanged = false;
  }

  /**
   * full screen support
   */
  fullScreen(){
    if (!this.state.isFullScreen) {
        this.requestFullScreen();
    } else {
        this.exitFullscreen();
    }
    this.setState({
        isFullScreen:false
    })
};

requestFullScreen(){
    var dom = document.getElementById('main');
    if (dom.requestFullscreen) {
        dom.requestFullscreen();
    } else if (dom.mozRequestFullScreen) {
        dom.mozRequestFullScreen();
    } else if (dom.webkitRequestFullScreen) {
        dom.webkitRequestFullScreen();
    }
};

exitFullscreen(){
    var dom = document.getElementById('main');
      if (dom.exitFullscreen) {
        dom.exitFullscreen();
    } else if (dom.mozCancelFullScreen) {
        dom.mozCancelFullScreen();
    } else if (dom.webkitCancelFullScreen) {
        dom.webkitCancelFullScreen();
    }
};
watchFullScreen(){
    console.log(document.webkitIsFullScreen)
    const _self = this;
    document.addEventListener(
        "webkitfullscreenchange",
        function() {
            _self.setState({
                isFullScreen: document.webkitIsFullScreen
            });
        },
        false
    );
};

escFunction(event){
  if(event.keyCode === 27) {
    //Do whatever when esc is pressed
    console.log("esc pressed");
    this.setState({isFullScreen:false});
  }
}

}
