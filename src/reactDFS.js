function reactDFS(node) {
  let nextNode = node;

  while (nextNode !== null) {
    const child = nextNode.child;
    if (child !== null) {
      nextNode = child;
    } else {
      up: while (nextNode !== null) {
        const sibling = nextNode.sibling;

        if (sibling !== null) {
          nextNode = sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
}
