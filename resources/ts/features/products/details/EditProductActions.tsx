import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

interface Props {
  disableCancel?: boolean
  disableSave?: boolean
  saving?: boolean
  onCancel: () => void
  onSave: () => void
}

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2),
    },
    lastButton: {
      marginLeft: theme.spacing(1),
    },
  }),
)

export const EditProductActions: React.VFC<Props> = (props) => {
  const { disableCancel, disableSave, saving, onCancel, onSave } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Button disabled={disableCancel} onClick={onCancel}>キャンセル</Button>
      <Button
        disabled={disableSave}
        color="primary"
        className={classes.lastButton}
        onClick={onSave}
      >
        {saving
          ? <>
              <CircularProgress size={24} />
              <Typography variant="srOnly">保存中…</Typography>
            </>
          : '保存'}
      </Button>
    </div>
  )
}
