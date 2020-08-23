export function postRequest(url, body) {
    var isOk = false;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            isOk = response.ok;
            if (!isOk) {
                return response.status;
            }
            console.log("res: ", response)
            return response.json();
        }).catch(err => {
            console.log(err);
        })
            .then((responseData) => {
                if (isOk) {
                    resolve(responseData);
                    if(responseData.code===0){
                        resolve(responseData)
                    }else{
                        // 错误处理
                    }
                } else {
                    reject(responseData);
                }
            }).catch(err => {
                console.log(err);
            })
    })
}

export function postFormData(url, data) {
    var isOk = false;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: data,
        }).then((response) => {
            isOk = response.ok;
            if (!isOk) {
                return response.status;
            }
            return response.json();
        })
            .then((responseData) => {
                if (isOk) {
                    resolve(responseData);
                    if(responseData.code===0){
                        resolve(responseData)
                    }else{
                        // 错误处理
                    }
                } else {
                    reject(responseData);
                }
            })
    })
}

export function getRequest(url) {
    var isOk = false;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
        }).then((response) => {
            isOk = response.ok;
            console.log(response);
            if (!isOk) {
                return response.status;
            }
            return response.json();
        })
            .then((responseData) => {
                console.log(responseData)
                if (isOk) {
                    resolve(responseData);
                } else {
                    reject(responseData);
                }
            })
    })
}

export function mockResult(result) {

    return new Promise((resolve,reject)=>{
        resolve(result);
    })
}