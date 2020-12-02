import axios from 'axios'
const source = axios.CancelToken.source();
// 进行一些全局配置
axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true; // 让axios发送请求的时候带上cookie

// 添加请求拦截器
const getActionRights = () => {
    let data:any = sessionStorage.getItem('user');
    if (!data) return null;
    data = JSON.parse(data);
    const actionRights = data.allRights.filter((action:any)=> {
        if (action.rightType === 'action') return action;
    });
    let arr:any[] = [];
    if (actionRights.length === 0) {
        return actionRights;
    }
    if (actionRights[0].rightPath) {
        arr.push(actionRights[0].rightPath);
    }
    actionRights[0].children.map((item:any) => {
        if (item.rightPath) {
            arr.push(item.rightPath);
        }
        if (item.children) {
            item.children.map((res:any) => {
                arr.push(res.rightPath);
            })
        }
    });
    return arr;
};
const actionRights = getActionRights();
const isNext = (actionList:any,toPath:any) => {
    console.log(actionList.includes(toPath));
    if (actionList.includes(toPath)) return true;
};
axios.interceptors.request.use(function (config) {
    const toPath = config.url;
    if (toPath?.startsWith('/api/v1')) {
        const flag = isNext(actionRights,toPath);
        if (!flag) {
            config.cancelToken = source.token;
            source.cancel("没有请求权限哦");
        }
    }
    // config.headers.Authorization = sessionStorage.getItem('token');
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});
// 封装自己的get/post方法
export default {
    get: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.get(path, {
                params: data
            })
                .then(function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    },
    post: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.post(path, data)
                .then(function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    },
    all: function (list:any[]) {
        return new Promise(function (resolve, reject) {
            axios.all(list)
                .then(axios.spread(function (...result) {
                    // 两个请求现在都执行完成
                    resolve(result)
                }))
                .catch(function (err) {
                    reject(err)
                })
        })
    }
}
