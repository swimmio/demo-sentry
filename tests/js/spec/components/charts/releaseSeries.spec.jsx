import {mountWithTheme} from 'sentry-test/enzyme';
import {initializeOrg} from 'sentry-test/initializeOrg';

import ReleaseSeries from 'sentry/components/charts/releaseSeries';

describe('ReleaseSeries', function () {
  const renderFunc = jest.fn(() => null);
  const {routerContext, organization} = initializeOrg();
  let releases;
  let releasesMock;

  beforeEach(function () {
    releases = [
      {
        version: 'sentry-android-shop@1.2.0',
        date: '2020-03-23T00:00:00Z',
      },
    ];
    MockApiClient.clearMockResponses();
    releasesMock = MockApiClient.addMockResponse({
      url: `/organizations/${organization.slug}/releases/stats/`,
      body: releases,
    });
  });

  it('does not fetch releases if releases is truthy', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries organization={organization} releases={[]}>
        {renderFunc}
      </ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).not.toHaveBeenCalled();
  });

  it('fetches releases if no releases passed through props', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries>{renderFunc}</ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalled();

    expect(renderFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        releases,
      })
    );
  });

  it('fetches releases with project conditions', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries projects={[1, 2]}>{renderFunc}</ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        query: {project: [1, 2]},
      })
    );
  });

  it('fetches releases with environment conditions', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries environments={['dev', 'test']}>{renderFunc}</ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        query: {environment: ['dev', 'test']},
      })
    );
  });

  it('fetches releases with start and end date strings', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries start="2020-01-01" end="2020-01-31">
        {renderFunc}
      </ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        query: {start: '2020-01-01T00:00:00', end: '2020-01-31T00:00:00'},
      })
    );
  });

  it('fetches releases with start and end dates', async function () {
    const start = new Date(Date.UTC(2020, 0, 1, 12, 13, 14));
    const end = new Date(Date.UTC(2020, 0, 31, 14, 15, 16));
    const wrapper = mountWithTheme(
      <ReleaseSeries start={start} end={end}>
        {renderFunc}
      </ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        query: {start: '2020-01-01T12:13:14', end: '2020-01-31T14:15:16'},
      })
    );
  });

  it('fetches releases with period', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries period="14d">{renderFunc}</ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        query: {statsPeriod: '14d'},
      })
    );
  });

  it('fetches on property updates', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries period="14d">{renderFunc}</ReleaseSeries>,
      routerContext
    );
    await tick();
    wrapper.update();

    const cases = [
      {period: '7d'},
      {start: '2020-01-01', end: '2020-01-02'},
      {projects: [1]},
    ];
    for (const scenario of cases) {
      releasesMock.mockReset();

      wrapper.setProps(scenario);
      wrapper.update();
      await tick();

      expect(releasesMock).toHaveBeenCalled();
    }
  });

  it('doesnt not refetch releases with memoize enabled', async function () {
    const originalPeriod = '14d';
    const updatedPeriod = '7d';
    const wrapper = mountWithTheme(
      <ReleaseSeries period={originalPeriod} memoized>
        {renderFunc}
      </ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(releasesMock).toHaveBeenCalledTimes(1);

    wrapper.setProps({period: updatedPeriod});
    wrapper.update();
    await tick();

    expect(releasesMock).toHaveBeenCalledTimes(2);

    wrapper.setProps({period: originalPeriod});
    wrapper.update();
    await tick();

    expect(releasesMock).toHaveBeenCalledTimes(2);
  });

  it('generates an eCharts `markLine` series from releases', async function () {
    const wrapper = mountWithTheme(
      <ReleaseSeries>{renderFunc}</ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(renderFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        releaseSeries: [
          expect.objectContaining({
            // we don't care about the other properties for now
            markLine: expect.objectContaining({
              data: [
                expect.objectContaining({
                  name: '1.2.0, sentry-android-shop',
                  value: '1.2.0, sentry-android-shop',
                  xAxis: 1584921600000,
                }),
              ],
            }),
          }),
        ],
      })
    );
  });

  it('allows updating the emphasized release', async function () {
    releases.push({
      version: 'sentry-android-shop@1.2.1',
      date: '2020-03-24T00:00:00Z',
    });
    const wrapper = mountWithTheme(
      <ReleaseSeries emphasizeReleases={['sentry-android-shop@1.2.0']}>
        {renderFunc}
      </ReleaseSeries>,
      routerContext
    );

    await tick();
    wrapper.update();

    expect(renderFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        releaseSeries: [
          expect.objectContaining({
            // we don't care about the other properties for now
            markLine: expect.objectContaining({
              // the unemphasized releases have opacity 0.3
              lineStyle: expect.objectContaining({opacity: 0.3}),
              data: [
                expect.objectContaining({
                  name: '1.2.1, sentry-android-shop',
                  value: '1.2.1, sentry-android-shop',
                  xAxis: 1585008000000,
                }),
              ],
            }),
          }),
          expect.objectContaining({
            // we don't care about the other properties for now
            markLine: expect.objectContaining({
              // the emphasized releases have opacity 0.8
              lineStyle: expect.objectContaining({opacity: 0.8}),
              data: [
                expect.objectContaining({
                  name: '1.2.0, sentry-android-shop',
                  value: '1.2.0, sentry-android-shop',
                  xAxis: 1584921600000,
                }),
              ],
            }),
          }),
        ],
      })
    );

    wrapper.setProps({
      emphasizedReleases: ['sentry-android-shop@1.2.1'],
    });
    await tick();
    wrapper.update();

    expect(renderFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        releaseSeries: [
          expect.objectContaining({
            // we don't care about the other properties for now
            markLine: expect.objectContaining({
              // the unemphasized releases have opacity 0.3
              lineStyle: expect.objectContaining({opacity: 0.3}),
              data: [
                expect.objectContaining({
                  name: '1.2.1, sentry-android-shop',
                  value: '1.2.1, sentry-android-shop',
                  xAxis: 1585008000000,
                }),
              ],
            }),
          }),
          expect.objectContaining({
            // we don't care about the other properties for now
            markLine: expect.objectContaining({
              // the emphasized releases have opacity 0.8
              lineStyle: expect.objectContaining({opacity: 0.8}),
              data: [
                expect.objectContaining({
                  name: '1.2.0, sentry-android-shop',
                  value: '1.2.0, sentry-android-shop',
                  xAxis: 1584921600000,
                }),
              ],
            }),
          }),
        ],
      })
    );
  });
});
