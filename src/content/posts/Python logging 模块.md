---
title: Python logging 模块
published: 2024-06-14
category: 教程
# updated: 2024-09-09 14:00:29
# categories: [教程, 软件工程]
---

## 基本使用

```python
import logging

logging.info('this is an info msg')
logging.warning('this is a warning msg')
```

## 显示时间

要在日志中显示时间信息，可以通过格式字符串 `%(asctime)s` 控制：

```python
import logging
logging.basicConfig(format='%(asctime)s %(message)s')
logging.warning('is when this event was logged.')
```

输出结果如下：

```
2010-12-12 11:41:42,612 is when this event was logged.
```

按照最新的 [Python 3.12.5 official docs](https://docs.python.org/zh-cn/3/howto/logging.html#displaying-the-date-time-in-messages)，
但一般情况下，我们不需要如此精细的时间。如果需要自定义时间格式，可以通过给 `basicConfig` 添加 `datafmt` 参数实现：

```python
import logging
logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')
logging.warning('is when this event was logged.')
```

输出结果如下：

```
12/12/2010 11:46:36 AM is when this event was logged.
```

> 关于 `datefmt` 的格式，参见 [time.strftime()](https://docs.python.org/zh-cn/3/library/time.html#time.strftime)。

## 进阶日志使用

### 记录器

高级的日志使用方法与基础的区别主要在于模块化记录。关于具体的区别可以参考截止目前最新的 [Python 3.12.5 official docs](https://docs.python.org/zh-cn/3/howto/logging.html#advanced-logging-tutorial)。这里仅对 coding 做出介绍。

一个良好的习惯是：**对于不同的模块，使用不同的日志记录器**。

```python
import logging
logger = logging.getLogger('example')
```

对于一个记录器，首先需要指定要处理的 [日志级别](https://docs.python.org/zh-cn/3/library/logging.html#levels)。需注意，这里指定的是**日志处理的最低严重性级别**，例如 INFO 表示仅处理 INFO 、 WARNING 、 ERROR 和 CRITICAL 消息，而忽略 DEBUG 消息。

```python
logger.setLevel(logging.INFO)
```

请注意，`setLevel()` 是很重要的步骤，如果遗漏，日志级别将被默认置为 `NOTEST`。这意味着对于一条日志信息：

1. 如果记录器**是根记录器**时，将处理所有消息
2. 如果记录器**不是根记录器**，则将委托给父级

这往往会导致一些 exception 出现，因为根记录器默认的日志级别为 `WARNING`，这意味着你记录的 `DEBUG & INFO` 日志都不会输出。

### 处理器

上面说过，对于一个模块，采用一个独立的记录器是合适的。但对于同一个模块，不同类型的日志信息，也许需要不同的处理方式。例如正常的日志信息在 CLI 输出，而异常信息持久化到文件存储，此时就需要**对一个日志记录器添加不同的处理器**。Python 标准库中已经封装好了许多 [常用的处理器类型](https://docs.python.org/zh-cn/3/howto/logging.html#useful-handlers)。下面以 `StreamHandler` 为例，它可以发送消息到流（一般用于输出到 `stdout` 或 `stderr`）。

```python
exp_stream = logging.StreamHandler()
# WARNING > INFO
exp_stream.setLevel(logging.WARNING)
```

显然，一个记录器添加了若干个处理器后，**每个处理器可以设置不同的日志级别**。但请注意，上面通过 `logger.setLevel(logging.INFO)` 已经设置了 `logger` 的级别。理论上说，`handler` 的级别应当**高于** `logger` 的级别，因为后者决定了整个模块的日志准入级别，如果 `handler` 的级别比 `logger` 更低，会直接被忽略。

### 格式器

上文“显示时间”章节提到过，可以使用 `logging.basicConfig()` 来设置日志格式。但这是基于全局的格式控制，用于模块化日志记录显然是不合适的。**不同的日志记录器应该可以具有不同的日志格式**，这就需要借助格式器来完成。

一种常用的格式如下，这表示 `时间 - 记录器名字 - 日志级别 - 日志信息`。

```python
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
exp_stream.setFormatter(formatter)
```

### 使用

配置完成后，将 `handler` 添加到 `logger` 后，即可像基本使用那样记录日志信息了：

```python
# 添加处理器
logger.addHandler(exp_stream)
# 记录日志
logger.info('this is an info msg')
logger.warning('this is a warning msg')
...
```

不过，上面示例中的两条日志，只有 `WARNING` 会被输出，而 `INFO` 不会。这是因为，只有一个名为 `exp_stream` 的 `handler` 被定义处理 `WARNING` 日志信息，而虽然 `logger` 的级别是 `INFO`，但并没有对应的 `handler` 来处理。

因此，在 Python 的 `logging` 模块中，默认情况下，如果没有显式地为 `logger` 添加任何 `handler`，那么 `logger` 将不会自动输出任何日志到终端或其他地方。

### 配置文件

上文的进阶日志使用部分，也可以通过一个日志配置文件统一定义。

有空再写。

## FAQ

### 配置不生效

logging 模块是不支持追加配置的，就是说如果其他部分代码已经使用了 `logging.basicConfig()`，那么配置就固定了，后续再调用该函数是无法生效的。

