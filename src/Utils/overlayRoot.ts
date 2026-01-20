function findOverlayRoot(el: HTMLElement | null): HTMLElement | null {
  let current = el;

  while (current) {
    if (current.dataset.overlayRoot === 'true') {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

export { findOverlayRoot };