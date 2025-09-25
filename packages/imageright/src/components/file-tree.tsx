import { Tree, type TreeNodeData } from "@mantine/core";

export const FileTree = (data: TreeNodeData[]) => {

  return (
    <Tree data={data} />
  )
}