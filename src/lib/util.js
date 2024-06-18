export function getNodeSize(node, isV) {
	const { marginTop, marginBottom, marginLeft, marginRight } = window.getComputedStyle(node, null);
	if (isV) return node.offsetHeight + parseFloat(marginTop) + parseFloat(marginBottom);
	else return node.offsetWidth + parseFloat(marginLeft) + parseFloat(marginRight);
}
