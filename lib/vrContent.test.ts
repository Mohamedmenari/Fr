import test from "node:test";
import assert from "node:assert/strict";
import {
  ANIMATION_DURATION_MS,
  ANIMATION_DURATION_SECONDS,
  HEADSET_ANNOTATIONS,
  IMPORTANCE_PILLARS,
  TOTAL_BG_FRAMES,
  USE_DOMAINS,
  calculateAnimationTimeSeconds,
  calculateScrollFrame,
  calculateScrollProgress,
  getBgFrameUrl,
  getUseDomainById,
  shouldShowAnnotations,
} from "./vrContent";

test("calculateScrollFrame maps scroll progress smoothly between 1 and 193", () => {
  assert.equal(calculateScrollFrame(0), 1);
  assert.equal(calculateScrollFrame(1), TOTAL_BG_FRAMES);
  assert.equal(calculateScrollFrame(0.5), 97);
  assert.equal(calculateScrollFrame(-0.4), 1);
  assert.equal(calculateScrollFrame(1.8), TOTAL_BG_FRAMES);
  assert.equal(calculateScrollFrame(Number.NaN), 1);
});

test("calculateScrollProgress and 6-second animation timeline stay synchronized", () => {
  assert.equal(ANIMATION_DURATION_SECONDS, 6);
  assert.equal(ANIMATION_DURATION_MS, 6000);
  assert.equal(calculateScrollProgress(0, 1200), 0);
  assert.equal(calculateScrollProgress(600, 1200), 0.5);
  assert.equal(calculateScrollProgress(1200, 1200), 1);
  assert.equal(calculateScrollProgress(1500, 1200), 1);
  assert.equal(calculateScrollProgress(100, 0), 0);

  assert.equal(calculateAnimationTimeSeconds(1), 0);
  assert.equal(calculateAnimationTimeSeconds(97), 3);
  assert.equal(calculateAnimationTimeSeconds(TOTAL_BG_FRAMES), 6);
});

test("getBgFrameUrl formats four-digit WebP paths without video files", () => {
  assert.equal(getBgFrameUrl(1), "/aivid/frames/frame_0001.webp");
  assert.equal(getBgFrameUrl(121), "/aivid/frames/frame_0121.webp");
  assert.equal(getBgFrameUrl(999), "/aivid/frames/frame_0193.webp");
});

test("shouldShowAnnotations activates only on the exploded end stage", () => {
  assert.equal(shouldShowAnnotations(1), false);
  assert.equal(shouldShowAnnotations(165), false);
  assert.equal(shouldShowAnnotations(190), true);
  assert.equal(shouldShowAnnotations(193), true);
});

test("French academic pillars, use domains, and headset annotations are valid", () => {
  assert.equal(IMPORTANCE_PILLARS.length, 4);
  assert.equal(USE_DOMAINS.length, 4);
  assert.equal(HEADSET_ANNOTATIONS.length, 6);

  for (const domain of USE_DOMAINS) {
    assert.ok(domain.title.length > 0);
    assert.ok(domain.examples.length >= 3);
  }

  for (const ann of HEADSET_ANNOTATIONS) {
    assert.ok(ann.label.length > 0);
    assert.ok(ann.dotX >= 0 && ann.dotX <= 1000);
    assert.ok(ann.dotY >= 0 && ann.dotY <= 562.5);
    assert.ok(ann.labelX >= 0 && ann.labelX <= 1000);
    assert.ok(ann.labelY >= 0 && ann.labelY <= 562.5);
  }

  assert.equal(getUseDomainById("medecine").id, "medecine");
  assert.equal(getUseDomainById("architecture").id, "architecture");
  assert.equal(getUseDomainById("inconnu").id, "education");
});
