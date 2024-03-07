import '@umijs/max';
import React, {useRef} from 'react';
import {Modal} from "antd";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {ProFormInstance} from "@ant-design/pro-form/lib";

export type Props = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (value: any) => Promise<void>;
  visible: boolean;
};
const CreateModal: React.FC<Props> = (props) => {
  const {columns, visible, onCancel, onSubmit} = props;
  const formRef = useRef<ProFormInstance>();
  return (
    <Modal footer={null} onCancel={() => onCancel?.()} open={visible}>
      <ProTable type="form" columns={columns} formRef={formRef}
                onSubmit={(value) => {
                  const temp = {};
                  columns.forEach(item => {
                    // @ts-ignore
                    temp[item?.dataIndex] = "";
                  })
                  formRef.current?.setFieldsValue(temp);
                  onSubmit?.(value);
                }}/>
    </Modal>
  );
};
export default CreateModal;
