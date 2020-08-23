import React from "react";
import {message, Button} from "antd";

export function showError(errorMsg) {
    return  message.error(
        <span>
            <span>{errorMsg}</span>
            <a size={"small"}
                    style={{ marginLeft: "10px"}}
                    onClick={() => {message.destroy()}}>
                close
            </a>
        </span>
    );
}

export function showSuccess(sucessMsg) {
    return  message.success(
        <span>
            <span>{sucessMsg}</span>
            <a size={"small"}
               style={{ marginLeft: "10px"}}
               onClick={() => {message.destroy()}}>
                close
            </a>
        </span>
    );
}