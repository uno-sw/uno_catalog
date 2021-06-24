import React from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useProductDetails } from './useProductDetails'
import { EditProduct } from './EditProduct'

export const ProductName: React.VFC = () => {
  const { productDetails, updateProductDetails } = useProductDetails()

  if (!productDetails) {
    return null
  }

  return (
    <EditProduct<string>
      label="製品名"
      defaultValue={productDetails.name}
      content={
        <Typography variant="h5" component="p">
          {productDetails.name}
        </Typography>
      }
      renderInput={(value, setValue, error) =>
        <TextField
          autoFocus
          fullWidth
          value={value}
          error={Boolean(error)}
          helperText={error}
          inputProps={{ maxLength: 100 }}
          onChange={e => setValue(e.target.value)}
        />
      }
      validator={value =>
        (value.trim() !== ''
         && value.trim() !== (productDetails.name ?? ''))}
      onSave={value => updateProductDetails({ name: value.trim() })}
      formatError={messages => messages.name[0]}
    />
  )
}
