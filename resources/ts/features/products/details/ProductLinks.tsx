import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'

import { AddProductLinkDialog } from './AddProductLinkDialog'
import {
  ProductDetailsCard,
  ProductDetailsCardContent
} from './ProductDetailsCard'
import { ProductLink } from './ProductLink'
import { RemoveProductLinkDialog } from './RemoveProductLinkDialog'
import { useProductDetails } from './useProductDetails'
import { Link } from '../productEntity'

export const ProductLinks: React.VFC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false)
  const [removingLink, setRemovingLink] = useState<Link | null>(null)
  const { productDetails } = useProductDetails()

  const handleRemoveLink = (link: Link) => {
    setRemovingLink(link)
    setIsRemoveDialogOpen(true)
  }

  if (!productDetails) {
    return null
  }

  return (
    <>
      <ProductDetailsCard
        label="リンク"
        action={
          productDetails.links.length < 10
            ? <Tooltip title="リンクを追加">
                <IconButton
                  edge="end"
                  aria-label="リンクを追加"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            : undefined
        }
      >
        {productDetails.links.length > 0
          ? <List disablePadding component="div">
              {productDetails.links.map(link =>
                <ProductLink
                  key={link.id}
                  link={link}
                  onRemove={handleRemoveLink}
                />
              )}
            </List>
          : <ProductDetailsCardContent>
              <Typography color="textSecondary" component="p">
                リンクはありません
              </Typography>
            </ProductDetailsCardContent>}
      </ProductDetailsCard>
      <AddProductLinkDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
      <RemoveProductLinkDialog
        open={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        link={removingLink}
      />
    </>
  )
}
