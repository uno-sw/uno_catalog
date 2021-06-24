import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import MuiAppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'

interface Props {
  title: string
  variant: 'normal' | 'prominent' | 'attachFab'
  actions?: React.ReactNode
  onMenuButtonPressed?: () => void
  className?: string
}

export const PROMINENT_HEIGHT = 128

const useStyles = makeStyles(theme =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    prominentToolbar: {
      alignItems: 'flex-start',
      minHeight: PROMINENT_HEIGHT,
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
    prominentTitle: {
      alignSelf: 'flex-end',
      flexGrow: 1,
    },
    attachFabTitle: {
      alignSelf: 'flex-end',
      flexGrow: 1,
      marginLeft: theme.spacing(4),
    },
  }),
)

export const AppBar: React.VFC<Props> = (props) => {
  const {
    title,
    variant,
    actions,
    onMenuButtonPressed,
    className,
  } = props
  const classes = useStyles()

  return (
    <>
      <MuiAppBar position="static" className={className}>
        <Toolbar
          className={
            variant === 'normal' ? undefined : classes.prominentToolbar
          }
        >
          <IconButton
            edge="start"
            color="inherit"
            className={classes.menuButton}
            aria-label="ドロワーを開く"
            onClick={onMenuButtonPressed}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant={variant === 'normal' ? 'h6' : 'h5'}
            component="h1"
            noWrap
            className={
              variant === 'normal'
                ? classes.title
                : variant === 'attachFab'
                    ? classes.attachFabTitle
                    : classes.prominentTitle
            }
          >
            {title}
          </Typography>
          {actions}
        </Toolbar>
      </MuiAppBar>
    </>
  )
}
