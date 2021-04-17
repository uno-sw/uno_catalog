import { shallowMount } from '@vue/test-utils'
import ErrorHandler from '../../components/ErrorHandler.vue'

describe('ErrorHandler.vue', () => {
  it('should handle unauthorized error', () => {
    const commit = jest.fn()
    const routerPush = jest.fn()

    shallowMount(ErrorHandler, {
      computed: {
        errorCode: () => 419,
        errorMessage: () => '',
      },
      mocks: {
        $store: {
          commit,
        },
        $router: {
          push: routerPush,
        },
      },
    })

    expect(commit).toHaveBeenCalledWith('auth/setUser', null)
    expect(routerPush).toHaveBeenCalledWith('/login')
  })

  it('should handle not found error', () => {
    const routerPush = jest.fn()

    shallowMount(ErrorHandler, {
      computed: {
        errorCode: () => 404,
        errorMessage: () => '',
      },
      mocks: {
        $router: {
          push: routerPush,
        },
      },
    })

    expect(routerPush).toHaveBeenCalledWith('/not-found')
  })

  // Can't mock $root
  // Tried this: https://github.com/vuejs/vue-test-utils/issues/481#issuecomment-423716430
  // but it didn't solve the issue.

  // it('should handle other errors', () => {
  //   const toast = jest.fn()

  //   const Parent = {
  //     data() {
  //       return {
  //         $bvToast: {
  //           toast: jest.fn(),
  //         },
  //       }
  //     },
  //   }
  //   shallowMount(ErrorHandler, {
  //     computed: {
  //       errorCode: () => 500,
  //       errorMessage: () => 'Internal Server Error',
  //     },
  //     parentComponent: Parent,
  //   })

  //   expect(toast).toHaveBeenCalledWith('Internal Server Error', true)
  // })
})
