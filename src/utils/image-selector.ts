/**
 * 图片选择工具函数
 * 统一处理图片源的类型转换和随机选择逻辑
 */

/**
 * 将图片源转换为数组格式
 */
export function toArray(src: string | string[] | undefined): string[] {
	if (Array.isArray(src)) return src;
	if (typeof src === "string") return [src];
	return [];
}

/**
 * 从图片数组中随机选择一张
 */
export function selectRandomImage(images: string[]): string {
	if (images.length === 0) return "";
	if (images.length === 1) return images[0];
	const randomIndex = Math.floor(Math.random() * images.length);
	return images[randomIndex];
}

/**
 * 处理图片源：如果禁用轮播且有多张图片，随机选择一张
 */
export function processImageSource(
	src: string | string[],
	carouselEnabled: boolean,
): string | string[] {
	if (carouselEnabled) {
		return src;
	}

	const images = toArray(src);
	if (images.length <= 1) {
		return src;
	}

	return selectRandomImage(images);
}
