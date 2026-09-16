import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.AUDIT_BASE_URL || 'http://localhost:5173';
const adminToken = process.env.AUDIT_ADMIN_TOKEN || '';
const debugPort = 9333;
const profileDirectory = mkdtempSync(join(tmpdir(), 'nestway-responsive-audit-'));
const publicRoutes = [
  '/', '/about', '/services', '/services/study-visa', '/services/visit-visa', '/services/skilled-immigration',
  '/services/business-immigration', '/countries', '/countries/australia', '/countries/united-kingdom',
  '/countries/canada', '/countries/new-zealand', '/countries/malaysia', '/countries/europe',
  '/company-profile', '/success-stories', '/universities', '/universities/australia', '/blogs',
  '/blogs/how-to-build-a-strong-study-visa-plan', '/appointment', '/contact', '/faq', '/training',
  '/training/ielts', '/admin/login',
];
const requestedRoutes = (process.env.AUDIT_ROUTES || '').split(',').map((route) => route.trim()).filter(Boolean);
const routesToAudit = requestedRoutes.length ? requestedRoutes : publicRoutes;
const adminRoutes = ['/admin/dashboard', '/admin/leads', '/admin/appointments', '/admin/consultants', '/admin/services', '/admin/media', '/admin/activity'];
const widths = [1920, 1440, 1024, 768, 390, 375];
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDirectory}`, 'about:blank',
], { stdio: 'ignore', windowsHide: true });
const pause = (milliseconds) => new Promise((resolvePause) => setTimeout(resolvePause, milliseconds));

async function waitForTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
      const pageTarget = targets.find((target) => target.type === 'page' && target.url === 'about:blank')
        || targets.find((target) => target.type === 'page');
      if (process.env.AUDIT_DEBUG === 'true') console.error(JSON.stringify(targets.map(({ type, url, title }) => ({ type, url, title }))));
      if (pageTarget?.webSocketDebuggerUrl) return pageTarget.webSocketDebuggerUrl;
    } catch {}
    await pause(150);
  }
  throw new Error('Chrome DevTools target did not become available');
}

function createClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let id = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolveMessage, rejectMessage } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectMessage(new Error(message.error.message)); else resolveMessage(message.result);
  };
  const ready = new Promise((resolveReady, rejectReady) => {
    socket.onopen = resolveReady;
    socket.onerror = rejectReady;
  });
  return {
    ready,
    close: () => socket.close(),
    send(method, params = {}) {
      id += 1;
      const requestId = id;
      return new Promise((resolveMessage, rejectMessage) => {
        pending.set(requestId, { resolveMessage, rejectMessage });
        socket.send(JSON.stringify({ id: requestId, method, params }));
      });
    },
  };
}

async function auditRoute(client, route, width) {
  const auditId = `${width}-${Date.now()}`;
  await client.send('Emulation.setDeviceMetricsOverride', { width, height: width <= 390 ? 844 : width <= 768 ? 1024 : 900, deviceScaleFactor: 1, mobile: width < 768 });
  await client.send('Page.navigate', { url: `${baseUrl}${route}?responsiveAudit=${auditId}` });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await client.send('Runtime.evaluate', { returnByValue: true, expression: `document.readyState === 'complete'
      && location.pathname === ${JSON.stringify(route)}
      && new URLSearchParams(location.search).get('responsiveAudit') === ${JSON.stringify(auditId)}
      && Boolean(document.querySelector('#root main'))
      && (${JSON.stringify(route)} !== '/' || Boolean(document.querySelector('#destinations')))` });
    if (ready.result.value) break;
    await pause(150);
  }
  await pause(500);
  if (route === '/' && width >= 1024) {
    await client.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const buttons = [...document.querySelectorAll('#destinations button[aria-pressed]')];
        for (const button of buttons) {
          button.scrollIntoView({ block: 'center' });
          await new Promise((resolve) => setTimeout(resolve, 220));
        }
        await new Promise((resolve) => setTimeout(resolve, 800));
      })()`,
    });
  }
  await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.documentElement.scrollHeight)' });
  await pause(250);
  const result = await client.send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const viewport = window.innerWidth;
      const documentWidth = document.documentElement.scrollWidth;
      const offenders = [...document.querySelectorAll('body *')].filter((element) => {
        const style = getComputedStyle(element);
        const insideIntentionalScroller = [...function* ancestors(node) { for (let parent = node.parentElement; parent; parent = parent.parentElement) yield parent; }(element)]
          .some((parent) => ['auto', 'scroll'].includes(getComputedStyle(parent).overflowX) && parent.scrollWidth > parent.clientWidth);
        if (element instanceof SVGElement || insideIntentionalScroller || style.position === 'fixed' || style.position === 'absolute' || style.display === 'none') return false;
        const rectangle = element.getBoundingClientRect();
        return rectangle.width > 0 && (rectangle.left < -1 || rectangle.right > viewport + 1);
      }).slice(0, 5).map((element) => ({ tag: element.tagName, className: String(element.className).slice(0, 100) }));
      const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src).slice(0, 5);
      const invalidLinks = [...document.querySelectorAll('a')].filter((link) => !link.getAttribute('href') || link.getAttribute('href') === '#').map((link) => link.textContent.trim()).slice(0, 5);
      const destinationActive = document.querySelector('#destinations [aria-pressed="true"]')?.textContent.trim() || null;
      const destinationImageAlt = document.querySelector('#destinations [data-desktop-destinations] img')?.getAttribute('alt') || null;
      const desktopDestinationCount = document.querySelectorAll('#destinations [data-desktop-destinations] button').length;
      const mobileDestinationCount = document.querySelectorAll('#destinations [data-mobile-destinations] article').length;
      return { title: document.title, viewport, documentWidth, offenders, brokenImages, invalidLinks, destinationActive, destinationImageAlt, desktopDestinationCount, mobileDestinationCount };
    })()`,
  });
  return { route, width, ...result.result.value };
}

let client;
try {
  client = createClient(await waitForTarget());
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.navigate', { url: baseUrl });
  await pause(350);
  if (adminToken) await client.send('Runtime.evaluate', { expression: `localStorage.setItem('nestway_token', ${JSON.stringify(adminToken)})` });
  const checks = [];
  for (const width of widths) {
    for (const route of [...routesToAudit, ...(adminToken && !requestedRoutes.length ? adminRoutes : [])]) checks.push(await auditRoute(client, route, width));
  }
  const failures = checks.filter((check) => check.documentWidth > check.viewport + 1
    || check.offenders.length
    || check.brokenImages.length
    || check.invalidLinks.length
    || (check.route === '/' && check.width >= 1024 && check.desktopDestinationCount < 7)
    || (check.route === '/' && check.width < 1024 && check.mobileDestinationCount < 7));
  console.log(JSON.stringify({ checked: checks.length, widths, adminAuthenticated: Boolean(adminToken), failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  client?.close();
  chrome.kill();
}
