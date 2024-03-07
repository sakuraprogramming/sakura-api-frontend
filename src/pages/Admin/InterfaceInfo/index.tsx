import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProDescriptions, ProTable,} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet, offlineInterfaceInfoUsingPost, onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost
} from "@/services/sakura-api-backend/interfaceInfoController";
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";


const InterfaceInfo: React.FC = () => {


  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);


  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading("正在添加");
    try {
      const res = await addInterfaceInfoUsingPost({
        ...fields
      });
      hide();
      message.success('创建成功');
      handleModalOpen(false);
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('修改中---');
    try {
      await updateInterfaceInfoUsingPost({
        id: currentRow?.id,
        ...fields
      });
      hide();
      message.success('修改成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('修改失败，' + error.message);
      return false;
    } finally {
      handleUpdateModalOpen(false);
    }
  };
  const handleRemove = async (selectedRow: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!selectedRow) return true;
    try {
      await deleteInterfaceInfoUsingPost({
        id: selectedRow?.id
      });
      hide();
      message.success('删除成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败,' + error.message);
      return false;
    }
  };

  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPost({
        id: record?.id
      });
      hide();
      message.success('发布成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('发布失败,' + error.message);
      return false;
    }
  }
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPost({
        id: record?.id
      });
      hide();
      message.success('下线成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('下线失败,' + error.message);
      return false;
    }
  }

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text'
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          修改
        </a>,
        record.status == 0 ? <a
          key="config"
          onClick={async () => {
            await handleOnline(record);
            actionRef.current?.reload();
          }}
        >
          发布
        </a> : <a
          type="text"
          key="config"
          onClick={async () => {
            await handleOffline(record);
            actionRef.current?.reload();
          }}
        >
          下线
        </a>,
        <Button
          type="text"
          key="config"
          danger
          onClick={async () => {
            await handleRemove(record);
            actionRef.current?.reload();
          }}
        >
          删除
        </Button>
      ]
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        // @ts-ignore
        request={async () => {
          const res = await listInterfaceInfoByPageUsingGet(
            {} as API.listInterfaceInfoByPageUsingGETParams
          );
          if (res?.data) {
            return {
              data: res.data.records,
              success: true,
              total: res?.data.total
            }
          } else {
            return {
              data: [],
              success: false,
              total: 0
            }
          }

        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>

              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <UpdateModal values={currentRow || {}}
                   columns={columns}
                   onCancel={() => {
                     handleUpdateModalOpen(false);
                     if (!showDetail) {
                       setCurrentRow(undefined);
                     }
                   }}
                   onSubmit={async (values) => {
                     const success = await handleUpdate(values);
                     if (success) {
                       handleUpdateModalOpen(false);
                       setCurrentRow(undefined);
                       if (actionRef.current) {
                         actionRef.current?.reload();
                       }
                     }
                   }
                   }
                   visible={updateModalOpen}/>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns}
                   onCancel={() => {
                     handleModalOpen(false)
                   }}
                   onSubmit={async (values) => {
                     await handleAdd(values);
                   }}
                   visible={createModalOpen}/>
    </PageContainer>
  );
};
export default InterfaceInfo;
