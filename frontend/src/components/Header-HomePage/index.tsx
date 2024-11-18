import { FaBars, FaSearch, FaTimes } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { RiAccountPinCircleLine } from 'react-icons/ri'

import { Auth } from '../../api/Auth'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { RootState } from '../../store/store'
import styles from './HeaderHomePage.module.scss'
import { useGetAllBlogCategoryQuery } from '../../api/NewBlogs'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'

const HeaderHomePage = () => {
  const [isHeaderFixed, setHeaderFixed] = useState(false)
  const [fetchUser] = Auth.endpoints.fetchUser.useLazyQuery()
  const { user } = useSelector((state: RootState) => state.persistedReducer.auth)
  const { data: blogCategories } = useGetAllBlogCategoryQuery()
  const { i18n } = useTranslation()
  const { t } = useTranslation(['header'])
  const changeLanguage = (lng: 'en' | 'vi') => {
    Cookies.set('language', lng)
    i18n.changeLanguage(lng)
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHeaderFixed(true)
      } else {
        setHeaderFixed(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => {
    menuRef.current?.classList.toggle('show__menu')
    overlayRef.current?.classList.toggle('hidden')
  }

  return (
   <></>
  )
}

export default HeaderHomePage
