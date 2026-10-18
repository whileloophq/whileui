import { RefreshControl } from 'react-native';
import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { PullToRefreshScrollView } from './pull-to-refresh-scroll-view';

describe('PullToRefreshScrollView', () => {
  it('owns the native refresh control and supports short iOS content', async () => {
    const onRefresh = jest.fn();

    await render(
      <PullToRefreshScrollView refreshing={false} onRefresh={onRefresh} testID="refresh-scroll">
        <Text>Activity</Text>
      </PullToRefreshScrollView>
    );

    const scrollView = screen.getByTestId('refresh-scroll');
    expect(scrollView.props.alwaysBounceVertical).toBe(true);
    expect(scrollView.props.refreshControl.type).toBe(RefreshControl);

    scrollView.props.refreshControl.props.onRefresh();
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('offers refresh as an accessibility action, for users who cannot pull', async () => {
    const onRefresh = jest.fn();
    const onAccessibilityAction = jest.fn();

    const result = await render(
      <PullToRefreshScrollView
        refreshing={false}
        onRefresh={onRefresh}
        accessibilityActions={[{ name: 'magicTap' }]}
        onAccessibilityAction={onAccessibilityAction}
        testID="refresh-scroll"
      >
        <Text>Activity</Text>
      </PullToRefreshScrollView>
    );

    const scrollView = screen.getByTestId('refresh-scroll');
    expect(scrollView.props.accessibilityActions).toEqual([
      { name: 'magicTap' },
      { name: 'refresh', label: 'Refresh' },
    ]);

    scrollView.props.onAccessibilityAction({ nativeEvent: { actionName: 'refresh' } });
    expect(onRefresh).toHaveBeenCalledTimes(1);

    scrollView.props.onAccessibilityAction({ nativeEvent: { actionName: 'magicTap' } });
    expect(onAccessibilityAction).toHaveBeenCalledTimes(1);

    await result.rerender(
      <PullToRefreshScrollView refreshing onRefresh={onRefresh} testID="refresh-scroll">
        <Text>Activity</Text>
      </PullToRefreshScrollView>
    );
    screen
      .getByTestId('refresh-scroll')
      .props.onAccessibilityAction({ nativeEvent: { actionName: 'refresh' } });
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
