import type { FormSchema } from '@/components/core/schema-form/'
import type { ExportModalResult } from './typing'

import { useFormModal } from '@/hooks/useModal/'

export type OpenModalOptions = {
  onOk: (val: ExportModalResult) => any
}

const getSchemas = (): FormSchema<ExportModalResult>[] => [
  {
    field: 'filename',
    component: 'Input',
    label: '文件名',
    rules: [{ required: true }]
  },
  {
    field: 'bookType',
    component: 'Select',
    label: '文件类型',
    defaultValue: 'xlsx',
    rules: [{ required: true }],
    componentProps: {
      options: [
        {
          label: 'xlsx',
          value: 'xlsx',
          key: 'xlsx'
        },
        {
          label: 'html',
          value: 'html',
          key: 'html'
        },
        {
          label: 'csv',
          value: 'csv',
          key: 'csv'
        },
        {
          label: 'txt',
          value: 'txt',
          key: 'txt'
        }
      ]
    }
  }
]

export const useExportExcelModal = () => {
  const [showModal] = useFormModal()

  const openModal = ({ onOk }: OpenModalOptions) => {
    showModal<ExportModalResult>({
      modalProps: {
        title: '导出数据',
        onFinish: async (values) => {
          const { filename, bookType } = values

          onOk({
            filename: `${filename.split('.').shift()}.${bookType}`,
            bookType
          })
        }
      },
      formProps: {
        labelWidth: 100,
        schemas: getSchemas()
      }
    })
  }

  return {
    openModal
  }
}
