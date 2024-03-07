import {PageContainer} from "@ant-design/pro-components";

import ReactECharts from 'echarts-for-react';
import {useEffect, useState} from "react";
import {message} from "antd";
import {listTopInvokeInterfaceInfoUsingGet} from "@/services/sakura-api-backend/analysisController";

const InterfaceAnalysis: React.FC = () => {

  const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listTopInvokeInterfaceInfoUsingGet();
      if (res.data) {
        setData(res?.data);
      }
    } catch (error: any) {
      message.error("获取数据失败，" + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);
  const charData = data.map(item => ({value: item.totalNum, name: item.name}));

  const option = {
    title: {
      text: '调用次数最多的接口（Top3）',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: charData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };


  return (
    <PageContainer title="接口分析">
      <ReactECharts loadingOption={{
        showLoading: loading
      }}
                    option={option}/>
    </PageContainer>
  )

}


export default InterfaceAnalysis;
