import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Image } from '@nextui-org/react'
import { MdOutlinePersonAddAlt1 } from 'react-icons/md'
import { MdOutlinePersonAddDisabled } from 'react-icons/md'
import { useDisclosure } from '@nextui-org/react'
import { BASE_URL } from '../../constants'
import { CiEdit } from 'react-icons/ci'
import { resetUser, selectCurrent } from '../../features/user/user.slice'
import {
  useGetUserByIdQuery,
  useLazyCurrentUserQuery,
  useLazyGetUserByIdQuery,
} from '../../app/services/user.api'
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
} from '../../app/services/follow.api'
import GoBack from '../../components/shared/GoBack'
import ProfileInfo from '../../components/shared/ProfileInfo'
import { formatToClientDate } from '../../utils/formatToClientDate'
import CountInfo from '../../components/ui/CountInfo'
import { FiUsers } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'

import Confetti from 'react-confetti'
import { useWindowSize } from '../../hooks/useWindowSize'
import EditProfile from '../../components/shared/EditProfile'

function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useSelector(selectCurrent)
  const { data: user } = useGetUserByIdQuery({ id: id ?? '' }, { skip: !id })
  const [followUser] = useCreateFollowMutation()
  const [unfolowUser] = useDeleteFollowMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentUserQuery()

  const [party, setParty] = useState(false)
  const size = useWindowSize()

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    [],
  )

  const handleFollow = async () => {
    try {
      if (id) {
        if (user?.isFollowing) {
          unfolowUser({ followingId: id }).unwrap()
          setParty(false)
        } else {
          followUser({ followingId: id }).unwrap()
          setParty(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <GoBack />
      <Confetti
        width={size.width}
        height={size.height}
        recycle={false}
        run={party}
        onConfettiComplete={Confetti => {
          setParty(false)
          if (Confetti) {
            Confetti.reset()
          }
        }}
      />
      <div className="flex lg:flex-row flex-col items-stretch gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}${user.avatarUrl}`}
            alt={user.name}
            width={200}
            height={200}
            isBlurred
            className="object-cover border-4 border-white"
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {user.name}
            {currentUser?.id !== user.id ? (
              <Button
                color={user?.isFollowing ? 'default' : 'primary'}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                endContent={
                  user?.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {user?.isFollowing ? 'Отписаться' : 'Подписаться'}
              </Button>
            ) : (
              <Button
                endContent={<CiEdit />}
                onClick={() => onOpen()}
                variant="ghost"
                color="warning"
              >
                Редактировать
              </Button>
            )}
          </div>
        </Card>
        <Card className="flex flex-col space-y-2 p-5 flex-1">
          <ProfileInfo title="Почта" info={user.email} />
          <ProfileInfo title="Местоположение" info={user.location} />
          <ProfileInfo
            title="Дата рождения"
            info={
              user.dateOfBirth
                ? formatToClientDate(user.dateOfBirth, false)
                : ''
            }
          />
          <ProfileInfo title="Обо мне" info={user.bio} />

          <div className="flex gap-2 justify-center flex-wrap">
            <CountInfo
              Icon={FaUsers}
              count={user.followers.length}
              title="Подписчики"
            />
            <CountInfo
              Icon={FiUsers}
              count={user.following.length}
              title="Подписки"
            />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={onClose} user={user} />
    </>
  )
}

export default UserProfile
