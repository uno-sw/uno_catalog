import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useSnackbar } from 'notistack'

import { Link } from '../productEntity'
import { useProductDetails } from './useProductDetails'
import { APIError, NetworkError } from '../../../errors'

interface Props {
  open: boolean
  onClose?: () => void
  link: Link | null
}

export const RemoveProductLinkDialog: React.VFC<Props> = (props) => {
  const { open, onClose, link } = props
  const { removeProductLink } = useProductDetails()
  const { enqueueSnackbar } = useSnackbar()

  const onRemoveButtonPressed = async () => {
    if (!link) {
      return
    }

    try {
      await removeProductLink(link.id)
      if (onClose) {
        onClose()
      }
    } catch (e) {
      if (e instanceof NetworkError) {
        enqueueSnackbar('ネットワークに接続されていません', { action: retryButton })
      } else if (e instanceof APIError) {
        enqueueSnackbar('サーバーエラーが発生しました', { action: retryButton })
      }
    }
  }

  const retryButton =
    <Button color="secondary" onClick={onRemoveButtonPressed}>再試行</Button>

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="remove-link-title"
      aria-describedby="remove-link-description"
    >
      <DialogTitle id="remove-link-title">
        「{link?.title}」を削除してもよろしいですか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="remove-link-description">
          削除したリンクは元に戻せません。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button color="primary" autoFocus onClick={onRemoveButtonPressed}>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  )
}
