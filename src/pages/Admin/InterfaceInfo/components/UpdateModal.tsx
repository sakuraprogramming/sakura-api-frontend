import '@umijs/max';
import React, {useEffect, useRef} from 'react';
import {Modal} from "antd";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {ProFormInstance} from "@ant-design/pro-form/lib";

export type Props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (value: any) => Promise<void>;
  visible: boolean;
};
const UpdateModal: React.FC<Props> = (props) => {
  const {values, columns, visible, onCancel, onSubmit} = props;
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (formRef?.current) {
      formRef?.current?.setFieldsValue(values);
    }
  }, [values]);
  return (
    <Modal footer={null} onCancel={() => onCancel?.()} open={visible}>
      <ProTable
        formRef={formRef}
        type="form"
        columns={columns}
        onSubmit={(value) => {
          onSubmit?.(value);
        }}/>
    </Modal>
  );
};
export default UpdateModal;
