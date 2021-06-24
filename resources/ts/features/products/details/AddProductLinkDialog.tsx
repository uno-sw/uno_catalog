import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useSnackbar } from 'notistack'

import { useProductDetails } from './useProductDetails'
import { APIError, NetworkError, ValidationError } from '../../../errors'

interface Props {
  open: boolean
  onClose?: () => void
}

const useStyles = makeStyles(theme =>
  createStyles({
    textField: {
      '&:not(:first-child)': {
        marginTop: theme.spacing(2),
      },
    },
  }),
)

export const AddProductLinkDialog: React.VFC<Props> = ({ open, onClose }) => {
  const [title, setTitle] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [errors, setErrors] =
    useState<{ title: string, url: string }>({ title: '', url: '' })
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { addProductLink } = useProductDetails()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (open) {
      setTitle('')
      setUrl('')
      setErrors({ title: '', url: '' })
      setIsProcessing(false)
    }
  }, [open])

  const canAdd = !isProcessing && title.trim() !== '' && url.trim() !== ''

  const onAddButtonPressed = async () => {
    if (!canAdd) {
      return
    }

    setIsProcessing(true)

    try{
      await addProductLink(title.trim(), url.trim())
      if (onClose) {
        onClose()
      }
    } catch (e) {
      setIsProcessing(false)

      if (e instanceof NetworkError) {
        enqueueSnackbar('ネットワークに接続されていません', { action: retryButton })
      } else if (e instanceof ValidationError) {
        const errors = { title: '', url: '' }
        if (e.messages.title && e.messages.title.length > 0) {
          errors.title = e.messages.title[0]
        }
        if (e.messages.url && e.messages.url.length > 0) {
          errors.url = e.messages.url[0]
        }
        setErrors(errors)
      } else if (e instanceof APIError) {
        enqueueSnackbar('サーバーエラーが発生しました', { action: retryButton })
      }
    }
  }

  const retryButton =
    <Button color="secondary" onClick={onAddButtonPressed}>再試行</Button>

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-link-title">
      <DialogTitle id="add-link-title">リンクを追加</DialogTitle>
      <DialogContent>
        <TextField
          label="タイトル"
          fullWidth
          autoFocus
          className={classes.textField}
          value={title}
          error={Boolean(errors.title)}
          helperText={errors.title}
          inputProps={{ maxLength: 20 }}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          type="url"
          label="URL"
          fullWidth
          className={classes.textField}
          value={url}
          error={Boolean(errors.url)}
          helperText={errors.url}
          inputProps={{ maxLength: 100 }}
          onChange={e => setUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button color="primary" disabled={!canAdd} onClick={onAddButtonPressed}>
          {isProcessing
            ? <>
                <CircularProgress size={24} />
                <Typography variant="srOnly">処理中…</Typography>
              </>
            : '追加'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
