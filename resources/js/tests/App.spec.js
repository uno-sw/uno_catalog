import { shallowMount } from '@vue/test-utils'
import App from '../App.vue'
import ErrorHandler from '../components/ErrorHandler.vue'
import Navbar from '../components/Navbar.vue'

describe('App.vue', () => {
  it('should render component correctly', () => {
    const wrapper = shallowMount(App, {
      stubs: ['BContainer', 'RouterView'],
    })

    expect(wrapper.findComponent(ErrorHandler).exists()).toBe(true)
    expect(wrapper.findComponent(Navbar).exists()).toBe(true)
    expect(wrapper.find('routerview-stub').exists()).toBe(true)
  })
})
