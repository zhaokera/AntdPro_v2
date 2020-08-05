<h1 align="center">二次封装Antd Pro（不带SSO）</h1>



## 学习文档
- **UI库 Antd**：https://3x.ant.design/docs/react/introduce-cn
- **项目框架基于Antd pro**：https://v2-pro.ant.design/index-cn
- **脚手架Umi**：https://umijs.org/zh/
- **less**：https://juejin.im/post/5c8e4f4651882545ba60a230
- **Dva**：https://dvajs.com/guide/



## 使用

### 使用命令行
```bash
$ git clone ssh://git@39.100.100.247:2222/f2e/dm.full.wx.git
$ cd dm.full.wx
$ git checkout dev
$ npm install
$ npm start         # 访问 http://localhost:8000
```

## 准备工作  
vscode插件  
1. Beautify
2. Debugger for Chrome
3. ESLint  
4. Reactjs code snippets 
5. TSLint 
6. Umi Pro

<h2 align="center">一些些规范</h2>

## 文件命名规范
1. 路由相关文件夹首字母大写  例如客户文件夹pages/Customer
2. 文件夹/组件首个文件命名index.js
3. 功能型文件夹首字母小写 例如models、views、common
4. 页面命名首字母大写，功能型js首字母小写 例如Home.js、home.less

## 文件目录  
1. 一级菜单文件夹放在pages/A 后续文件路径根据菜单路径来，不要越级。
2. 页面单个组件放在该页面当前路径/views中
3. 公司级的公共组件放置在/@/components/DMComponents
4. 当前项目纯公共组件放在/@/components/xx

## Dva和State

### 满足下面任意一个条件的话数据使用Dva维护,其他情况用state维护。
1. 应用中的其他部分需要用到这部分数据吗？ 
2. 是否需要根据这部分原始数据创建衍生数据？ 
3. 这部分相同的数据是否用于驱动多个组件？ 
4. 你是否需要能够将数据恢复到某个特定的时间点？ 
5. 是否需要缓存数据？（比如：直接使用已经存在的数据，而不是重新请求）  
6. 是否是业务数据？     

### 注意事项
1. 业务组件中可以调用dva  例如Home/views/某个组件可以调用dva  
2. 公共组件中不调用dva 例如components/xx组件
3. 公共组件中如果需要Api请求,可直接调用service层。


## 弹窗的解耦

以前是父组件中包含所有弹窗逻辑，例如显示/隐藏/提交/取消等..  
现在父组件=>引用弹层，通过ref指向。  
弹层中包含Api和业务逻辑，弹层中引用相关View的组件。  
Form类型通过wrappedComponentRef指向，在弹层中获取View组件的Form表单值。



## 支持环境

现代浏览器及 IE11。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

