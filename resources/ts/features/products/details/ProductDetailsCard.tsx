import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles } from '@material-ui/core/styles'

interface Props {
  label: string
  action: React.ReactNode
  children?: React.ReactNode
}

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      margin: theme.spacing(2, 0),
      overflow: 'hidden',
    },
    header: {
      alignItems: 'center',
      display: 'flex',
      minHeight: theme.spacing(8),
      padding: theme.spacing(1, 2),
    },
    title: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing(0, 2, 2),
    },
  }),
)

export const ProductDetailsCard: React.VFC<Props> = (props) => {
  const { label, action, children } = props
  const classes = useStyles()

  return (
    <Paper className={classes.container}>
      <div className={classes.header}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          component="h2"
          className={classes.title}
        >
          {label}
        </Typography>
        {action}
      </div>
      {children}
    </Paper>
  )
}

export const ProductDetailsCardContent: React.VFC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const classes = useStyles()

  return <div className={classes.content}>{children}</div>
}
