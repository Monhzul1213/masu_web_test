import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
 
export const AccountTree = ({ treeData, onNodeClick }) => {
  const [searchParams] = useSearchParams();
  const classId = searchParams?.get("classId") || undefined;
 
  const [selectedKeys, setSelectedKeys] = useState(classId ? [String(classId)] : []);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);
 
  const initialExpandedKeys = useMemo(() => {
    if (!Array.isArray(treeData) || !treeData.length) return [];
    const root = treeData.find((n) => String(n?.key) === "0");
    if (root && Array.isArray(root.children)) {
      const firstTwo = root.children.slice(0, 2).map((c) => String(c.key)).filter(Boolean);
      return ["0", ...firstTwo];
    }
    return treeData.slice(0, 2).map((n) => String(n.key)).filter(Boolean);
  }, [treeData]);
 
  const didInitRef = useRef(false);
  useEffect(() => {
    if (!didInitRef.current && Array.isArray(treeData) && treeData.length) {
      setExpandedKeys(initialExpandedKeys);
      setAutoExpandParent(false);
      didInitRef.current = true;
    }
  }, [treeData, initialExpandedKeys]);
 
  useEffect(() => {
    setSelectedKeys(classId ? [String(classId)] : []);
  }, [classId]);
 
  const onSelect = (keys) => {
    setSelectedKeys(keys);
    if (keys?.[0]) onNodeClick(String(keys[0]));
  };
 
  const onExpand = (keys) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };
 
  return (
    <Tree
      treeData={treeData}
      switcherIcon={<DownOutlined />}
      showLine
      onSelect={onSelect}
      onExpand={onExpand}
      selectedKeys={selectedKeys}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
    />
  );
};
 