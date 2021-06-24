import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Alert from '@material-ui/lab/Alert'
import DeleteIcon from '@material-ui/icons/Delete'

import { ProductLinks } from './ProductLinks'
import { ProductName } from './ProductName'
import { ProductNote } from './ProductNote'
import { ProductPrice } from './ProductPrice'
import { ProductTags } from './ProductTags'
import { RemoveProductDialog } from './RemoveProductDialog'
import { useProductDetails } from './useProductDetails'
import { Page } from '../../../components/layout/Page'
import { APIError, NetworkError } from '../../../errors'
import { NOT_FOUND } from '../../../util'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    note: {
      whiteSpace: 'pre-wrap',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(5, 0),
    },
    error: {
      margin: theme.spacing(2),
    },
  }),
)

export const ProductDetails: React.VFC = () => {
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false)
  const { productDetails, fetchProductDetails } = useProductDetails()
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        await fetchProductDetails()
      } catch (e) {
        if (e instanceof NetworkError) {
          setError('ネットワークに接続されていません。')
        } else if (e instanceof APIError) {
          if (e.code === NOT_FOUND) {
            setError('お探しのページは見つかりませんでした。')
          } else {
            setError(
              'サーバーエラーが発生しました。時間をおいてもう一度アクセスしてください。'
            )
          }
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const render = (content?: React.ReactNode, hideActions: boolean = false) => (
    <Page
      title="製品詳細"
      actions={hideActions
        ? undefined
        : <Tooltip title="製品を削除">
            <IconButton
              color="inherit"
              aria-label="製品を削除"
              onClick={() => setIsRemoveDialogOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
      }
    >
      {content}
    </Page>
  )

  if (isLoading) {
    return render(
      <div className={classes.center}>
        <CircularProgress />
      </div>,
      true,
    )
  }

  if (error) {
    return render(
      <Alert severity="error" className={classes.error}>{error}</Alert>
    )
  }

  if (!productDetails) {
    return render()
  }

  return render(
    <>
      <Container maxWidth="sm" className={classes.container}>
        <ProductName />
        <ProductPrice />
        <ProductTags />
        <ProductNote />
        <ProductLinks />
      </Container>
      <RemoveProductDialog
        open={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        productDetails={productDetails}
      />
    </>
  )
}
