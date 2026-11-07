import { createRef } from 'react';
import type { ScrollViewInstance } from 'react-native';
import { Text } from '../../components/text';
import { render, screen } from '../../test/render';
import { ChatConversation } from './chat-conversation';

function scrollEvent(offsetY: number) {
  return {
    nativeEvent: {
      contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
      contentOffset: { x: 0, y: offsetY },
      contentSize: { height: 1000, width: 390 },
      layoutMeasurement: { height: 400, width: 390 },
      velocity: undefined,
      zoomScale: 1,
      responderIgnoreScroll: false,
      targetContentOffset: undefined,
    },
  };
}

describe('ChatConversation', () => {
  it('follows new output until the reader scrolls away from the bottom', async () => {
    const ref = createRef<ScrollViewInstance>();

    await render(
      <ChatConversation ref={ref} testID="conversation">
        <Text>Answer</Text>
      </ChatConversation>
    );

    const scrollToEnd = jest.spyOn(ref.current!, 'scrollToEnd');
    const conversation = screen.getByTestId('conversation');

    conversation.props.onContentSizeChange(390, 600);
    expect(scrollToEnd).toHaveBeenCalledTimes(1);

    conversation.props.onScroll(scrollEvent(100));
    conversation.props.onContentSizeChange(390, 700);
    expect(scrollToEnd).toHaveBeenCalledTimes(1);

    conversation.props.onScroll(scrollEvent(580));
    conversation.props.onContentSizeChange(390, 800);
    expect(scrollToEnd).toHaveBeenCalledTimes(2);
  });

  it('preserves caller scroll and content-size callbacks', async () => {
    const onScroll = jest.fn();
    const onContentSizeChange = jest.fn();

    await render(
      <ChatConversation
        testID="conversation"
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
      >
        <Text>Answer</Text>
      </ChatConversation>
    );

    const conversation = screen.getByTestId('conversation');
    const event = scrollEvent(600);
    conversation.props.onScroll(event);
    conversation.props.onContentSizeChange(390, 800);

    expect(onScroll).toHaveBeenCalledWith(event);
    expect(onContentSizeChange).toHaveBeenCalledWith(390, 800);
  });
});
