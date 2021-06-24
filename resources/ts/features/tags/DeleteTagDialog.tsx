import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useSnackbar } from 'notistack'

import { Tag } from '../products/productEntity'
import client from '../../client'
import { OK } from '../../util'

interface Props {
  open: boolean
  onClose?: () => void
  onDelete?: (id: number) => void
  tag: Tag
}

export const DeleteTagDialog: React.VFC<Props> = (props) => {
  const { open, onClose, onDelete, tag } = props
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = async () => {
    setIsProcessing(true)

    const wait = new Promise<void>(r => setTimeout(r, 1000))
    const request = client.delete(`/api/tags/${tag.id}`)
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      setIsProcessing(false)
      enqueueSnackbar('ネットワークに接続されていません', { action: retryButton })
      return
    }

    if (response.status !== OK) {
      setIsProcessing(false)
      enqueueSnackbar('サーバーエラーが発生しました', { action: retryButton })
      return
    }

    enqueueSnackbar(`${tag.label}を削除しました`)

    if (onDelete) {
      onDelete(tag.id)
    }

    if (onClose) {
      onClose()
    }
  }

  const retryButton = (
    <Button size="small" color="secondary" onClick={handleDelete}>再試行</Button>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-tag-title"
      aria-describedby="delete-tag-description"
    >
      <DialogTitle id="delete-tag-title">
        {tag.label}を削除してもよろしいですか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-tag-description">
          すべての製品からこのタグが削除されます。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={isProcessing} onClick={onClose}>
          キャンセル
        </Button>
        <Button color="primary" disabled={isProcessing} onClick={handleDelete}>
          {isProcessing ? <CircularProgress size={24} /> : '削除'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
