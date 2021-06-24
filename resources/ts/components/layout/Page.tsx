import React, { useState } from 'react'

import { AppBar } from './AppBar'
import { Drawer } from './Drawer'

interface Props {
  title: string
  actions?: React.ReactNode
  appBarVariant?: 'normal' | 'prominent' | 'attachFab'
  children?: React.ReactNode
}

export const Page: React.VFC<Props> = (props) => {
  const { title, actions, appBarVariant, children } = props
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  return (
    <>
      <AppBar
        title={title}
        variant={appBarVariant ?? 'normal'}
        actions={actions}
        onMenuButtonPressed={() => setIsDrawerOpen(true)}
      />
      <nav>
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </nav>
      <main>
        {children}
      </main>
    </>
  )
}
