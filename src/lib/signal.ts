export const SIGNAL_DURATION = 1100;
export const SIGNAL_EDGES = [0, .18, .31, .38, .61, .68, .86, 1];
const SHIFTS = [-.8, .55, -1, .18, .9, -.35, .55];
const ARRIVALS = [0, .12, .03, .2, .08, 0, .15];

export function signalBandFrames(index: number): Keyframe[] {
  const shift = SHIFTS[index] * 14;
  return [
    { offset: 0, opacity: ARRIVALS[index] ? 0 : 1, transform: `translateX(${shift}px)`, easing: "steps(1,end)" },
    { offset: ARRIVALS[index] || .01, opacity: 1, transform: `translateX(${shift}px)`, easing: "steps(1,end)" },
    { offset: .3, opacity: 1, transform: `translateX(${-shift * .32}px)`, easing: "steps(1,end)" },
    { offset: .49, opacity: 1, transform: `translateX(${shift * .12}px)`, easing: "ease-out" },
    { offset: .73, opacity: 1, transform: "translateX(0px)" },
    { offset: .88, opacity: 0, transform: "translateX(0px)" },
    { offset: 1, opacity: 0, transform: "translateX(0px)" },
  ];
}

export function signalChannelFrames(band: number, channel: number): Keyframe[] {
  const split = (channel - 1) * 14 * (band % 3 === 1 ? .55 : .23);
  return [
    { offset: 0, transform: `translateX(${split}px)`, easing: "steps(1,end)" },
    { offset: .3, transform: `translateX(${-split * .6}px)`, easing: "steps(1,end)" },
    { offset: .49, transform: `translateX(${split * .24}px)`, easing: "ease-out" },
    { offset: .73, transform: "translateX(0px)" },
    { offset: 1, transform: "translateX(0px)" },
  ];
}
