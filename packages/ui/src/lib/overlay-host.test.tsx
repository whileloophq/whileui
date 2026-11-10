import { useEffect } from 'react';
import { Text } from 'react-native';
import { Portal } from '@rn-primitives/portal';
import { render, within, type RenderResult } from '../test/render';
import { OverlayHost, useNestedOverlay, useOverlayPortalTarget } from './overlay-host';

function PortaledText({ children }: { children: string }) {
  const { hostName } = useOverlayPortalTarget();
  return (
    <Portal name={children} hostName={hostName}>
      <Text>{children}</Text>
    </Portal>
  );
}

function Nested({ open, onClose }: { open: boolean; onClose: () => void }) {
  useNestedOverlay(open, onClose);
  return null;
}

function Target({
  portalHost,
  onTarget,
}: {
  portalHost?: string;
  onTarget: (hostName: string | undefined) => void;
}) {
  const { hostName } = useOverlayPortalTarget(portalHost);
  useEffect(() => {
    onTarget(hostName);
  }, [hostName, onTarget]);
  return null;
}

function requestClose(result: RenderResult) {
  const [modal] = result.root!.queryAll((instance) => instance.type === 'Modal');
  modal!.props.onRequestClose();
}

describe('OverlayHost', () => {
  it('closes the topmost nested overlay before itself', async () => {
    const onRequestClose = jest.fn();
    const closeFirst = jest.fn();
    const closeSecond = jest.fn();
    const result = await render(
      <OverlayHost open animationType="none" onRequestClose={onRequestClose}>
        <Nested open onClose={closeFirst} />
        <Nested open onClose={closeSecond} />
      </OverlayHost>
    );

    requestClose(result);
    expect(closeSecond).toHaveBeenCalledTimes(1);
    expect(closeFirst).not.toHaveBeenCalled();
    expect(onRequestClose).not.toHaveBeenCalled();

    await result.rerender(
      <OverlayHost open animationType="none" onRequestClose={onRequestClose}>
        <Nested open onClose={closeFirst} />
        <Nested open={false} onClose={closeSecond} />
      </OverlayHost>
    );
    requestClose(result);
    expect(closeFirst).toHaveBeenCalledTimes(1);
    expect(onRequestClose).not.toHaveBeenCalled();

    await result.rerender(
      <OverlayHost open animationType="none" onRequestClose={onRequestClose}>
        <Nested open={false} onClose={closeFirst} />
        <Nested open={false} onClose={closeSecond} />
      </OverlayHost>
    );
    requestClose(result);
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it('forgets a nested overlay that unmounts', async () => {
    const onRequestClose = jest.fn();
    const closeNested = jest.fn();
    const result = await render(
      <OverlayHost open animationType="none" onRequestClose={onRequestClose}>
        <Nested open onClose={closeNested} />
      </OverlayHost>
    );

    await result.rerender(
      <OverlayHost open animationType="none" onRequestClose={onRequestClose}>
        {null}
      </OverlayHost>
    );
    requestClose(result);
    expect(closeNested).not.toHaveBeenCalled();
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it('ignores the request when it is not dismissible, but still closes nested overlays', async () => {
    const closeNested = jest.fn();
    const result = await render(
      <OverlayHost open animationType="none">
        <Nested open onClose={closeNested} />
      </OverlayHost>
    );

    requestClose(result);
    expect(closeNested).toHaveBeenCalledTimes(1);

    await result.rerender(
      <OverlayHost open animationType="none">
        <Nested open={false} onClose={closeNested} />
      </OverlayHost>
    );
    expect(() => requestClose(result)).not.toThrow();
    expect(closeNested).toHaveBeenCalledTimes(1);
  });

  it('renders nested portal content inside the host unless the caller names another host', async () => {
    const onExplicitTarget = jest.fn();
    const onOutsideTarget = jest.fn();
    const result = await render(
      <>
        <OverlayHost open animationType="none" onRequestClose={jest.fn()}>
          <PortaledText>Nested content</PortaledText>
          <Target portalHost="custom" onTarget={onExplicitTarget} />
        </OverlayHost>
        <Target onTarget={onOutsideTarget} />
      </>
    );

    const [modal] = result.root!.queryAll((instance) => instance.type === 'Modal');
    expect(within(modal!).getByText('Nested content')).toBeTruthy();
    expect(onExplicitTarget).toHaveBeenLastCalledWith('custom');
    expect(onOutsideTarget).toHaveBeenLastCalledWith(undefined);
  });
});
