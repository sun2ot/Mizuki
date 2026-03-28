// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Xiaomi: [
		{
<<<<<<< HEAD
			name: "小米 15",
			image:
				"https://img.085404.xyz/images/d02d28202a6d7230c0d8c4fd20890154.webp",
			specs: "骁龙8E / 16G + 512G",
			description: "徕卡光学Summilux高速镜头 骁龙8至尊版移动平台",
			link: "https://www.mi.com/prod/xiaomi-15",
		},
		{
			name: "小米Buds5Pro WiFi",
			image:
				"https://img.085404.xyz/images/8b24674efdb75f9d6366f2b67bc1e3f2.webp",
			specs: "4.2Mbps / aptX Lossless",
			description: '"4000元以内最好的耳机"😅',
			link: "https://www.mi.com/prod/xiaomi-buds-5-pro",
		},
		{
			name: "小米平板8 Pro",
			image:
				"https://img.085404.xyz/images/a66afa02987e82bc29448eee22406c4f.webp",
			specs: "骁龙8E / 12G + 256G",
			description: "11.2英寸 3.2K 超清屏",
			link: "https://www.mi.com/prod/xiaomi-pad-8-pro",
		},
		{
			name: "小米手环9 Pro",
			image:
				"https://img.085404.xyz/images/b5c6c8838628a7342ca5462ab9d0976b.webp",
			specs: '1.74" AMOLED',
			description: "高精度运动健康 睡眠呼吸暂停监测 心率血氧监测",
			link: "https://www.mi.com/prod/xiaomi-shouhuan-9-pro",
=======
			name: "OnePlus 13T",
			image: "/images/device/oneplus13t.webp",
			specs: "Gray / 16G + 1TB",
			description:
				"Flagship performance, Hasselblad imaging, 80W SuperVOOC.",
			link: "https://www.oneplus.com/cn/13t",
>>>>>>> upstream/master
		},
	],
	PC: [
		{
<<<<<<< HEAD
			name: "机械革命 翼龙15Pro",
			image:
				"https://img.085404.xyz/images/0608ecae691f5a3643e536b1b2355cc2.webp",
			specs: "R7 8845H / RTX4060 / 32G+3T",
			description: "轻薄本中的战斗机，性能强劲，适合游戏和创作",
			link: "https://www.machinerevolution.com.cn/product/yinglong15pro",
		},
		{
			name: "雷蛇毒蝰 V3 极速版",
			image:
				"https://img.085404.xyz/images/948225c61e06d20aed19be81ddeecb6d.webp",
			specs: "PAW3950 / 8000Hz / 82g",
			description: "非对称中止 智能追踪 移动同步",
			link: "https://cn.razerzone.com/gaming-mice/razer-viper-v3-hyperspeed",
		},
		{
			name: "迈从 X75 V2",
			image:
				"https://img.085404.xyz/images/8151fb2c84b53833a38ab9228adaeda4.webp",
			specs: "75%配列 / 83键 / 8000mAh",
			description: "凯华流光冰淇淋轴 三模 热插拔",
			link: "https://www.maicong.cn/detail?link_product=a090cf68ee4ed5de2addc68c36323371",
=======
			name: "GL-MT3000",
			image: "/images/device/mt3000.webp",
			specs: "1000Mbps / 2.5G",
			description:
				"Portable WiFi 6 router suitable for business trips and home use.",
			link: "https://www.gl-inet.cn/products/gl-mt3000/",
>>>>>>> upstream/master
		},
	],
};
