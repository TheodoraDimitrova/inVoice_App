const cacheByUser = new Map();

export function readDashboardCache(uid) {
  return cacheByUser.get(uid) || null;
}

export function writeDashboardCache(uid, snapshot) {
  cacheByUser.set(uid, snapshot);
}

export function clearDashboardCache(uid) {
  if (!uid) return;
  cacheByUser.delete(uid);
}
