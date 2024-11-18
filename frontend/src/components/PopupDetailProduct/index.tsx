import { FaAngleDown, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect, useState } from 'react'

import { CartItem } from '../../store/slices/types/cart.type'
import { IProduct } from '../../interfaces/products.type'
import { addToCart } from '../../store/slices/cart.slice'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './PopupDetailProduct.module.scss'
import { useCreateCartDBMutation } from '../../api/cartDB'
import { v4 as uuidv4 } from 'uuid'
import { Button, DatePicker, Form, Input } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment'
import dayjs from 'dayjs'

type PopupDetailProductProps = {
  showPopup: boolean
  togglePopup: () => void
  product: any
}

const PopupDetailProduct = ({ showPopup, togglePopup, product }: PopupDetailProductProps) => {
  console.log(product, 'product')
  const dispatch = useAppDispatch()
  /* set state trạng thái */
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [totalToppingPrice, setTotalToppingPrice] = useState<number>(0)
  const [addCartDbFn] = useCreateCartDBMutation()
  const [sizes, setSizes] = useState<{ name: string; price: number }[]>([])
  const [dateCheck, setDateCheck] = useState(0)
  // const [nameRadioInput, setNameRadioInput] = useState<string>(product.sizes[0].name);
  const [nameRadioInput, setNameRadioInput] = useState<{
    name: string
    price: number
    _id?: string
  }>()
  const [checkedToppings, setCheckedToppings] = useState<{ name: string; price: number; _id: string }[]>([])
  const [checkedkindOfRoom, setCheckedkindOfRoom] = useState<{ name: string; price: number }[]>([])
  const [timBooking, setTimBooking] = useState<number>(0)

  const { user } = useAppSelector((state) => state.persistedReducer.auth)
  /* xử lý sự kiện check box phân topping */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const toppingPrice = Number(event.target.value)
    const toppingName = event.target.name
    const _idTopping = event.target.getAttribute('data-items') as string

    const data = { name: toppingName, price: toppingPrice, _id: _idTopping }
    const dataRoomBook = { name: toppingName, price: toppingPrice }

    if (event.target.checked) {
      setTotalToppingPrice((prev) => prev + toppingPrice)
      setPrice((prev) => prev + toppingPrice)
      setCheckedToppings((prev) => [...prev, data])
    } else {
      setTotalToppingPrice((prev) => prev - toppingPrice)
      setPrice((prev) => prev - toppingPrice)
      setCheckedToppings((prev) => {
        return prev.filter((topping) => topping.name !== toppingName)
      })
    }
  }

  // const handleGetInfoPrd = (data: any) => {

  // }

  useEffect(() => {
    if (product.sizes) {
      setPrice(product?.sizes[0]?.price ?? 0)
      setNameRadioInput(product?.sizes[0] ?? { name: '', price: 0 })
      setSizes([...product.sizes])
    }
    setQuantity(1)
    setTotalToppingPrice(0)
    setCheckedToppings([])
    // setNameRadioInput(product.sizes[0].name);

    //reset checkbox when popup close
    // const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // checkboxes.forEach((item: any) => (item.checked = false));
  }, [product])

  const handleAddToCart = (checkFavorite: any) => {
    togglePopup()
    const data = {
      name: product.name,
      size: nameRadioInput,
      toppings: checkedToppings,
      timBooking: Number(timBooking * product.timBooking),
      kindOfRoom: checkedkindOfRoom,
      quantity,
      image: product.images[0]?.url ?? '',
      price: (product.sale && nameRadioInput && product.sale) as number,
      total: product.sale ? product.sale * quantity : product.sale,
      product: product._id,
      sale: product?.sale ? product.sale : 0
    }
    if (user._id !== '' && user.accessToken !== '') {
      const { sale, name, ...rest } = data
      addCartDbFn({
        name: name,
        isFavorite: checkFavorite == 1 ? false : true,
        items: [
          {
            ...rest,
            image: rest.image,
            size: data.size?._id as string,
            toppings: data.toppings.map((item) => item?._id as string)
          }
        ]
      })
    } else {
      dispatch(addToCart(data as CartItem))
    }
  }
  const disabledDate = (current: dayjs.Dayjs | null) => {
    // Kiểm tra nếu ngày hiện tại lớn hơn ngày hiện tại
    return current && current.isBefore(dayjs(), 'day')
  }
  const onDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dateStrings[0])
      const endDate = dayjs(dateStrings[1])
      const duration = endDate.diff(startDate, 'day') + 1 // +1 để bao gồm cả ngày cuối cùng
      console.log(duration, 'number of days')
      setDateCheck(duration)
      const newValue = duration
      const previousValue = timBooking
      setTimBooking(newValue)
      const priceChange = Number(newValue) - Number(previousValue)
      setPrice((prevPrice) => prevPrice + priceChange * product.timBooking)
    }
  }

  if (!product) return null

  return (
    <div
      className={`transition-opacity ease-in-out duration-[400ms] z-[11] ${
        showPopup ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='popup w-[90vw] h-[100vw] md:w-[1150px] md:h-[800px] fixed top-[5%] left-[5vw]   2xl:top-[calc(60%-500px)] lg:top-[calc(35%-250px)] md:left-[calc(31%-325px)] 2xl:left-[calc(40%-325px)] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.06)] rounded-[3px] pt-[10px] pb-[10px] flex justify-center z-[5] bg-[#fbfbfb]'>
        <div
          onClick={() => {
            togglePopup()
            setDateCheck(0)
          }}
          className='close-btn absolute top-2 right-2 cursor-pointer z-[6]'
        >
          <FaTimes className='text-2xl font-[900] transition-all hover:scale-[1.2]' />
        </div>
        <div className='content w-full overflow-hidden'>
          <div className='flex flex-col h-full rounded-md'>
            <div className='info flex px-5 pb-3'>
              <div className='left flex-1 md:flex-none w-[150px] h-[150px] md:w-[180px] md:h-[180px]'>
                <img
                  className='w-full h-full rounded-md max-w-[150px] max-h-[150px] md:max-w-[180px] md:max-h-[180px]'
                  src={product?.images[0]?.url}
                  alt='product image'
                />
              </div>
              <div className='right md:flex-none flex-1 ml-4'>
                <div className='title mr-4'>
                  <h4 className='line-clamp-2 text-lg font-semibold'>{product.name}</h4>
                </div>
                <div className='price flex items-end mt-4'>
                  <span className='new-price pr-[10px] text-[#8a733f] font-semibold text-sm'>
                    {product.sale > 0
                      ? formatCurrency(product.sale * quantity)
                      : formatCurrency(product.sale * quantity)}
                  </span>

                  {/* {product.sale ? <span className='old-price text-xs line-through'>{formatCurrency(price)}</span> : ''} */}
                </div>
                <div className='quantity md:items-center gap-y-2 md:flex-row flex flex-col items-start mt-5'>
                  <div className='change-quantity flex'>
                    <div
                      onClick={() => (quantity === 1 ? setQuantity(1) : setQuantity((prev) => prev - 1))}
                      className='decrease text-white bg-[#799dd9] w-5 h-5 rounded-[50%] leading-[19px] text-[26px] font-semibold  text-center cursor-pointer select-none '
                    >
                      -
                    </div>
                    <div className='amount select-none px-[10px] text-sm'>{quantity}</div>
                    <div
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className='increase text-white bg-[#799dd9] w-5 h-5 rounded-[50%] leading-[20px] text-[26px] font-semibold  text-center cursor-pointer select-none'
                    >
                      +
                    </div>
                  </div>
                  <button className='cursor-auto btn-price bg-[#d8b979] text-white px-5 h-8 rounded-[32px] leading-[32px] md:ml-[30px] text-sm'>
                    +
                    {product.sale > 0
                      ? formatCurrency(
                          product.sale &&
                            // ? price * ((100 - product.sale) / 100) * quantity
                            product.sale * quantity
                        )
                      : formatCurrency(product.sale * quantity)}
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(1)
                    }}
                    className='btn-price bg-[#d8b979] text-white px-5 h-8 rounded-[32px] leading-[32px] md:ml-[10px] text-sm'
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(2)
                    }}
                    className='btn-price bg-pink-500 text-white px-5 h-8 rounded-[32px] leading-[32px] md:ml-[10px] text-sm'
                  >
                    Yêu thích
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(2)
                    }}
                    className='btn-price bg-pink-500 text-white px-5 h-8 rounded-[32px] leading-[32px] md:ml-[10px] text-sm'
                  >
                    Xem thông tin người bán
                  </button>
                </div>
              </div>
            </div>
            <div className={`customize h-1/2 overflow-y-scroll p-5 grow mb-5 ${styles.popup_body}`}>
              <div className='flex'>
                <div className='custom-size mb-4'>
                  <div className='title flex items-center justify-between px-5 mb-2'>
                    <div className='left text-base font-semibold'>Giới tính</div>
                    <div className='right'>
                      <FaAngleDown />
                    </div>
                  </div>
                  <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                    {product?.sex}
                  </div>
                </div>
                <div className='custom-size mb-4'>
                  <div className='title flex items-center justify-between px-5 mb-2'>
                    <div className='left text-base font-semibold'>Nguồn gốc</div>
                    <div className='right'>
                      <FaAngleDown />
                    </div>
                  </div>
                  <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                    {product?.origin}
                  </div>
                </div>
                <div className='custom-size mb-4'>
                  <div className='title flex items-center justify-between px-5 mb-2'>
                    <div className='left text-base font-semibold'>Cân nặng</div>
                    <div className='right'>
                      <FaAngleDown />
                    </div>
                  </div>
                  <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                    {product?.weight}
                  </div>
                </div>
                <div className='custom-size mb-4'>
                  <div className='title flex items-center justify-between px-5 mb-2'>
                    <div className='left text-base font-semibold'>Giống mèo</div>
                    <div className='right'>
                      <FaAngleDown />
                    </div>
                  </div>
                  <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                    {product?.category?.name}
                  </div>
                </div>
              </div>
              <div className='custom-topping'>
                <div className='title flex items-center justify-between px-5 mb-2'>
                  <div className='left text-base font-semibold'>Đặc điểm</div>
                  <div className='right'>
                    <FaAngleDown />
                  </div>
                </div>
                <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0_rgba(0,0,0,.05)] rounded'>
                  {product &&
                    product.toppings.map((item: any) => {
                      return (
                        <div key={item._id} className='topping-wrap flex items-center justify-between w-full'>
                          <label className={`${styles.container_checkbox} group block w-full  !pl-0`}>
                            <span className='text-sm capitalize'>{item.name}</span>
                          </label>
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className='custom-topping pt-3'>
                <div className='title flex items-center justify-between px-5 mb-2'>
                  <div className='left text-base font-semibold'>Tính cách</div>
                  <div className='right'>
                    <FaAngleDown />
                  </div>
                </div>
                <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0_rgba(0,0,0,.05)] rounded'>
                  <div className='custom-size mb-4'>
                    <div className='custom-content flex  bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                      {product?.timBooking}
                    </div>
                  </div>
                </div>
              </div>
              <div className='custom-topping pt-3'>
                <div className='title flex items-center justify-between px-5 mb-2'>
                  <div className='left text-base font-semibold'>Mô tả</div>
                  <div className='right'>
                    <FaAngleDown />
                  </div>
                </div>
                <div className='custom-content flex px-5 bg-white flex-wrap shadow-[0px_0px_12px_0_rgba(0,0,0,.05)] rounded'>
                  <div className='custom-size mb-4'>
                    <div className='custom-content flex  bg-white flex-wrap shadow-[0px_0px_12px_0px_rgba(0,0,0,.05)] rounded'>
                      {product?.description}
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className='custom-topping pt-3'>
                <div className='title flex items-center justify-between px-5 mb-2'>
                  <div className='left text-base font-semibold'>Bình luận</div>
                  <div className='right'>
                    <FaAngleDown />
                  </div>
                </div>
                <div className='px-5'>
                  <Form
                    name='basic'
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete='off'
                  >
                    <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
                      <Input.TextArea
                        className='rounded-md border border-[#ccc] h-[38px] w-full'
                        placeholder='nhập bình luận '
                      />
                    </Form.Item>
                    <Form.Item label={null}>
                      <Button type='primary' htmlType='submit'>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </div>
      <div onClick={togglePopup} className={`${styles.overlay}`}></div>
    </div>
  )
}

export default PopupDetailProduct
