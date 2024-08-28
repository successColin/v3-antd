// <SchemaForm @submit="confirm" />

// import { useForm } from '@/components/core/schema-form';
// import { message } from 'ant-design-vue';
// import { schemas } from './form-schema';
// const [SchemaForm, dynamicFormRef] = useForm({
//   labelWidth: 120,
//   schemas,
//   actionColOptions: {
//     span: 24,
//   },
//   fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']],
// });
// 点击提交
// function confirm() {
//   console.log('dynamicFormRef', dynamicFormRef);
//   dynamicFormRef.validate().then((v) => {
//     console.log('v', v);
//     message.success('验证通过！');
//   });
// }
// defineOptions({
//   name: 'DemosFormRequestForm',
// });

import type { FormSchema } from '@/components/core/schema-form/';
import { waitTime } from '@/utils/common';
export const schemas: FormSchema[] = [
  {
    field: 'framework',
    component: 'RadioGroup',
    label: '三大框架',
    defaultValue: 1,
    componentProps: {
      optionType: 'button',
      buttonStyle: 'solid',
      options: [
        {
          label: 'Vue',
          value: 1,
        },
        {
          label: 'React',
          value: 2,
        },
        {
          label: 'Angular',
          value: 3,
        },
      ],
    },
  },
  {
    field: 'lib',
    component: 'Select',
    label: '框架常用库',
    required: true,
    componentProps: {
      /** 类似于 vue 中的 watch */
      request: {
        watchFields: ['framework'],
        options: {
          immediate: true,
        },
        callback: async ({ formModel }) => {
          console.log('values', formModel);
          formModel['lib'] = undefined;
          return fetchLibData(formModel['framework']);
        },
      },
    },
  },
];

const fetchLibData = async (framework?: number) => {
  if (!framework) return [];
  await waitTime(3000);
  if (framework === 1) {
    return [
      {
        label: 'vue-router',
        value: 'vue-router',
      },
      {
        label: 'vuex',
        value: 'vuex',
      },
    ];
  } else if (framework === 2) {
    return [
      {
        label: 'react-router',
        value: 'react-router',
      },
      {
        label: 'redux',
        value: 'redux',
      },
    ];
  } else if (framework === 3) {
    return [
      {
        label: 'rxjs',
        value: 'rxjs',
      },
      {
        label: 'ng-zorro-antd',
        value: 'ng-zorro-antd',
      },
    ];
  }
};
