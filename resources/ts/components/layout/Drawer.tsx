import React, { MouseEventHandler } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import MuiDrawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AppsIcon from '@material-ui/icons/Apps'
import EditIcon from '@material-ui/icons/Edit'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useSnackbar } from 'notistack'

import { APIError, NetworkError } from '../../errors'
import { useAuth } from '../../features/auth/useAuth'

interface Props {
  open: boolean
  onClose?: () => void
}

export const DRAWER_WIDTH = 250

const useStyles = makeStyles(theme =>
  createStyles({
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
  }),
)

export const Drawer: React.VFC<Props> = ({ open, onClose }) => {
  const { user, logout } = useAuth()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const onLogoutButtonClicked: MouseEventHandler = async event => {
    event.preventDefault()

    try {
      await logout()
      enqueueSnackbar('ログアウトしました')
    } catch (e) {
      if (e instanceof NetworkError) {
        enqueueSnackbar('ネットワークに接続されていません', { action: RetryButton })
      } else if (e instanceof APIError) {
        enqueueSnackbar('ログアウト中にエラーが発生しました', { action: RetryButton })
      }
    }
  }

  const RetryButton = (
    <Button color="secondary" size="small" onClick={onLogoutButtonClicked}>
      再試行
    </Button>
  )

  return (
    <>
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={onClose}
        classes={{ paper: classes.drawerPaper }}
      >
        {user &&
          <>
            <ListItem component="div">
              <ListItemAvatar>
                <Avatar>{user.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
            <ListItem button dense onClick={onLogoutButtonClicked}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText>ログアウト</ListItemText>
            </ListItem>
            <Divider />
          </>}
        <List component="div">
          <DrawerMenuItem path="/">
            <ListItemIcon><AppsIcon /></ListItemIcon>
            <ListItemText>製品一覧</ListItemText>
          </DrawerMenuItem>
          <DrawerMenuItem path="/tags">
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText>タグを編集</ListItemText>
          </DrawerMenuItem>
        </List>
      </MuiDrawer>
    </>
  )
}

const DrawerMenuItem: React.VFC<{
  path: string
  children?: React.ReactNode
}> = ({ path, children }) => {
  const { pathname } = useLocation()

  return path === pathname
    ? <ListItem component="div" selected>{children}</ListItem>
    : <ListItem button component={RouterLink} to={path}>{children}</ListItem>
}
