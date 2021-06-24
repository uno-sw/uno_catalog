import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { useSnackbar } from 'notistack'

import { useProducts } from './useProducts'
import { APIError, NetworkError, ValidationError } from '../../../errors'

interface Props {
  open: boolean
  onClose: () => void
  onProductRegistered: (id: number, name: string) => void
}

export const RegisterProductDialog: React.VFC<Props> = (props) => {
  const { open, onClose, onProductRegistered } = props
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { registerProduct } = useProducts()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (open) {
      setName('')
      setError('')
      setIsProcessing(false)
    }
  }, [open])

  const canRegister = !isProcessing && name.trim() !== ''

  const handleClose = () => {
    if (isProcessing) {
      return
    }

    onClose()
  }

  const register = async () => {
    if (!canRegister) {
      return
    }

    setIsProcessing(true)
    try {
      const id = await registerProduct(name.trim())
      onProductRegistered(id, name.trim())
      onClose()
    } catch (e) {
      setIsProcessing(false)
      if (e instanceof NetworkError) {
        enqueueSnackbar('ネットワークに接続されていません', { action: RetryButton })
      } else if (e instanceof ValidationError) {
        setError(e.messages.name[0])
      } else if (e instanceof APIError) {
        enqueueSnackbar('サーバーエラーが発生しました', { action: RetryButton })
      }
    }
  }

  const RetryButton =
    <Button color="secondary" size="small" onClick={register}>再試行</Button>

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      aria-labelledby="register-product-dialog-title"
    >
      <DialogTitle id="register-product-dialog-title">製品を登録</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="製品名"
          margin="dense"
          value={name}
          helperText={error}
          error={Boolean(error)}
          inputProps={{ maxLength: 100 }}
          onChange={e => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          キャンセル
        </Button>
        <Button
          color="primary"
          disabled={!canRegister}
          onClick={register}
        >
          {isProcessing ? <CircularProgress size={24} /> : '登録'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
