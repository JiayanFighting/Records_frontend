import React, { Component } from "react";
import {
    Col,
    Row,
    Input
  } from "antd";
import "antd/dist/antd.css";
import marked from "marked";
import highlight from 'highlight.js';
import '../../../static/style/common.css'
import '../static/style/js-highlight.css'
import './WriteAndViewBoard/style.css'

const { TextArea } = Input;

highlight.configure({
  tabReplace: '  ',
  classPrefix: 'hljs-',
  languages: ['CSS', 'HTML, XML', 'JavaScript', 'PHP', 'Python', 'Stylus', 'TypeScript', 'Markdown']
})

//highlight code support
marked.setOptions({
  highlight (code) {
    return highlight.highlightAuto(code).value
  }
})

const renderer = new marked.Renderer();

renderer.link = function(href, title, text) {
    return `<a target="_blank" href="${href}">${text}` + "</a>";
};

class WriteAndViewBoard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          aceBoxH: null,
          previewContent: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
          content: e.target.value,
        });
        //if you render this board, need to implement setContent method to recieve content change
        //@ Xuan
        this.props.setContent(e.target.value);
    }

  //   setCurrentIndex(index) {
  //   this.currentTabIndex = index;
  // }

  //   containerScroll(e) {
  //     this.hasContentChanged && this.setScrollValue();
  //     if (this.currentTabIndex === 1) {
  //       this.previewContainer.scrollTop =
  //         this.editContainer.scrollTop * this.scale;
  //     } else {
  //       this.editContainer.scrollTop =
  //         this.previewContainer.scrollTop / this.scale;
  //     }
  //   }

    render() {
        return (
          <div
        className="editor-main-a"
        style={{ height: this.state.aceBoxH }}
        key="main"
      >
              {/* <Row gutter={[16, 16]}> */}
                <Col span={12} onScroll={this.containerScroll}>
                  <TextArea
                    id="editor"
                    rows={22}
                    onChange={this.handleChange}
                    value={this.props.content}
                  ></TextArea>
                </Col>
                <Col span={12}>
                  <div
                    class="preview"
                    style={{ "text-align": "left" ,background:"white",overflow:"scroll",height:488,padding:10,"margin-top":10}}
                    dangerouslySetInnerHTML={{
                      __html: marked(this.props.content, {
                        renderer: renderer,
                        breaks: true,
                        gfm: true,
                      }),
                    }}
                  ></div>
                </Col>
              {/* </Row> */}
              </div>
        );
      }
}

export default WriteAndViewBoard;