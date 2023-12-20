import { CtxEffect, CtxInternal } from "./types";

export const effect = (ctx: CtxInternal) => (cb: CtxEffect) => {
  ctx.running_effect = cb;
  cb();
  ctx.running_effect = null;
};
