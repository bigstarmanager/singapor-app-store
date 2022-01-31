import { mount } from '@vue/test-utils';
import Home from '@/views/Home/index.vue';

describe('index.vue', () => {
  it('renders home vue', () => {
    const wrapper = mount(Home);
    expect(wrapper.text()).toMatch('Ready to create an app?');
  });
});
