---
title: Ubuntu 编译 FFmpeg
published: 2024-11-19
category: 教程
# updated: 2024-11-19 13:25:05
# categories: [教程, 搞机]
---
## 安装依赖

```bash
sudo apt-get update -qq && sudo apt-get -y install \
  autoconf \
  automake \
  build-essential \
  cmake \
  git-core \
  libass-dev \
  libfreetype6-dev \
  libgnutls28-dev \
  libmp3lame-dev \
  libsdl2-dev \
  libtool \
  libva-dev \
  libvdpau-dev \
  libvorbis-dev \
  libxcb1-dev \
  libxcb-shm0-dev \
  libxcb-xfixes0-dev \
  meson \
  ninja-build \
  pkg-config \
  texinfo \
  wget \
  yasm \
  zlib1g-dev
```

在 Ubuntu 20.04 上，额外安装：

```bash
sudo apt install libunistring-dev libaom-dev libdav1d-dev
```

## 部署

首先拉取源码：

```bash
git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg_src
```

配置：

```bash
./configure \
--enable-nonfree \
--enable-cuda-nvcc \
--enable-libnpp \
--enable-nvenc \
--bindir="$HOME/app/ffmpeg/bin"
```

关于 `--extra-cflags` 和 `--extra-ldflags` 参数，适用于你的依赖不在默认路径的情况。所以网上很多教程加了这个参数，但通常其实是不需要的。

编译安装：

```bash
make -j 32
sudo make install
```

检查是否部署成功：

> 记得给生成的 binaries 配置环境变量

```bash
ffmpeg -hwaccels
# 输出
Hardware acceleration methods:                                            
vdpau                                                                     
cuda                                                                      
vaapi

ffmpeg -codecs | grep nvenc
# 输出结果中应包含
av1_nvenc, h264_nvenc, hevc_nvenc
```

## 排障

编译过程中可能遇到一些缺失依赖问题。可以通过按照 [官方文档](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu) 的步骤提前安装以规避，也可以在中途按需处理，这里我选择后者。

### nasm

报错：`nasm not found or too old. Please install/update nasm or use --disable-x86asm for a build without hand-optimized assembly.`

参考官方文档 [NASM](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu#NASM) 章节。

### nvenc

报错：`ERROR: nvenc requested, but not all dependencies are satisfied: ffnvcodec`

参考官方文档 [Hardware acceleration introduction with FFmpeg](https://trac.ffmpeg.org/wiki/HWAccelIntro) 的 [NVENC](https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC) 章节。

> 这个库本质上只是修改一些文件，速度非常快，无需 `make -j`

请注意，安装时切记查看 [nv-codec-headers](https://github.com/FFmpeg/nv-codec-headers) 项目主页的 README。**不同驱动版本需要切换到不同的 git 分支**。
