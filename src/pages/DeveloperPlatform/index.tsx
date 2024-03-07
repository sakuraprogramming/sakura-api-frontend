import {PageContainer} from "@ant-design/pro-components";
import {Card, message} from "antd";
import {Button} from "antd/lib";
import React, {useEffect, useState} from "react";
import {getUserApiByIdUsingGet, regenerateApiUsingPost} from "@/services/sakura-api-backend/userController";
import {Typography} from 'antd';
import {DownloadOutlined} from "@ant-design/icons";

const {Paragraph} = Typography;
const DeveloperPlatform: React.FC = () => {
  const [apiData, setApiData] = useState<API.UserResponseVO>()

  const loadData = async () => {
    try {
      const res = await getUserApiByIdUsingGet();
      if (res.data) {
        setApiData(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const regenerateData = async () => {
    try {
      const res = await regenerateApiUsingPost();
      if (res.data) {
        setApiData(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  }

  const toSDK = () => {
    window.open("https://github.com/sakuraprogramming/sakura-api-client-sdk.git");
  }

  return (
    <PageContainer title="开发者中心">
      <Card title="开发者密钥(调用接口的凭证)" extra={<Button onClick={regenerateData}>重新生成</Button>}>
        <Paragraph copyable={{text: apiData?.accessKey}}>AccessKey: {apiData?.accessKey}</Paragraph>
        <Paragraph copyable={{text: apiData?.secretKey}}>SecretKey: {apiData?.secretKey}</Paragraph>
      </Card>
      <Card title="开发者SDK">
        <Button onClick={toSDK}>
          <DownloadOutlined/> Java SDK
        </Button>
      </Card>
    </PageContainer>
  )

}

export default DeveloperPlatform;
