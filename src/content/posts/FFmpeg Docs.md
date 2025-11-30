---
title: FFmpeg Docs
published: 2023-09-12
category: 教程
tags: [software, docs, cli]
# updated: 2024-07-22 16:57:48
# categories: [教程, 搞机]
---

# FFmpeg Docs

## 字幕格式转换

```
ffmpeg -i a.ass b.srt  
ffmpeg -i c.vtt d.srt  
ffmpeg -i e.lyric f.srt
```

### 硬字幕

字幕以图形方式硬编码到视频中，该过程耗时较长不可逆（无法再把字幕提取出来）

```bash
ffmpeg -i file.mp4 -vf subtitles=/path/to/sub.srt file_out.mp4
```

如果想使用绝对路径进行文件引用，**要加转义字符**。例如 `e\sample\dance. srt` 是字幕路径，则指令如下：

```bash
ffmpeg -i "e:\\sample\\dance.mp4" -vf subtitles="e:\\sample\\dance.srt" e:\sample\out.mp4
```

### 软字幕

软字幕分两种，一是将字幕单独作为文件存储；二是将字幕与视频一起封装到文件中，但兼容性较差，这里给出第二种的实现方案。

> 兼容性其实还是取决于播放器，所以软字幕自己用用就可以，不建议作为工程文件或者发送给老师、领导等的文件。

```powershell
ffmpeg -i $video.Name -i $srt -c copy -c:s srt out.mkv
ffmpeg -i input.mp4 -i input.srt -c copy -c:s mov_text output.mp4
```

注意：
1. vtt 字幕无法设置外挂，可转换为 srt 后进行操作
2. `-c:s srt` 仅适用于 mkv，因为 mkv 自带字幕轨道，如果使用 mp4 需使用 `mov_text`

## 图片压缩

```shell
ffmpeg -i input.jpg -qscale:v 5 output.jpg
```

- `:v` 表示视频流参数，取值为 1-31（越小质量越高）

## 调用 GPU

一般情况下，会在重新编码视频时产生调用 GPU 进行加速的需求。该过程中，不同的计算机平台可用的编码器不同，可通过如下方式进行查找：

```bash
ffmpeg -codecs
```

> 会产生大量输出结果，并分别标记每个编码器的功能和特性。在 Linux 和 Windows 可分别使用 `grep/Select-String` 进行筛选。

下面给出几个常用的编码器：

```bash
# AMD 核显
ffmpeg -i input.mp4 -c:v av1_amf/h264_amf/hevc_amf output.mp4

# NVIDIA 显卡
ffmpeg.exe -i input.mp4 -c:v av1_nvenc/h264_nvenc/hevc_nvenc -c:a aac output.mp4
```

## 合并/分离音视频

**合并**

```shell
ffmpeg -i "input_video.mp4" -i "input_audio.m4a"  -c copy -map 0:v:0 -map 1:a:0  "output.mp4"
```

| 参数    | 含义                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------- |
| `0:v:0` | 第一个 0 表示第一个输入文件，v 表示 video，第二个 0 表示“第一个输入的视频文件的第一个视频轨道” |
| `1:a:0` | 第二个输入的音频文件的第一个音频轨道                                                           |

---

**分离**

```shell
ffmpeg -i input.mp4 -c:v copy -an video.mp4
ffmpeg -i input.mp4 -c:a copy -vn audio.mp3
```

上述命令中的 `input.mp4` 是你要处理的视频文件名。

第一个命令 `ffmpeg -i input.mp4 -c:v copy -an video.mp4` 将从 `input.mp4` 中提取视频流，并将其保存为 `video.mp4` 文件。 `-c:v copy` 表示对视频流进行复制，保持原始编码方式不变， `-an` 表示忽略音频流。

第二个命令 `ffmpeg -i input.mp4 -c:a copy -vn audio.mp3` 将从 `input.mp4` 中提取音频流，并将其保存为 `audio.mp3` 文件。`-c:a copy` 表示对音频流进行复制，保持原始编码方式不变，`-vn` 表示忽略视频流。

请注意，上述命令中的输出文件格式（`video.mp4` 和 `audio.mp3`）可以根据你的需求进行修改。另外，如果你想对视频流或音频流进行重新编码或其他处理，可以调整相应的参数。

## 重新压制视频

```shell
ffmpeg -i "input.mp4" -c:v hevc_amf -c:a aac -b:v 6M -b:a 320k -ar 48000  "output.mp4"
```

| 参数   | 含义                         |
| ------ | ---------------------------- |
| `-c:v` | 视频编码器， `code:video`    |
| `-c:a` | 音频编码器， `code:audio`    |
| `-b:v` | 视频码率， `bit:video`       |
| `-b:a` | 音频码率， `bit:audio`       |
| `-ar`  | 音频采样率，48000=48.000 KHz |

## 拼接视频

```
ffmpeg -f concat -i input.txt -c copy output.mp4
```

在 `input.txt` 中写入要拼接的文件名，格式如下

```txt
file 'a.mp4'
file 'b.mp4'
...
```

> [!warning] 
> 1. 视频名称用单引号
> 2. 不要用中文名称
> 3. 名称不能有空格

## 裁剪

从第 3 分钟开始裁剪到结束

```powershell
ffmpeg -i "输入文件.m4a" -ss 00:03:00 -c copy "输出文件.m4a"
```

> [!warning] 
> 请确保在执行命令之前备份原始文件，以免发生意外情况。如果你想要从指定的时间点裁剪到文件结束，可以省略 `-t` 参数，因为默认会一直裁剪到末尾。

裁剪从第 3 分钟到第 5 分钟的部分

```powershell
# 方式1：开始时间 + 持续时间
ffmpeg -i "输入文件.m4a" -ss 00:03:00 -t 00:02:00 -c copy "输出文件.m4a"

# 方式2：开始时间 + 结束时间
ffmpeg -i "输入文件.m4a" -ss 00:03:00 -to 00:05:00 -c copy "输出文件.m4a"
```

## 章节

面对长视频/信息量大的视频时，可以通过添加章节（chapter）的形式，对内容进行划分，标注出关键时间节点。

```bash
ffmpeg -i input.mp4 -i chapters.txt -map_metadata 1 -c copy output.mkv
```

其中，`chapters.txt` 格式如下：

```ini
;FFMETADATA1
[CHAPTER]
START=830266666666.67
END=1470383333333.3
title=实操环节
[CHAPTER]
START=1470383333333.3
END=2870033333333.3
title=coding
[CHAPTER]
START=2870033333333.3
END=3351683333333.3
title=homework
```

注意：
1. `;FFMETADATA1` 不可缺少
2. `chapters.txt` 只要是文本文件即可，不一定必须为 `txt` 后缀
3. 每个 chapter 对应的 `[CHAPTER]` 不可缺少且必须为**大写**
4. 如果输出 `mkv`，则章节序列一一对应；如果输出 `mp4`，则所有章节左移一章，即第一个章节必须从 `00:00:00` 开始

> 更多 metadata 说明见 https://ffmpeg.org/ffmpeg-formats.html#Metadata-1

