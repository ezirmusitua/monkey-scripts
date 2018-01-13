### jav download control panel
Update At: 2018-01-14
懒惰了啊 ...
  
* 砍掉了 progress bar 这种功能  
* 砍掉了在 video list 页面中进行下载的功能  
* 砍掉了无意义的 buttons    
* 砍掉了 backend server 间接层  

现在只会在 video detail 页面中显示下载按钮, 如果有资源会直接 call 本地 aria2c rpc 进行下载, 没有资源 alert  
因为 aria2c 不会重复下载, 重复的问题 pass; 对于怎么停止什么的, 最好就是在找一个好用的 aria2c client 处理吧;    

### TODOs
- [ ] clean code 