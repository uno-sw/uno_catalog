import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { ProductSummary as ProductSummaryType } from '../productEntity'

interface Props {
  product: ProductSummaryType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagList: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: theme.spacing(1, -0.5, 0),
    },
    tag: {
      margin: theme.spacing(0.5),
    },
  }),
)

export const ProductSummary: React.VFC<Props> = ({ product }) => {
  const classes = useStyles()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" component="p">
          {product.price
            ? `¥${product.price.toLocaleString()}`
            : '価格情報なし'}
        </Typography>
        {product.tags.length > 0 &&
          <div className={classes.tagList}>
            {product.tags.map(tag =>
              <Chip
                key={tag.id}
                label={tag.label}
                variant="outlined"
                size="small"
                className={classes.tag}
              />)}
          </div>}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          size="small"
          component={RouterLink}
          to={`/products/${product.id}`}
        >
          詳細を表示
        </Button>
      </CardActions>
    </Card>
  )
}
