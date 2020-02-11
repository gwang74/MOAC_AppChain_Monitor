### 监控应用链异常

通过监控应用链vnode节点的peerCount值，当某个vnode的peerCount低于设定最小值时，发送邮件通知运维及时处理问题。每10分钟监控一次。

### 配置说明

#### initConfig.json

| 参数         |     说明      |
| ------------ | :-----------: |
| vnodeUri     | 监控vnode |
| minPeerCount |  警告最小值   |
| stmpHost     |   SMTP服务    |
| user         | 发送邮件地址  |
| pwd          |    授权码     |
| to           | 接收邮件地址  |

### 运行

> npm run monitor
