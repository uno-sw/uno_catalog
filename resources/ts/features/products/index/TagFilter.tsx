import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { Tag } from '../productEntity'

interface Props {
  allTags: Tag[]
  value?: number[]
  onChange?: (tagIds: number[]) => void
}

export const TagFilter: React.VFC<Props> = ({ allTags, value, onChange }) => {
  const tagValues = value
    ? value.reduce<Tag[]>((prev, current) => {
        const found = allTags.find(tag => tag.id === current)
        return found ? [...prev, found] : prev
      }, [])
    : undefined

  return (
    <Autocomplete
      multiple
      options={allTags}
      getOptionLabel={option => option.label}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="タグ絞り込み"
        />
      )}
      value={tagValues}
      onChange={(_, value) => {
        if (onChange) {
          onChange(value.map(tag => tag.id))
        }
      }}
      noOptionsText="該当するタグはありません"
    />
  )
}
