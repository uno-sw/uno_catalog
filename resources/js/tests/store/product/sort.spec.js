import sortStore from '../../../store/product/sort'

describe('product sort store', () => {
  it('should set valid sort', () => {
    const state = {}

    sortStore.mutations.setSort(state, 'created_at')
    expect(state.sort).toBe('created_at')

    sortStore.mutations.setSort(state, 'updated_at')
    expect(state.sort).toBe('updated_at')

    sortStore.mutations.setSort(state, 'price')
    expect(state.sort).toBe('price')

    sortStore.mutations.setSort(state, 'name')
    expect(state.sort).toBe('name')
  })

  it('should set invalid sort', () => {
    const state = {}

    sortStore.mutations.setSort(state, 'test')
    expect(state.sort).toBeUndefined()
  })

  it('should set valid order', () => {
    const state = {}

    sortStore.mutations.setOrder(state, 'asc')
    expect(state.order).toBe('asc')

    sortStore.mutations.setOrder(state, 'desc')
    expect(state.order).toBe('desc')
  })

  it('should set invalid order', () => {
    const state = {}

    sortStore.mutations.setOrder(state, 'test')
    expect(state.order).toBeUndefined()
  })
})
