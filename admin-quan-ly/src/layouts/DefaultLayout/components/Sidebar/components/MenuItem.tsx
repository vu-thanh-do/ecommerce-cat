import { BarChartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineControl, AiOutlineFontSize } from 'react-icons/ai'
import { BiCategoryAlt, BiSolidCategoryAlt } from 'react-icons/bi'
import { FaClipboardList, FaImages, FaRegNewspaper, FaUserEdit, FaUserFriends } from 'react-icons/fa'

import type { MenuProps } from 'antd'
import { HiCollection } from 'react-icons/hi'
import { IoTicket } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}
export const items: MenuProps['items'] = [
  getItem(<NavLink to={`/manager/products`}>Quản lý</NavLink>, 'products', <ShoppingOutlined />),
  getItem('Người dùng', 'users', <UserOutlined />, [
    getItem(<NavLink to={`/manager/sliders`}>Sliders</NavLink>, 'sliders', <FaImages />),
    getItem(<NavLink to={`/manager/customers`}>Người mua</NavLink>, 'customers', <FaUserFriends />),
    getItem(<NavLink to={`/manager/staffs`}>Người bán</NavLink>, 'staffs', <FaUserEdit />)
  ])
]
export const itemsStaff: MenuProps['items'] = [
  getItem(<NavLink to={`/dashboard`}>Thống kê</NavLink>, 'dashboard', <BarChartOutlined />),
  getItem(<NavLink to={`/manager/orders`}>Đơn hàng</NavLink>, 'orders', <FaClipboardList />),
  getItem('Quản lý', 'manager', <AiOutlineControl />, [
    getItem(<NavLink to={`/manager/products`}>Quản lý</NavLink>, 'products', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Giống mèo</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/toppings`}>Đặc điểm</NavLink>, 'toppings', <HiCollection />)
  ]),
  getItem(<NavLink to={`/manager/feedback`}>Quản lý đánh giá</NavLink>, 'dashboardxs')
]
