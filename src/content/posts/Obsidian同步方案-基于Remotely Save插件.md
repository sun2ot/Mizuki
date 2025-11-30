---
title: Obsidian同步方案-基于Remotely Save插件
published: 2022-11-12
description: 一种适用于obsidian的同步方式，通过remotely-save插件实现，支持增量同步，多端同步，使用对象存储或webdav进行数据存储。
category: 教程
tags: [obsidian, plugin]
# updated: 2023-05-14 19:53:29
# categories: [['教程', '搞机']]
---

# 一、使用 webdav
## 推荐产品
日本：[teracloud](ttps://aki.teracloud.jp)
- 注册即永久 10G，填邀请码 +5G，活动期间填邀请码可 +10G
- 国内可直连
- **两年内不登录账号会删除数据**，不过到期 1 个月前会邮件通知

其他：Dropbox等支持webdav的云服务产品
>不推荐坚果云（中国）。不是因为别的，而是坚果云在请求次数上有限制（~~阉割~~）：
>免费用户 600次/分钟，付费用户 1500次/分钟。
>
>这意味着一旦你进行大批量的同步工作，会**丢数据**。。。

# 二、对象存储
>这里以阿里云OSS为例

## 1 创建bucket

访问[阿里云对象存储OSS](https://oss.console.aliyun.com/)服务，点击右下角`创建bucket`

![image](https://img.085404.xyz/images/8845fbc33cf6f549ab7ebb60611c68cf.png)

- **bucket名称**：设置一个你喜欢的名称即可
- **地域**：选择一个离你近的地方即可（其实无所谓，都差不多的速度）
- **存储类型**：选`标准存储`
- **读写权限**：
	- 如果你准备用OSS进行全文件同步（.md文档，附件等等），则选择`私有`
	>==温馨提示==：`Remotely Save`通过S3进行同步时，似乎并不能够控制同步路径
	>>见官方描述[S3](https://github.com/remotely-save/remotely-save#s3)：The bucket should be empty and solely for syncing **a** vault.

    >这会有个什么问题呢？就是你一同步，bia ji，OSS的**根目录**就多了一堆你的文件，例如文档啊、图片啊、附件之类的。但是如果你准备建立或者已经建立了多个`vault`，那你就不得不按上述步骤创建多个`bucket`🤣

	- 如果你既要同步，还准备用OSS作为[图床工具](01%20教程/011%20搞机/Obsidian使用手册/PicGo%20+%20阿里云OSS%20自建图床.md)，则选择`公共读`
- **其他选项最好不变**，因为都是付费的，

![image](https://img.085404.xyz/images/5a576771d35e22641ef57139ce285dc4.png)

## 2 创建用户

鼠标悬浮与页面右上角`头像`处，点击`AccessKey 管理`

![image](https://img.085404.xyz/images/da95e5fc7703b4397d88687fe1bc1e24.png)

选择`开始使用子用户AccessKey`
>这样如果出现安全问题，可以随时删除子用户

![image](https://img.085404.xyz/images/d98b36c8cd1de98baf7d86412ded2eb5.png)

点击`创建用户`

![image](https://img.085404.xyz/images/45501251791047292bf0a100a1a68508.png)

`登录名称`和`显示名称`就是字面意思，自己填
勾选第二项 `Open API 调用访问`

![image](https://img.085404.xyz/images/00dacdc277f5fead57e23e9e23a1ae92.png)

之后会显示用户的信息，**务必妥善保存**，该信息**只会出现一次！！！**

## 3 授权用户

进入权限编辑页面，选中刚才创立的`子用户`，授予`完全控制`权限，点击`确定`

![image](https://img.085404.xyz/images/e385b187480032466e46cdc478eef91e.png)

![image](https://img.085404.xyz/images/8d4d2cf804c5c6f458cff657320fe428.png)

## 4 跨域设置

![image](https://img.085404.xyz/images/50299889cb3ee6eb36999a0087ba38a0.png)

添加如下规则
```
app://obsidian.md
capacitor://localhost
http://localhost
```
>允许 Headers 那里填`*`（星号）

![image](https://img.085404.xyz/images/fb4e866fe195dbed22ab285e433a8657.png)

## 5 Remotely Save 设置

![image](https://img.085404.xyz/images/25e2ccdada405203a78cc59398f014f1.png)

1. 选中`S3或兼容S3的服务`
2. 输入下面**5**个设置。其中`Endpoint`和`Region`分别对应下图中②的上、下两个
3. `Access Key ID` 和 `Secret Access Key` 都在刚刚保存的**子用户的信息**里（见 **2 创建用户**的末尾）。
4. bucket的名字就是第一步创建的阿里云OSS中的bucket的名字

![image](https://img.085404.xyz/images/135b044e29706b0e677a25e5acda60ea.png)

**点击Remotely Save同步按钮即可！**

# 三、组合方案

## webdav + 存储桶

文件通过**webdav**同步，而图片通过**对象存储 + PicGo**

- 对象存储负担小，只负责图片
- 短期看可有效**减少下载流量和存储费用**（因为 webdav 不要钱，而且存储桶内不存储文档本身）

>其实长远看来这个方案并不合适。因为图片存储在图床，除了<u>分享方便</u>和<u>节省本地存储空间</u>外，其实没有什么优势。因为图床图片在本地渲染时进行的是<u>缓存，而不是下载</u>。这意味着两个问题：一是**一旦你的图片缓存失效了，在无网络环境下打开文档时就成了“无图模式”了！**；二是缓存失效后，再次打开时变又会缓存一遍，这相当于对**同一图片产生了两倍的下行流量**(~~阿里云狂喜~~)。

- 对于已经删除的文档，**不能在存储桶内及时清除不再被其引用的图片**。[解决方案](01%20教程/011%20搞机/Obsidian使用手册/Obsidian图床图片处理方案.md)
- 移动端可直接分享 `.md` 源文件，因为其内包含图片链接，被分享者可见

## 单桶存储

>即文档和附件存储在一个 bucket 中

- 时刻保持**设备在本地拥有完整的数据**，且所有文件都可以在公网被访问，便于分享 (~~如果你不在意下行流量费用的话~~)
- 所有文件只会产生一次下行流量就可以永久保存在本地，而且随时随地可以访问，无须在意网络问题
- 如删除了某一文档，可以借助插件及时清理掉其中不再被引用的附件（如只在这篇文档中使用的图片），从而**节约 OSS 存储空间降低资费**
- **移动端**由于不能够将 markdown 转换为 PDF 导出，因此分享时只能分享 `.md` 源文件。但由于附件是通过本地链接插入的，这会导致**被分享者无法查看文档内的附件**

	>当然，你可以选择截图分享。。。

## 双桶存储

>即文档和附件分别存储在两个 bucket 中，附件以公网直链的形式插入文档进行渲染访问

- 该方法与 `webdav + 存储桶`（以下简称 `wb(webdav + bucket`） 的方案类似，无非就是附件同样放在存储桶中，而不是 webdav，因此**二者优缺点相同**
- 由于文档也存储在 bucket 中，存储费用相比 wb 反而更贵（**也就 0.000001 元/小时和 0.000002 元/小时的区别吧**）

	>这是真实数据，不是随口编的，你可以对照阿里云的价格表自行计算

# Tips

`2022 年 12 月 12 日`
remotely save 插件似乎存在 bug，当同步的附件中存在 mp4 时，在 Android 端会直接崩溃。崩溃速度快到你想拼手速关闭自动同步功能都做不到（我设置的是开启时自动同步一次。。。）

