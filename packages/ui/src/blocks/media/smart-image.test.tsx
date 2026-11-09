import { act, render } from '../../test/render';
import { SmartImage } from './smart-image';

type Rendered = Awaited<ReturnType<typeof render>>;

function imageIn(result: Rendered) {
  const [image] = result.root!.queryAll(
    (instance) => instance.props.source != null && typeof instance.props.onLoad === 'function'
  );
  if (!image) throw new Error('SmartImage did not render its image');
  return image;
}

function skeletonIn(result: Rendered) {
  return result.root!.queryAll((instance) => {
    const className = instance.props.className as unknown;
    return typeof className === 'string' && className.includes('absolute inset-0');
  });
}

describe('SmartImage', () => {
  it('returns to its loading phase when the rendered image starts another load', async () => {
    const result = await render(
      <SmartImage source={{ uri: 'first.png' }} alt="Preview" className="h-20 w-20" />
    );
    expect(skeletonIn(result)).toHaveLength(1);

    await act(async () => imageIn(result).props.onLoad({ nativeEvent: {} }));
    expect(skeletonIn(result)).toHaveLength(0);

    await act(async () => imageIn(result).props.onLoadStart());
    expect(skeletonIn(result)).toHaveLength(1);
  });
});
