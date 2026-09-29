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
});
