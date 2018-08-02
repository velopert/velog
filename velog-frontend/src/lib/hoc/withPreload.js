// @flow
type PreloadFunction = (ctx: any, store: any) => Promise<*>;

export default function withPreload(preload: PreloadFunction) {
  return (WrappedComponent: any) => {
    WrappedComponent.preload = preload;
    return WrappedComponent;
  };
}
