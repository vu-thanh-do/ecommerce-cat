import { Drawer, Form, Input, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { RootState, useAppDispatch } from '~/store/store'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddCategoryMutation, useUpdateCategoryMutation } from '~/store/services'
import { messageAlert } from '~/utils/messageAlert'

type FormCategoryProps = {
  open: boolean
}

const FormCategory = ({ open }: FormCategoryProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const { cateData } = useAppSelector((state: RootState) => state.categories)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  cateData._id &&
    form.setFieldsValue({
      name: cateData.name
    })
  const onFinish = async (values: { name: string }) => {
    if (cateData._id) {
      updateCategory({ _id: cateData._id, ...values })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật giống mèo thành công', 'success')
          onClose()
        })
        .catch(() => messageAlert('Cập nhật giống mèo thất bại', 'error'))
      return
    }
    addCategory({ ...values, owner: user._id })
      .unwrap()
      .then(() => {
        message.success('Thêm giống mèo thành công')
        dispatch(setOpenDrawer(false))
        form.resetFields()
      })
      .catch(() => message.error('Thêm giống mèo thất bại'))
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    dispatch(setCategory({ _id: '', name: '' }))
    form.resetFields()
  }
  return (
    <Drawer
      title={cateData._id ? 'Cập nhật giống mèo' : 'Thêm giống mèo mới'}
      width={376}
      destroyOnClose
      onClose={onClose}
      getContainer={false}
      open={open}
    >
      <Form
        name='basic'
        autoComplete='off'
        layout='vertical'
        form={form}
        className='dark:text-white'
        onFinish={onFinish}
      >
        <Form.Item
          className='dark:text-white'
          label='Tên giống mèo'
          name='name'
          rules={[
            { required: true, message: 'Tên giống mèo không được bỏ trống !' },
            {
              validator: (_, value) => {
                if (value.trim() === '') {
                  return Promise.reject('Tên giống mèo không được chứa toàn khoảng trắng!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên giống mèo' />
        </Form.Item>

        <Form.Item>
          <Button
            disabled={isAdding || isUpdating ? true : false}
            icon={isAdding || (isUpdating && <LoadingOutlined />)}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {cateData._id ? 'Cập nhật giống mèo' : 'Thêm giống mèo'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default FormCategory
