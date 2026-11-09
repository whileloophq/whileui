import { fireEvent, render, screen } from '../../test/render';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

type Rendered = Awaited<ReturnType<typeof render>>;

function imageIn(result: Rendered) {
  const [image] = result.root!.queryAll((instance) => instance.type === 'Image');
  if (!image) throw new Error('AvatarImage did not render an Image');
  return image;
}

describe('AvatarImage', () => {
  it('reports its lifecycle, preserves image callbacks, and restores fallback while reloading', async () => {
    const onLoadingStatusChange = jest.fn();
    const onLoadStart = jest.fn();
    const onLoad = jest.fn();
    const result = await render(
      <Avatar>
        <AvatarImage
          source={{ uri: 'first.png' }}
          alt="Profile photo"
          onLoadingStatusChange={onLoadingStatusChange}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
        />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    const image = imageIn(result);

    await fireEvent(image, 'loadStart');
    expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loading');
    expect(onLoadStart).toHaveBeenCalledTimes(1);

    await fireEvent(image, 'load');
    expect(screen.queryByText('AL')).toBeNull();
    expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loaded');
    expect(onLoad).toHaveBeenCalledTimes(1);

    await result.rerender(
      <Avatar>
        <AvatarImage
          source={{ uri: 'second.png' }}
          alt="Profile photo"
          onLoadingStatusChange={onLoadingStatusChange}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
        />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    await fireEvent(imageIn(result), 'loadStart');

    expect(screen.getByText('AL')).toBeOnTheScreen();
    expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loading');
  });
});
