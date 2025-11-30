---
title: generate_204 服务
published: 2024-08-26
category: 教程
# updated: 2024-08-26 16:10:14
# categories: [教程, 软件工程]
---

关于这个东西，我不止一次在 Clash 上看到过，但并没有去深究这是什么，只当做是一个类似于测试延迟的 API。无意中了解到关于它的具体作用，这里记录一下。

"Generate_204" 是一种网络连通性测试服务，广泛应用于检查网络连接状态。它通过访问一个返回 HTTP 204 状态码的 URL 来判断当前网络是否畅通，所以叫做 `generage_204`。

由于 HTTP 204 表示请求已成功处理且没有返回内容，访问这些 URL 可以有效减少网络开销，并且迅速判断网络连接情况。

许多知名的互联网公司提供这些服务，包括 Google、Apple、Cloudflare 等。根据互联网的检索信息，国内的 `华米OV` 中前三家似乎也提供了这种服务。这里统计一下常见的 ` generate_204 ` URL：

|    服务提供者    |                                                            链接                                                            | http/https | IP Version |
| :---------: | :----------------------------------------------------------------------------------------------------------------------: | ---------- | ---------- |
|   Google    |                        [http://www.gstatic.com/generate_204](http://www.gstatic.com/generate_204)                        | 204/204    | 4+6        |
|   Google    |               [http://www.google-analytics.com/generate_204](http://www.google-analytics.com/generate_204)               | 204/204    | 4+6        |
|   Google    |                         [http://www.google.com/generate_204](http://www.google.com/generate_204)                         | 204/204    | 4+6        |
|   Google    |          [http://connectivitycheck.gstatic.com/generate_204](http://connectivitycheck.gstatic.com/generate_204)          | 204/204    | 4+6        |
|    Apple    |                                  [http://captive.apple.com](http://captive.apple.com/)                                   | 200/200    | 4+6        |
|    Apple    |             [http://www.apple.com/library/test/success.html](http://www.apple.com/library/test/success.html)             | 200/200    | 4+6        |
| Microsoft👍 |             [http://www.msftconnecttest.com/connecttest.txt](http://www.msftconnecttest.com/connecttest.txt)             | 200/error  | 4          |
| Cloudflare  |                                  [http://cp.cloudflare.com/](http://cp.cloudflare.com/)                                  | 204/204    | 4+6        |
|   Firefox   |                [http://detectportal.firefox.com/success.txt](http://detectportal.firefox.com/success.txt)                | 200/200    | 4+6        |
|    V2ex     |                           [http://www.v2ex.com/generate_204](http://www.v2ex.com/generate_204)                           | 204/301    | 4+6        |
|     小米      |                   [http://connect.rom.miui.com/generate_204](http://connect.rom.miui.com/generate_204)                   | 204/204    | 4          |
|     华为      | [http://connectivitycheck.platform.hicloud.com/generate_204](http://connectivitycheck.platform.hicloud.com/generate_204) | 204/204    | 4          |
|    Vivo     |                       [http://wifi.vivo.com.cn/generate_204](http://wifi.vivo.com.cn/generate_204)                       | 204/204    | 4          |

一般情况下，使用微软的就不错，因为 Windows 的联网判断方法用的就是这个。