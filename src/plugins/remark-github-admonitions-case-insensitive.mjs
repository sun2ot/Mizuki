import { visit } from "unist-util-visit";

/**
 * 将 GitHub 提示语法中的类型转换为大写，以实现大小写不敏感的匹配
 * 必须在 remark-github-admonitions-to-directives 之前运行
 */
export function remarkGithubAdmonitionsCaseInsensitive() {
	return (tree) => {
		visit(tree, "blockquote", (node) => {
			const firstChild = node.children?.[0];
			if (firstChild?.type !== "paragraph") return;

			const firstParagraphChild = firstChild.children?.[0];
			if (firstParagraphChild?.type !== "text") return;

			// 匹配 GitHub 提示语法: [!TYPE]，其中 TYPE 不区分大小写
			const alertRegex = /^\s*\[!([A-Z]+)\]\s*$/i;
			const lines = firstParagraphChild.value.split("\n");

			if (lines.length === 0) return;

			const match = lines[0].match(alertRegex);
			if (match) {
				// 将提示类型规范化为大写并替换
				const normalizedType = match[1].toUpperCase();
				lines[0] = `[!${normalizedType}]`;
				firstParagraphChild.value = lines.join("\n");
			}
		});
	};
}
