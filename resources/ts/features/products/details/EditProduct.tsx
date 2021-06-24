import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Edit'
import { useSnackbar } from 'notistack'

import {
  ProductDetailsCard,
  ProductDetailsCardContent,
} from './ProductDetailsCard'
import { APIError, NetworkError, ValidationError } from '../../../errors'
import { EditProductActions } from './EditProductActions'

interface Props<T> {
  label: string
  defaultValue: T
  content: React.ReactNode
  renderInput: (
    value: T,
    setValue: React.Dispatch<React.SetStateAction<T>>,
    error: string,
  ) => React.ReactNode
  validator: (value: T) => boolean
  onSave: (value: T) => Promise<void>
  formatError: (messages: any) => string
  disableContentPadding?: boolean
}

export const EditProduct = <T extends {}>(props: Props<T>): JSX.Element => {
  const {
    label,
    defaultValue,
    content,
    renderInput,
    validator,
    onSave,
    formatError,
    disableContentPadding,
  } = props
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [value, setValue] = useState<T>(defaultValue)
  const [error, setError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (isEditing) {
      setIsProcessing(false)
      setValue(defaultValue)
      setError('')
    }
  }, [isEditing])

  const canSave = isEditing && !isProcessing && validator(value)

  const onSaveButtonPressed = async () => {
    if (!canSave) {
      return
    }

    setIsProcessing(true)
    try {
      await onSave(value)
      setIsEditing(false)
    } catch (e) {
      setIsProcessing(false)

      if (e instanceof NetworkError) {
        enqueueSnackbar('ネットワークに接続されていません', { action: retryButton })
      } else if (e instanceof ValidationError) {
        setError(formatError(e.messages))
      } else if (e instanceof APIError) {
        enqueueSnackbar('サーバーエラーが発生しました', { action: retryButton })
      }
    }
  }

  const retryButton =
    <Button color="secondary" onClick={onSaveButtonPressed}>
      再試行
    </Button>

  return (
    <ProductDetailsCard
      label={label}
      action={
        isEditing
          ? null
          : <Tooltip title={`${label}を編集`}>
              <IconButton
                edge="end"
                aria-label={`${label}を編集`}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
      }
    >
      {isEditing
        ? <ProductDetailsCardContent>
            {renderInput(value, setValue, error)}
            <EditProductActions
              disableCancel={isProcessing}
              disableSave={!canSave}
              saving={isProcessing}
              onCancel={() => setIsEditing(false)}
              onSave={onSaveButtonPressed}
            />
          </ProductDetailsCardContent>
        : disableContentPadding
            ? content
            : <ProductDetailsCardContent>{content}</ProductDetailsCardContent>}
    </ProductDetailsCard>
  )
}
