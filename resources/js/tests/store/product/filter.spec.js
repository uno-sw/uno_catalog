import filterStore from '../../../store/product/filter'

describe('product filter store', () => {
  it('should set tags except invalid tags', () => {
    const commit = jest.fn()
    const rootGetters = {
      'product/tag/tags': [
        {
          id: 1,
          label: 'Apple',
        },
        {
          id: 2,
          label: 'Banana',
        },
        {
          id: 3,
          label: 'Orange',
        },
      ],
    }

    filterStore.actions.setTags(
      { commit, rootGetters },
      ['1', '2', '5', 'test'],
    )

    expect(commit).toHaveBeenCalledWith('setTags', ['1', '2'])
  })
})
