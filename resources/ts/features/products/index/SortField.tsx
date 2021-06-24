import React, { useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { OrderOption, SortOption } from './useProvideProducts'

interface Props {
  value: { sort: SortOption, order: OrderOption }
  onChange: (value: { sort: SortOption, order: OrderOption }) => void
}

export const SortField: React.VFC<Props> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const optionParams = (event.target.value as string).split('|')
    onChange({
      sort: optionParams[0] as SortOption,
      order: optionParams[1] as OrderOption
    })
  }

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="sort-label">並び替え</InputLabel>
      <Select
        labelId="sort-label"
        label="並び替え"
        value={`${value.sort}|${value.order}`}
        onChange={handleChange}
      >
        <MenuItem value="created_at|desc">登録日が新しい順</MenuItem>
        <MenuItem value="created_at|asc">登録日が古い順</MenuItem>
        <MenuItem value="updated_at|desc">更新日が新しい順</MenuItem>
        <MenuItem value="updated_at|asc">更新日が古い順</MenuItem>
        <MenuItem value="name|asc">製品名昇順</MenuItem>
        <MenuItem value="name|desc">製品名降順</MenuItem>
        <MenuItem value="price|asc">価格が安い順</MenuItem>
        <MenuItem value="price|desc">価格が高い順</MenuItem>
      </Select>
    </FormControl>
  )
}
