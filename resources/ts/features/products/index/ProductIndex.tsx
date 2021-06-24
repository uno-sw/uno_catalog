import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Alert from '@material-ui/lab/Alert'
import AddIcon from '@material-ui/icons/Add'
import { useSnackbar } from 'notistack'

import { ProductSummary } from './ProductSummary'
import { RegisterProductDialog } from './RegisterProductDialog'
import { SortField } from './SortField'
import { TagFilter } from './TagFilter'
import { useProducts } from './useProducts'
import {
  OrderOption,
  orderOptions,
  ProductIndexParams,
  SortOption,
  sortOptions
} from './useProvideProducts'
import client from '../../../client'
import { PROMINENT_HEIGHT } from '../../../components/layout/AppBar'
import { Page } from '../../../components/layout/Page'
import { APIError, NetworkError } from '../../../errors'
import { OK } from '../../../util'
import { Tag } from '../productEntity'

const FAB_SIZE = 56

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(12),
      paddingTop: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(6),
      },
    },
    fab: {
      bottom: theme.spacing(2),
      position: 'fixed',
      right: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        left: theme.spacing(3),
        position: 'absolute',
        top: PROMINENT_HEIGHT - FAB_SIZE / 2,
      },
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(5, 0),
    },
    loadMore: {
      marginTop: theme.spacing(3),
    },
    controls: {
      marginBottom: theme.spacing(3),
    },
  }),
)

export const ProductIndex: React.VFC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [filterTagIds, setFilterTagIds] = useState<number[]>([])
  const [sort, setSort] = useState<{sort: SortOption, order: OrderOption}>({
    sort: 'created_at',
    order: 'desc',
  })
  const [isRegisterProductDialogOpen, setIsRegisterProductDialogOpen] =
    useState<boolean>(false)
  const {
    products,
    canLoadMore,
    fetchProducts,
    fetchMoreProducts,
  } = useProducts()
  const history = useHistory()
  const location = useLocation()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    (async () => {
      const response = await client.get('/api/tags')
      if (!response || response.status !== OK) {
        enqueueSnackbar('タグの取得に失敗しました')
        return
      }
      setAllTags(response.data.data)

      const search = new URLSearchParams(location.search)

      const tags = search.getAll('tag')
        .map(tag => parseInt(tag, 10))
        .filter(tag => response.data.data.some((t: Tag) => t.id === tag))
      setFilterTagIds(tags)

      let sort = sortOptions.find(s => s === search.get('sort')) ?? 'created_at'
      let order = orderOptions.find(o => o === search.get('order')) ?? 'desc'
      setSort({ sort, order })

      const newSearch = new URLSearchParams(location.search)
      newSearch.delete('tag')
      tags.forEach(tag => newSearch.append('tag', tag.toString()))
      if (!sortOptions.find(s => s === search.get('sort'))) {
        newSearch.delete('sort')
      }
      if (!orderOptions.find(o => o === search.get('order'))) {
        newSearch.delete('order')
      }
      history.replace({ search: `?${newSearch}` })

      handleFetchProducts({ tags, sort, order })
    })()
  }, [])

  const handleFetchProducts = async (params?: ProductIndexParams) => {
    setError('')
    setIsLoading(true)
    try {
      await fetchProducts(params)
    } catch (e) {
      if (e instanceof NetworkError) {
        setError('ネットワークに接続されていません')
      } else if (e instanceof APIError) {
        setError('製品の取得に失敗しました')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onProductRegistered = (id: number, name: string) => {
    enqueueSnackbar(
      `${name} を登録しました`,
      {
        action: (
          <Button
            color="secondary"
            size="small"
            onClick={() => history.push(`/products/${id}`)}
          >
            編集
          </Button>
        ),
      }
    )
    handleFetchProducts({
      tags: filterTagIds,
      sort: sort.sort,
      order: sort.order,
    })
  }

  const handleTagFilterChange = (tagIds: number[]) => {
    setFilterTagIds(tagIds)

    handleFetchProducts({ tags: tagIds, sort: sort.sort, order: sort.order })

    const search = new URLSearchParams(location.search)
    search.delete('tag')
    tagIds.forEach(tagId => search.append('tag', tagId.toString()))
    history.replace({ search: `?${search}` })
  }

  const loadMore = async () => {
    setIsLoadingMore(true)
    try {
      await fetchMoreProducts({
        tags: filterTagIds,
        sort: sort.sort,
        order: sort.order
      })
    } catch (e) {
      if (e instanceof NetworkError) {
        enqueueSnackbar(
          'ネットワークに接続されていません',
          { action: retryLoadMoreButton },
        )
      } else if (e instanceof APIError) {
        enqueueSnackbar('製品の取得に失敗しました', { action: retryLoadMoreButton })
      }
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSortChange = (
    value: { sort: SortOption, order: OrderOption }
  ) => {
    setSort(value)

    handleFetchProducts({
      tags: filterTagIds,
      sort: value.sort,
      order: value.order,
    })

    const search = new URLSearchParams(location.search)
    search.set('sort', value.sort)
    search.set('order', value.order)
    history.replace({ search: `?${search}` })
  }

  const retryLoadMoreButton = (
    <Button size="small" color="secondary" onClick={loadMore}>再試行</Button>
  )

  const renderPage = (content: React.ReactNode): JSX.Element => {
    return (
      <Page title="製品一覧" appBarVariant={matches ? 'attachFab' : 'normal'}>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2} className={classes.controls}>
            <Grid item xs={12} sm={8}>
              <TagFilter
                allTags={allTags}
                value={filterTagIds}
                onChange={handleTagFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SortField value={sort} onChange={handleSortChange} />
            </Grid>
          </Grid>
          {content}
        </Container>
        <Tooltip title="製品を登録">
          <Fab
            color="secondary"
            className={classes.fab}
            aria-label="製品を登録"
            onClick={() => setIsRegisterProductDialogOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <RegisterProductDialog
          open={isRegisterProductDialogOpen}
          onClose={() => setIsRegisterProductDialogOpen(false)}
          onProductRegistered={onProductRegistered}
        />
      </Page>
    )
  }

  if (isLoading) {
    return renderPage(
      <div className={classes.center}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return renderPage(
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => handleFetchProducts()}
          >
            再試行
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }

  if (products.length === 0) {
    return renderPage(
      <Alert severity="info">表示できる製品はありません</Alert>
    )
  }

  return renderPage(
    <>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <ProductSummary product={product} />
          </Grid>
        ))}
      </Grid>
      {canLoadMore && (
        <Button
          fullWidth
          variant="contained"
          disabled={isLoadingMore}
          className={classes.loadMore}
          onClick={loadMore}
        >
          {isLoadingMore
            ? <CircularProgress size={24} />
            : 'もっと読み込む'}
        </Button>
      )}
    </>
  )
}
