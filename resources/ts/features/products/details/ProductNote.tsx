import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useProductDetails } from './useProductDetails'
import { EditProduct } from './EditProduct'

const useStyles = makeStyles(() =>
  createStyles({
    note: {
      whiteSpace: 'pre-wrap',
    },
  }),
)

export const ProductNote: React.VFC = () => {
  const { productDetails, updateProductDetails } = useProductDetails()
  const classes = useStyles()

  if (!productDetails) {
    return null
  }

  return (
    <EditProduct<string>
      label="メモ"
      defaultValue={productDetails.note ?? ''}
      content={
        productDetails.note
          ? <Typography component="pre" className={classes.note}>
              {productDetails.note}
            </Typography>
          : <Typography color="textSecondary" component="p">
              メモはありません
            </Typography>
      }
      renderInput={(value, setValue, error) =>
        <TextField
          autoFocus
          fullWidth
          multiline
          value={value}
          error={Boolean(error)}
          helperText={error}
          onChange={e => setValue(e.target.value)}
        />
      }
      validator={value => value.trim() !== (productDetails.note ?? '')}
      onSave={value => updateProductDetails({ note: value.trim() })}
      formatError={messages => messages.note[0]}
    />
  )
}
