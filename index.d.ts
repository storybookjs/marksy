type NodeType = string;
// eslint-disable-next-line no-undef
type NodeProps = unknown;
// eslint-disable-next-line no-use-before-define
type NodeChildren = MarksyIntermediateTree[];
export type MarksyIntermediateTree = [NodeType, NodeProps, NodeChildren];
