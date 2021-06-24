import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import { useSnackbar } from 'notistack'

import { ProductDetails } from '../productEntity'
import client from '../../../client'
import { OK } from '../../../util'

interface Props {
  open: boolean
  onClose?: () => void
  productDetails: ProductDetails
}

export const RemoveProductDialog: React.VFC<Props> = (props) => {
  const { open, onClose, productDetails } = props
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (open) {
      setIsProcessing(false)
    }
  }, [open])

  const handleClose = () => {
    if (!isProcessing && onClose) {
      onClose()
    }
  }

  const removeProduct = async () => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    const request = client.delete(`/api/products/${productDetails.id}`)
    const [_, response] = await Promise.all([wait, request])

    if (!response) {
      enqueueSnackbar('ネットワークに接続されていません', { action: retryButton })
      setIsProcessing(false)
      return
    }

    if (response.status !== OK) {
      enqueueSnackbar('製品の削除に失敗しました', { action: retryButton })
      setIsProcessing(false)
      return
    }

    if (onClose) {
      onClose()
    }
    history.push('/')
    enqueueSnackbar(`${productDetails.name}を削除しました`)
  }

  const retryButton =
    <Button color="secondary" onClick={removeProduct}>再試行</Button>

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="remove-product-title"
      aria-describedby="remove-product-description"
    >
      <DialogTitle id="remove-product-title">
        {productDetails.name}を削除してもよろしいですか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="remove-product-description">
          削除した製品は元に戻せません。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus disabled={isProcessing} onClick={handleClose}>
          キャンセル
        </Button>
        <Button color="primary" disabled={isProcessing} onClick={removeProduct}>
          {isProcessing
            ? <>
                <CircularProgress size={24} />
                <Typography variant="srOnly">処理中…</Typography>
              </>
            : '削除'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
