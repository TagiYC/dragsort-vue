export function getNodeHeight(node) {
	const { marginTop, marginBottom } = window.getComputedStyle(node, null);
	return node.offsetHeight + parseFloat(marginTop) + parseFloat(marginBottom);
}
