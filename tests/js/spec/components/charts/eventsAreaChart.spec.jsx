import {mockZoomRange} from 'sentry-test/charts';
import {mountWithTheme} from 'sentry-test/enzyme';
import {initializeOrg} from 'sentry-test/initializeOrg';

import EventsChart from 'sentry/components/charts/eventsChart';

describe('EventsChart with legend', function () {
  const {router, routerContext, org} = initializeOrg();
  let wrapper;

  beforeEach(function () {
    mockZoomRange(1543449600000, 1543708800000);
    MockApiClient.addMockResponse({
      url: `/organizations/${org.slug}/releases/`,
      body: [],
    });
    MockApiClient.addMockResponse({
      url: `/organizations/${org.slug}/events-stats/`,
      method: 'GET',
      body: {
        data: [
          [1543449600, [20, 12]],
          [1543449601, [10, 5]],
        ],
      },
    });

    wrapper = mountWithTheme(
      <EventsChart
        api={new MockApiClient()}
        location={{query: {}}}
        organization={org}
        project={[]}
        environment={[]}
        period="14d"
        start={null}
        end={null}
        utc={false}
        router={router}
        showLegend
      />,
      routerContext
    );
  });

  it('renders a legend if enabled', function () {
    wrapper.update();

    const areaChart = wrapper.find('AreaChart');
    expect(areaChart.props().legend).toHaveProperty('data');
  });
});
