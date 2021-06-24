import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { EditProduct } from './EditProduct'
import { useProductDetails } from './useProductDetails'
import { Tag } from '../productEntity'
import client from '../../../client'
import { OK } from '../../../util'

const useStyles = makeStyles(theme =>
  createStyles({
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *':  {
        margin: theme.spacing(0.5),
      }
    },
  }),
)

export const ProductTags: React.VFC = () => {
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const { productDetails, updateProductDetails } = useProductDetails()
  const classes = useStyles()

  useEffect(() => {
    let mounted = true
    const f = async () => {
      const response = await client.get('/api/tags')
      if (response.status === OK) {
        setTagOptions((response.data.data as Tag[]).map(tag => tag.label))
      }
    }

    if (mounted) {
      f()
    }

    return () => { mounted = false }
  }, [])

  if (!productDetails) {
    return null
  }

  const currentTags = productDetails.tags.map(tag => tag.label)

  return (
    <EditProduct<string[]>
      label="タグ"
      defaultValue={currentTags}
      content={
        productDetails.tags.length > 0
          ? <div className={classes.tagsContainer}>
              {productDetails.tags.map(tag =>
                <Chip key={tag.id} label={tag.label} />
              )}
            </div>
          : <Typography color="textSecondary" component="p">
              タグはありません
            </Typography>
      }
      renderInput={(value, setValue, error) =>
        <Autocomplete
          fullWidth
          multiple
          freeSolo
          options={tagOptions}
          value={value}
          onChange={(_, value) => setValue(value)}
          renderInput={params => (
            <TextField
              {...params}
              autoFocus
              error={Boolean(error)}
              helperText={error}
            />
          )}
        />
      }
      validator={value =>
        (value.length !== currentTags.length
        || value.some(tag => !currentTags.includes(tag)))
      }
      onSave={value => updateProductDetails({ tags: value })}
      formatError={messages => {
        const tagsKey =
          Object.keys(messages).find(key => /^tags(\.\d+)?$/.test(key))
        return tagsKey && messages[tagsKey] && messages[tagsKey].length > 0
          ? messages[tagsKey][0]
          : ''
      }}
    />
  )
}
