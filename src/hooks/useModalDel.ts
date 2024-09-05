import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { h } from 'vue';

function uConfirm(desc: String, callback?: () => void) {
  const descH = h("span", { style: 'color:red;' }, `${desc}`);
  const descH2 = h("span", "吗？");
  Modal.confirm({
    title: "删除",
    icon: h(ExclamationCircleOutlined),
    content: h('div', ["确定", descH, descH2]), // `确定删除吗？` + //h('span', { style: 'color:red;' }, `${desc}`)
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    centered: true,
    closable: true,
    maskClosable: true,
    onOk() {
      callback && callback()
    },
  });
}

export function useBottom() {
  return { uConfirm }
}
