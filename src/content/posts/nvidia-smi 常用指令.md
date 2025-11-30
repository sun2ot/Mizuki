---
title: nvidia-smi 常用命令
published: 2025-02-18
category: 教程
# updated: 2025-02-18 19:39:34
# categories: [教程, 搞机]
---

## 显示当前显卡支持的频率

```bash
nvidia-smi -q -d SUPPORTED_CLOCKS
```

16 系往后的档位基本都在 15MHz 一档，该命令能够列出当前 GPU 支持的所有档位，便于后续的调整。

## 设定显卡功耗上限

```bash
nvidia-smi -pl [功耗]
```

单位是瓦特，可以精确到小数点后两位。对笔记本电脑**大概率不会生效**，需借助 OEM 的控制台实现功耗控制，或者借助下文的频率设定变相实现功耗限制。

## 锁定核心频率

```bash
nvidia-smi -lgc [频率]
```

**固定**核心频率。频率需处于显卡支持的档位，并且要能够实现（总不能让你超 10G 吧😅）。

```bash
nvidia-smi -lgc a,b
```

**限制核心频率区间**（大于 a 小于 b）。打游戏的时候用这个多一点，比较好用。

```bash
nvidia-smi -rgc
```

恢复对频率的任何修改。

> 重启计算机也是可以的。

## 锁定显存频率

操作方法与核心频率类似，只不过参数变为 `-lmc`

```bash
# 固定显存频率
nvidia-smi -lmc [频率]

# 固定显存频率区间
nvidia-smi -lmc a,b

# 恢复显存频率
nvidia-smi -rmc
```