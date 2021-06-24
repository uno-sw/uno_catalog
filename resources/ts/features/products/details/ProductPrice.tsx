import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useProductDetails } from './useProductDetails'
import { EditProduct } from './EditProduct'

export const ProductPrice: React.VFC = () => {
  const { productDetails, updateProductDetails } = useProductDetails()

  if (!productDetails) {
    return null
  }

  return (
    <EditProduct<string>
      label="価格"
      defaultValue={productDetails.price?.toString() ?? ''}
      content={
        productDetails.price
          ? <Typography variant="h5" component="p">
              ¥{productDetails.price.toLocaleString()}
            </Typography>
          : <Typography component="p" color="textSecondary">
              価格情報なし
            </Typography>
      }
      renderInput={(value, setValue, error) =>
        <TextField
          autoFocus
          fullWidth
          value={value}
          error={Boolean(error)}
          helperText={error}
          type="number"
          inputProps={{ min: 0 }}
          InputProps={{
            startAdornment:
              <InputAdornment position="start">¥</InputAdornment>
          }}
          onChange={e => setValue(e.target.value)}
        />
      }
      validator={value =>
        (value.trim() !== (productDetails.price?.toString() ?? '')
         && /^(0|[1-9][0-9]*)$/.test(value.trim()))}
      onSave={value =>
        updateProductDetails({ price: parseInt(value.trim(), 10) })}
      formatError={messages => messages.price[0]}
    />
  )
}
