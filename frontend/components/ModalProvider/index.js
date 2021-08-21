import React from 'react';
import { Modal } from 'antd';
import { observer } from 'helpers';
import { useStore } from 'helpers/hooks';

export default observer(function ModalProvider() {
  const modal = useStore('modal');

  function onOk() {
    modal.data.onOk && modal.data.onOk();
    modal.set(null);
  }

  return <Modal
    visible={!!modal.data}
    onOk={onOk}
    {...modal.data}
  />;
});
