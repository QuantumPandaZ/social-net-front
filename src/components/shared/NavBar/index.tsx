import { BsPostcard } from 'react-icons/bs'
import { SlUserFollowing } from "react-icons/sl";
import { GiShadowFollower } from "react-icons/gi";
import { IoSearch } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../../features/user/user.slice'
import NavButton from '../NavButton'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'
import { FaRegSquarePlus, FaUser } from 'react-icons/fa6'
import { GoHomeFill } from 'react-icons/go';

interface NavBarProps {
  onCreatePost: () => void
}

function NavBar({ onCreatePost }: NavBarProps) {
  const currentUser = useSelector(selectCurrent)

  const isActive = useActiveNavLink

  const navItems = [
    {
      path: '/',
      icon: GoHomeFill,
      label: 'Посты',
    },
    {
      path: '/search',
      icon: IoSearch,
      label: 'Поиск',
    },
    {
      path: '#',
      icon: FaRegSquarePlus,
      label: 'Создать пост',
      onClick: onCreatePost,
    },
    {
      path: `users/${currentUser?.id}/following`,
      icon: SlUserFollowing,
      label: 'Подписки',
    },
    {
      path: `users/${currentUser?.id}/followers`,
      icon: GiShadowFollower,
      label: 'Подписчики',
    },
    {
      path: `/users/${currentUser?.id}`,
      icon: FaUser,
      label: 'Профиль',
    },
  ]

  return (
    <nav className="flex flex-col gap-2">
      <ul className="flex gap-2 flex-col">
        {navItems.map(({ path, icon: Icon, label, onClick }) => (
          <li className="flex flex-col gap-5" key={path}>
            <NavButton
              href={path}
              icon={<Icon />}
              isActive={isActive(path)}
              onClick={onClick}
            >
              {label}
            </NavButton>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
