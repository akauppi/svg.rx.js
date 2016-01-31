          /*
           * 'o' is either MouseEvent or Touch. They have following coordinate info:
           *
           *    .client[X|Y]    Relative to the visible browser window (scrolling affects)
           *                    "mouse pointer in local (DOM content) coordinates" (mouse)
           *                    "relative to the left edge of the browser viewport, not including any scroll offset" (touch)
           *
           *    .page[X|Y]      Relative to the full browser window (scrolling does not affect)
           *                    "relative to the whole document" (mouse)
           *                    "relative to the left|top edge of the document. Unlike clientX|Y, this value includes the
           *                    horizontal scroll offset, if any" (touch)
           *
           *    .screen[X|Y]    Global (physical screen) coordinates (scrolling affects)
           *                    "in global (screen) coordinates" (mouse)
           *                    "coordinate of the touch point relative to the left|top edge of the screen" (touch)
           *
           * Note:
           *    .offset[X|Y]    "coordinate .. relative to the position of the padding edge of the target node" (mouse only)
           *    .layer[X|Y]     (not mentioned in Mozilla docs)
           *    .x|y            (same as '.client[X|Y]')
           *
           * Reference:
           *    MouseEvent -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
           *    Touch -> https://developer.mozilla.org/en-US/docs/Web/API/touch
           */
