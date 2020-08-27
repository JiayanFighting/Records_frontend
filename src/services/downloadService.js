// teamService.js
import {getRequest, postRequest} from './Http';
import {API_ROOT} from "../constants";
import FileSaver from "file-saver";


export function downloadMD(title,content){
    let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    title =(!title || title.length === 0)? "Note": title;
    FileSaver.saveAs(blob, title + ".md");
};