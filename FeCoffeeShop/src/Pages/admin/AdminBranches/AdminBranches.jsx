import BrachesFrom from "@/Components/FormManager/BrachesFrom";
import useNotification from "@/hooks/NotiHook";
import {
  createBranches,
  deleteBranches,
  getAllBranches,
  updateBranches,
} from "@/service/branchs";
import { Button, Modal, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import BranchMap from "../../../Components/BranchMap/BranchMap";

const AdminBranches = () => {
  const [branch, setBranch] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [BranchMapData, setShowBranchMapData] = useState({
    show: false,
    branch: {},
  });
  const openNotification = useNotification();

  useEffect(() => {
    fetchBranches(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchBranches = async (pageIndex, pageSize) => {
    const response = await getAllBranches({
      listParam: { PageIndex: pageIndex, PageSize: pageSize },
    });

    if (response.data.Success) {
      setBranch(response.data.ResultData);
      setTotalCount(response.data.ResultData.Paging.TotalCount);
    } else {
      openNotification({
        type: "error",
        description: "Error from server",
      });
    }
  };

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalVisible(true);
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalVisible(true);
  };

  const handleDelete = async (branchesid) => {
    try {
      const response = await deleteBranches({ branchesid: branchesid });
      if (response.data?.Success) {
        fetchBranches(currentPage, pageSize);
        openNotification({
          type: "success",
          description: "delete branch successfully",
        });
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingBranch) {
        const res = await updateBranches({
          formData: { ...values, Id: editingBranch.Id },
        });
        if (res.data.Success) {
          openNotification({
            type: "success",
            description: "Edit  branch successfully",
          });
        }
      } else {
        const res = await createBranches({ formData: values });
        if (res.data.Success) {
          openNotification({
            type: "success",
            description: "Create branch successfully",
          });
        }
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
    }
    fetchBranches(currentPage, pageSize);
    setIsModalVisible(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    { title: "ID", dataIndex: "Id", key: "Id" },
    { title: "Name", dataIndex: "Name", key: "Name" },
    { title: "Address", dataIndex: "Address", key: "Address" },
    {
      title: "Latitude",
      dataIndex: "Latitude",
      key: "Latitude",
    },
    {
      title: "Longitude",
      dataIndex: "Longitude",
      key: "Longitude",
    },
    {
      title: "MAP",
      dataIndex: "Id",
      key: "id",
      render: (text, record) => (
        <>
          <div
            onClick={() => setShowBranchMapData({ show: true, branch: record })}
            className="h-20 w-full flex justify-center items-center border rounded-md cursor-pointer hover:bg-slate-200 duration-500 ease-in-out"
          >
            <FaEye />
          </div>
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title={`Confirm delete branch ${record.Name}?`}
            onConfirm={() => handleDelete(record.Id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <Button type="primary" onClick={handleAdd} className="mb-4">
        Add Branch
      </Button>
      <Table
        columns={columns}
        dataSource={branch?.List}
        rowKey="Id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={editingBranch ? "Edit Branch" : "Add Branch"}
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <BrachesFrom
          initialValues={editingBranch?.Id ? editingBranch.Id : null}
          onSave={handleSave}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
      {BranchMapData.show && BranchMapData.branch ? (
        <div className="absolute inset-0">
          <BranchMap
            latitude={BranchMapData.branch.Latitude}
            longitude={BranchMapData.branch.Longitude}
            name={BranchMapData.branch.Name}
            address={BranchMapData.branch.Address}
            onClose={() => setShowBranchMapData({ show: false, branch: {} })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AdminBranches;
