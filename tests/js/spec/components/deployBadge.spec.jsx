import {mountWithTheme} from 'sentry-test/enzyme';

import DeployBadge from 'sentry/components/deployBadge';

const deploy = {
  name: '85fedddce5a61a58b160fa6b3d6a1a8451e94eb9 to prod',
  url: null,
  environment: 'production',
  dateStarted: null,
  dateFinished: '2020-05-11T18:12:00.025928Z',
  id: '6348842',
};

describe('DeployBadge', function () {
  it('renders', function () {
    const wrapper = mountWithTheme(<DeployBadge deploy={deploy} />);

    expect(wrapper.find('Tag').text()).toEqual('production');
    expect(wrapper.find('IconOpen').length).toEqual(0);
  });

  it('renders with icon and link', function () {
    const projectId = 1;

    const wrapper = mountWithTheme(
      <DeployBadge
        deploy={deploy}
        orgSlug="sentry"
        version="1.2.3"
        projectId={projectId}
      />
    );

    expect(wrapper.find('Link').props('to').to).toEqual({
      pathname: '/organizations/sentry/issues/',
      query: {project: projectId, environment: 'production', query: 'release:1.2.3'},
    });
    expect(wrapper.find('Tag').text()).toEqual('production');
    expect(wrapper.find('IconOpen').length).toEqual(1);
  });
});
