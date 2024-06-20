import { computed, onMounted, ref, toValue, watch } from "vue";

const usePdfViewer = (container, options) => {
  const props = computed(() => ({
    gap: options?.gap ?? 10,
    view: options?.view ?? "vertical",
    textLayer: options?.textLayer ?? false,
    smoothJump: options?.smoothJump ?? false,
    renderDelay: options?.renderDelay ?? 50,
  }));

  const totalPage = ref(0);
  const pageInfo = ref([]);
  const containerBounds = ref({
    vert: {
      width: 0,
      height: 0,
    },
    horiz: {
      width: 0,
      height: 0,
    },
  });
  const scrollState = ref({
    rAF: null,
    state: {
      right: true,
      down: true,
      lastX: 0,
      lastY: 0,
    },
    covered: {
      x: 0,
      y: 0,
    },
    timer: null,
  });
  const currentPage = ref(options.page ?? 1);
  const progress = ref(0);
  const render = ref(true);
  const bypassSmooth = ref(false);

  const visiblePages = ref([]);
  const scale = computed(() => options.scale ?? 1);
  const rotation = computed(() =>
    (options.rotation * 1) % 90 == 0 ? options.rotation * 1 : 0
  );
  const viewMode = computed(() => props.value.view.toLowerCase());
  const gap = computed(() => options?.gap ?? 10);

  const readPDF = async () => {
    if (!!options.pdf) {
      const { docId, promise } = options.pdf;
      let pdf = await promise;

      const pdfPages = await getPageInfo(pdf, docId);

      pageInfo.value = pdfPages.pages;
      containerBounds.value = pdfPages.max;

      currentPage.value = getCurrentPage(
        scrollState.value.state,
        container.value
      );
      visiblePages.value = getVisiblePages(
        scrollState.value.state,
        container.value
      );
    }
  };

  const refresh = async () => {
    let p = currentPage.value;
    await readPDF();
    bypassSmooth.value = true;
    changePage(p);
    bypassSmooth.value = false;
  };

  const getPageInfo = async (pdf, docId) => {
    const { gap, dGap } = getGaps();
    const { numPages } = pdf;
    const isVertical = viewMode.value == "vertical";

    let pages = [],
      lastViewport = null,
      lastPos = 0,
      max = {
        width: isVertical ? 0 : gap,
        height: isVertical ? gap : 0,
      };

    totalPage.value = numPages;

    for (let i = 0; i < numPages; i++) {
      const pageNum = i + 1;
      const pageId = `${docId}_pdf_page_${pageNum}_${scale.value}_${rotation.value}`;
      let page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({
        scale: scale.value,
        rotation: rotation.value,
      });
      const _v =
        scale.value == 1
          ? viewport
          : page.getViewport({
              scale: 1,
              rotation: rotation.value,
            });
      const pos = {
        x: 0,
        y: 0,
      };

      if (isVertical) {
        lastPos += (lastViewport?.height ?? 0) + gap + 2;
        max.height += viewport.height + gap + 2;
        max.width = Math.max(max.width, viewport.width + dGap);
        pos.y = Math.round(lastPos);
      } else {
        lastPos += (lastViewport?.width ?? 0) + gap + 2;
        max.height = Math.max(max.height, viewport.height + dGap);
        max.width += viewport.width + gap + 2;
        pos.x = Math.round(lastPos);
      }

      pages.push({
        id: pageId,
        scale: scale.value,
        rotation: rotation.value,
        page: pageNum,
        viewport,
        v1: _v,
        pos,
      });

      lastViewport = { ...viewport };

      page.cleanup();
      page = null;

      updateProgress({
        loaded: (i + 1) * 8,
        total: numPages * 8,
      });
    }

    pages.forEach((p) => {
      if (isVertical) {
        p.pos.x = Math.round(max.width / 2 - p.viewport.width / 2);
      } else {
        p.pos.y = Math.round(max.height / 2 - p.viewport.height / 2);
      }
      Object.assign(p, { bounds: getBounds(p, isVertical) });
    });

    return { pages, max };
  };

  const getBounds = (pageInfo, vertical = true) => {
    const { gap, hGap } = getGaps();
    const { page, pos, viewport } = pageInfo;
    const firstHG = page > 1 ? hGap : gap;
    const lastHG = page < totalPage.value ? gap : hGap;
    const inner = getInnerBounds(pos, viewport);
    return vertical
      ? getVBounds(inner, gap, firstHG, lastHG)
      : getHBounds(inner, gap, firstHG, lastHG);
  };

  const getVBounds = (inner, gap, firstHG, lastHG) => {
    return {
      inner,
      outer: {
        top: inner.top - firstHG,
        bottom: inner.bottom + lastHG,
        left: inner.left - gap,
        right: inner.right + gap,
      },
    };
  };

  const getHBounds = (inner, gap, firstHG, lastHG) => {
    return {
      inner,
      outer: {
        top: inner.top - gap,
        bottom: inner.bottom + gap,
        left: inner.left - firstHG,
        right: inner.right + lastHG,
      },
    };
  };

  const getInnerBounds = (pos, viewport) => {
    return {
      top: pos.y,
      bottom: pos.y + viewport.height,
      left: pos.x,
      right: pos.x + viewport.width,
    };
  };

  const getGaps = () => {
    const gap = Math.abs(props.value.gap);
    return { gap, hGap: gap / 2, dGap: gap * 2 };
  };

  const updateProgress = (e) => {
    progress.value = (e.loaded / e.total) * 100;
  };

  const getVisiblePages = (sState, container) => {
    const { lastY, lastX } = sState;
    const { clientHeight, clientWidth } = container;
    let offset = Math.max(clientHeight, clientWidth);

    offset = Math.max(
      Math.min(offset * scale.value, offset * 2),
      offset * 0.75
    );

    const bounds = {
      top: lastY - offset,
      left: lastX - offset,
      right: lastX + offset * 2,
      bottom: lastY + offset * 2,
    };

    const filtered = pageInfo.value.filter((p) =>
      boundsIntersecting(p.bounds.outer, bounds)
    );
    return filtered;
  };

  const boundsIntersecting = (bounds1, bounds2) => {
    const { top: top1, left: left1, right: right1, bottom: bottom1 } = bounds1;
    const { top: top2, left: left2, right: right2, bottom: bottom2 } = bounds2;
    return !(
      right2 < left1 ||
      left2 > right1 ||
      bottom2 < top1 ||
      top2 > bottom1
    );
  };

  const onContainerScroll = (e) => {
    if (!scrollState.value.rAF) {
      scrollState.value.rAF = window.requestAnimationFrame(() => {
        if (scrollState.value.timer !== null) {
          clearTimeout(scrollState.value.timer);
          render.value = false;
        }
        scrollState.value.rAF = null;
        const currentX = e.target.scrollLeft;
        const lastX = scrollState.value.state.lastX;
        if (currentX !== lastX) {
          scrollState.value.state.right = currentX > lastX;
        }
        scrollState.value.state.lastX = currentX;

        const currentY = e.target.scrollTop;
        const lastY = scrollState.value.state.lastY;
        if (currentY !== lastY) {
          scrollState.value.state.down = currentY > lastY;
        }
        scrollState.value.state.lastY = currentY;

        scrollState.value.covered.y = Math.round(
          ((currentY + e.target.clientHeight) / e.target.scrollHeight) * 100
        );
        scrollState.value.covered.x = Math.round(
          ((currentX + e.target.clientWidth) / e.target.scrollWidth) * 100
        );
        visiblePages.value = getVisiblePages(scrollState.value.state, e.target);

        scrollState.value.timer = setTimeout(() => {
          let p = getCurrentPage(scrollState.value.state, e.target);
          if (currentPage.value != p) {
            currentPage.value = p;
          }
          render.value = true;
        }, props.value.renderDelay);
      });
    }
  };

  const inRange = (x, min, max) => {
    return (x - min) * (x - max) <= 0;
  };

  const getCurrentPage = (sState, target) => {
    let pos = 0,
      minKey = null,
      maxKey = null;
    if (viewMode.value == "vertical") {
      pos = sState.lastY + target.clientHeight / 2;
      minKey = "top";
      maxKey = "bottom";
    } else {
      pos = sState.lastX + target.clientWidth / 2;
      minKey = "left";
      maxKey = "right";
    }
    return (
      pageInfo.value.find((p) =>
        inRange(pos, p.bounds.outer[minKey], p.bounds.outer[maxKey])
      )?.page ?? 1
    );
  };

  const nextPage = () => {
    let p = currentPage.value + 1;
    changePage(Math.min(p, totalPage.value));
  };

  const prevPage = () => {
    let p = currentPage.value - 1;
    changePage(Math.max(p, 1));
  };

  const changePage = (page, offset = null) => {
    const pInfo = pageInfo.value.find((p) => p.page == (page ?? 1));
    const { clientHeight, clientWidth } = container.value;
    currentPage.value = page;
    if (!!pInfo) {
      const { gap, hGap } = getGaps();
      const { top, left } = pInfo.bounds.outer;
      const viewport = pInfo.viewport;
      const scroll = {
        top,
        left,
        behavior:
          props.value.smoothJump && !bypassSmooth.value ? "smooth" : "auto",
      };
      let offY = pageOffset(offset?.y, viewport.height, page, gap);
      let offX = Math.floor((offset?.x ?? 0) * scale.value);

      if (viewMode.value == "vertical") {
        if (viewport.height < clientHeight) {
          scroll.top =
            Math.round(top - clientHeight / 2 + viewport.height / 2) - hGap;
        } else {
          scroll.top = top - (gap + hGap);
        }
      } else {
        if (viewport.width < clientWidth) {
          scroll.left =
            Math.round(left - clientWidth / 2 + viewport.width / 2) + hGap;
        } else {
          scroll.left = left - (gap + hGap);
        }
      }
      scroll.top += offY;
      scroll.left += offX;
      container.value.scrollTo(scroll);
    }
  };

  const pageOffset = (initial, size, page, gap) => {
    return !!initial
      ? Math.floor(size - initial * scale.value)
      : page > 1
      ? gap
      : 0;
  };

  const getFitRatio = (size, parentSize) => {
    const { dGap } = getGaps();
    return (parentSize - dGap) / size;
  };

  const fitWidth = () => {
    return fitPage("width");
  };

  const fitHeight = () => {
    return fitPage("height");
  };

  const fitPage = (mode = "fit") => {
    const page = pageInfo.value.find((p) => p.page == currentPage.value);
    const { width, height } = page.v1;
    const { clientWidth, clientHeight } = container.value;
    const fit = {
      width: getFitRatio(width, clientWidth),
      height: getFitRatio(height, clientHeight),
    };
    return fit[mode] ?? Math.min(fit.width, fit.height);
  };

  watch([() => options.pdf, scale, rotation, viewMode, gap], refresh, {
    deep: true,
  });

  onMounted(async () => {
    scrollState.value.state.lastX = container.value.scrollLeft;
    scrollState.value.state.lastY = container.value.scrollTop;
    container.value.addEventListener("scroll", onContainerScroll, true);

    if (!!options.pdf) {
      await readPDF();

      if (!!options.page) {
        changePage(options.page);
      }
    }
  });

  return {
    totalPage,
    pageInfo,
    containerBounds,
    scrollState,
    progress,
    render,
    currentPage,
    visiblePages,
    scale,
    rotation,
    viewMode,
    readPDF,
    refresh,
    getPageInfo,
    getBounds,
    getVBounds,
    getHBounds,
    getInnerBounds,
    getGaps,
    updateProgress,
    getVisiblePages,
    boundsIntersecting,
    onContainerScroll,
    inRange,
    getCurrentPage,
    nextPage,
    prevPage,
    changePage,
    getFitRatio,
    fitWidth,
    fitHeight,
    fitPage,
  };
};

export default usePdfViewer;
