import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteIcon from '@material-ui/icons/Delete'
import LaunchIcon from '@material-ui/icons/Launch'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { Link } from '../productEntity'
import { extractDomain } from '../../../util'

interface Props {
  link: Link
  onRemove: (link: Link) => void
}

export const ProductLink: React.VFC<Props> = ({ link, onRemove }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <>
      <ListItem>
        <ListItemText
          primary={link.title}
          secondary={extractDomain(link.url)}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="操作"
            aria-controls={`link-menu-${link.id}`}
            aria-haspopup="true"
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Menu
        id={`link-menu-${link.id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem component="a" href={link.url}>
          <ListItemIcon>
            <LaunchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>開く</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onRemove(link)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
