import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const AccountTree = ({ treeData, onNodeClick }) => {
  const [searchParams] = useSearchParams();
  const classId = searchParams?.get("classId");

  const [selectedKeys, setSelectedKeys] = useState([classId]);
  const [expandedKeys, setExpandedKeys] = useState([classId]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onSelect = (selectedKeys, { node }) => {
    if (node.children.length === 0 || node.key === "0") {
      setSelectedKeys(selectedKeys);
      onNodeClick(selectedKeys[0]);
    }
  };
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  useEffect(() => {
    setSelectedKeys([classId]);
    setExpandedKeys([classId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tree
      onSelect={onSelect}
      onExpand={onExpand}
      selectedKeys={selectedKeys}
      expandedKeys={expandedKeys}
      switcherIcon={<DownOutlined />}
      treeData={treeData}
      autoExpandParent={autoExpandParent}
      showLine
    />
  );
};
