import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import Login from '../../pages/Login.vue'

describe('Login.vue', () => {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)

  it('should dispatch login action', () => {
    const data = {
      email: 'test@example.com',
      password: 'test1234',
      remember: true,
    }
    const dispatch = jest.fn()
    const Parent = {
      provide: {
        toasterService: {
          toastSuccess: jest.fn(),
        }
      },
    }
    const wrapper = mount(Login, {
      localVue,
      computed: {
        apiStatus: () => true,
        errors: () => null,
        forwardingRoute: () => null,
      },
      mocks: {
        $store: {
          dispatch,
          commit: jest.fn(),
        },
        $router: {
          push: jest.fn(),
        },
      },
      parentComponent: Parent,
    })

    wrapper.vm.form = data
    wrapper.find('form').trigger('submit.prevent')

    expect(dispatch).toHaveBeenCalledWith('auth/login', data)
  })
})
