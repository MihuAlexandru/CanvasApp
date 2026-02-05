export function distancePointToSegment(p, a, b) {
    const A = p.x - a.x;
    const B = p.y - a.y;
    const C = b.x - a.x;
    const D = b.y - a.y;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0)
        param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
        xx = a.x;
        yy = a.y;
    }
    else if (param > 1) {
        xx = b.x;
        yy = b.y;
    }
    else {
        xx = a.x + param * C;
        yy = a.y + param * D;
    }
    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}
export function getHandleAtPoint(p, b) {
    const size = 8;
    const half = size / 2;
    const handles = [
        { x: b.x, y: b.y }, // 0
        { x: b.x + b.w, y: b.y }, // 1
        { x: b.x, y: b.y + b.h }, // 2
        { x: b.x + b.w, y: b.y + b.h }, // 3
    ];
    for (let i = 0; i < handles.length; i++) {
        const h = handles[i];
        if (!h)
            continue;
        if (p.x >= h.x - half &&
            p.x <= h.x + half &&
            p.y >= h.y - half &&
            p.y <= h.y + half) {
            return i;
        }
    }
    return null;
}
//# sourceMappingURL=Helpers.js.map