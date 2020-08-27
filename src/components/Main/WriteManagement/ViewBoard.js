import React, { Component } from "react";
import { Col, Row,Card } from "antd";
import "antd/dist/antd.css";
import marked from "marked";
import highlight from "highlight.js";
import "../../../static/style/common.css";
import "../../../static/style/js-highlight.css";
import "../../../styles/Main/WriteManagement/ViewBoard.css"

const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + "</a>";
};

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

class ViewBoard extends Component {
  state = {
    width: !this.props.width || this.props.height.width === 0
    ? "60vw"
    : this.props.width,
    height:
      !this.props.height || this.props.height.length === 0
        ? "60vh"
        : this.props.height,
  };
  render() {
    return (
      <div
        className="common-container preview-container"
        style={{
          overflow: "scroll",
          height: this.state.height,
          // width:"40vw"
        }}>
        <div
        className="markdown-body preview-wrapper"
          // style={{
          //   "text-align": "left",
          //   background: "white",
          //   overflow: "scroll",
          //   "font-size": "12px",
          //   height: this.state.height,
          //   "margin-top": 10,
          //   width: "100%",
          // }}
          style={{
            "text-align": "left",
            "margin-top": 5,
            "font-size": 14,
            overflow: "scroll",
          }}
          dangerouslySetInnerHTML={{
            __html: marked("# "+this.props.title+"\n"+this.props.content, {}),
          }}
        />
      </div>
    );
  }
}

export default ViewBoard;
