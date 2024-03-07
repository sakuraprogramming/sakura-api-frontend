import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost
} from "@/services/sakura-api-backend/interfaceInfoController";
import {Button, Card, Descriptions, Divider, Form, Input, message} from "antd";
import {useParams} from "@@/exports";
import {openUserInterfaceUsingPost} from "@/services/sakura-api-backend/userInterfaceInfoController";

const InterfaceInfo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState<boolean>(false);

  const params = useParams();
  const loadData = async () => {
    if (!params.id) {
      message.error("参数不存在");
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: params.id
      });
      setData(res.data);
    } catch (error: any) {
      message.error("加载数据失败，" + error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);

  const handleOpen = async () => {
    if (!params.id) {
      message.error("参数不存在");
    }
    try {
      const res = await openUserInterfaceUsingPost({
        interfaceInfoId: params.id
      });
      if (res.data) {
        message.success("获取调用次数成功");
      }
    } catch (error: any) {
      message.error("获取调用次数失败," + error.message);
    }

  }

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error("接口不存在");
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        interfaceName: data?.name,
        ...values
      });
      message.success("调用成功");
      setInvokeRes(res.data);
    } catch (error: any) {
      setInvokeRes("");
      message.error("调用失败，" + error.message);
    } finally {
      setInvokeLoading(false);
    }
  }

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {
          data ?
            <Descriptions title={data?.name} column={1}>
              <Descriptions.Item label="接口状态">{data?.status ? '正常' : '关闭'}</Descriptions.Item>
              <Descriptions.Item label="描述">{data?.description}</Descriptions.Item>
              <Descriptions.Item label="请求地址">{data?.url}</Descriptions.Item>
              <Descriptions.Item label="请求方法">{data?.method}</Descriptions.Item>
              <Descriptions.Item label="请求参数">{data?.requestParams}</Descriptions.Item>
              <Descriptions.Item label="请求头">{data?.requestHeader}</Descriptions.Item>
              <Descriptions.Item label="响应头">{data?.responseHeader}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{data?.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{data?.updateTime}</Descriptions.Item>
            </Descriptions>
            : <>接口不存在</>
        }
      </Card>
      <Divider/>
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">调用</Button>
            <Divider/>
            <Button type="primary" onClick={handleOpen}>获取调用次数</Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="测试结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default InterfaceInfo;
