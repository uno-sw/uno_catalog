import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Alert from '@material-ui/lab/Alert'
import DeleteIcon from '@material-ui/icons/Delete'
import LabelIcon from '@material-ui/icons/Label'

import { DeleteTagDialog } from './DeleteTagDialog'
import { Tag } from '../products/productEntity'
import { Page } from '../../components/layout/Page'
import client from '../../client'
import { OK } from '../../util'

const useStyles = makeStyles(theme =>
  createStyles({
    center: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(5, 0),
    },
    alert: {
      margin: theme.spacing(2),
    },
  }),
)

export const EditTags: React.VFC = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [deleting, setDeleting] = useState<Tag | null>(null)
  const classes = useStyles()

  useEffect(() => {
    (async () => {
      setIsLoading(true)

      const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
      const request = client.get('/api/tags')
      const [, response] = await Promise.all([wait, request])

      setIsLoading(false)

      if (!response) {
        setError('ネットワークに接続されていません。')
      } else if (response.status !== OK) {
        setError('サーバーエラーが発生しました。時間をおいてもう一度アクセスしてください。')
      } else {
        setTags(response.data.data)
      }
    })()
  },[])

  const deleteTag = (id: number) => {
    setTags(value => value.filter(tag => tag.id !== id))
  }

  const render = (content: React.ReactNode): JSX.Element => {
    return (
      <Page title="タグを編集">
        {content}
      </Page>
    )
  }

  if (isLoading) {
    return render(
      <div className={classes.center}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return render(
      <Alert severity="error" className={classes.alert}>{error}</Alert>
    )
  }

  if (tags.length === 0) {
    return render(
      <Alert severity="info" className={classes.alert}>
        タグはありません。
      </Alert>
    )
  }

  return render(
    <>
      <List>
        {tags.map(tag => (
          <ListItem>
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText>{tag.label}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="タグを削除"
                onClick={() => setDeleting(tag)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {deleting && (
        <DeleteTagDialog
          open={deleting !== null}
          onClose={() => setDeleting(null)}
          onDelete={deleteTag}
          tag={deleting}
        />
      )}
    </>
  )
}
