import {Notice} from 'air-design';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  400: '发出的请求有错误，服务器无法解析参数数据。',
  401: '用户没有权限（令牌、用户名、密码错误），或登录超时。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  415: 'Unsupported Media Type',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '应用服务产生错误，请检查服务日志。',
  501: '无法处理服务请求。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'};

function requestHeader() {
  const token = sessionStorage.getItem("air-pro-token");
  const uid = sessionStorage.getItem("air-pro-uid");
  const loginId = sessionStorage.getItem("air-pro-user");
  return {
    'Authorization': 'Bearer ' + token,
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-User-Id': uid || '',
    'X-User-Login-Id': loginId || ''};
}

export function isJSON(str: any) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj === 'object' && obj);
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
}

export async function SSE_POST(
    url: string | URL,
    params: any,
    callback: (data: string) => void,
    idleTimeout: number = 120000
) {
  const controller = new AbortController();
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let timeoutFired = false;

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      timeoutFired = true;
      controller.abort();
      callback('<|TIMEOUT|>');
    }, idleTimeout);
  };

  try {
    resetIdleTimer();

    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeader(),
      mode: 'cors',
      cache: 'no-cache',
      body: JSON.stringify(params),
      signal: controller.signal
    });

    if (!response.ok) {
      callback('<|ERR|>');
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    if (!reader) {
      callback('<|ERR|>');
      return;
    }

    while (true) {
      const {done, value} = await reader.read();
      resetIdleTimer();

      if (done) {
        if (buffer.length > 0) {
          parseMessageBlock(buffer, callback);
        }
        break;
      }

      const decodedChunk = decoder.decode(value, {stream: true});
      buffer += decodedChunk;

      let messageEnd;
      while ((messageEnd = buffer.indexOf('\n\n')) !== -1) {
        const messageBlock = buffer.substring(0, messageEnd);
        buffer = buffer.substring(messageEnd + 2);
        parseMessageBlock(messageBlock, callback);
      }
    }
  } catch (err: any) {
    if (timeoutFired || err?.name === 'AbortError') {
      return;
    }
    console.error('SSE POST 请求失败:', err);
    callback('<|ERR|>');
  } finally {
    if (idleTimer) clearTimeout(idleTimer);
  }
}

function parseMessageBlock(messageBlock: string, callback: (data: string) => void) {
  const lines = messageBlock.split('\n');
  const contentParts: string[] = [];

  for (const line of lines) {
    const dataPrefixIndex = line.indexOf('data:');
    if (dataPrefixIndex !== -1) {
      const content = line.substring(dataPrefixIndex + 5);
      if (content !== null && content !== undefined) {
        contentParts.push(content);
      }
    }
  }

  if (contentParts.length > 0) {
    const dataContent = contentParts.join('\n');
    if (dataContent !== null && dataContent !== undefined) {
      callback(dataContent);
    }
  }
}

export async function POST(url: string | URL | Request, params: any) {
  return new Promise(
      (resolve, reject) => {
        fetch(url, {
          method: 'POST',
          headers: requestHeader(),
          mode: 'cors',
          cache: "no-cache",
          body: isJSON(params) ? JSON.stringify(params) : params
        }).then((res) => {
          switch (res.status) {
            case 400:
              return resolve({
                success: false,
                code: 'HTTP-400',
                message: '异常 [HTTP-400], 请求参数错误'
              });
            case 401:
              sessionStorage.clear();
              window.dispatchEvent(new CustomEvent('auth-state-changed', {
                detail: {authenticated: false}}));

              if (url != '/rest/user/session/current' && url != '/rest/auth/login' && url != '/rest/auth/current'
                  && url != '/admin/user/login') {
                Notice.error('登录已失效', '您的登录已过期，请重新登录。');
              }
              return resolve({
                success: false,
                code: 'HTTP-401',
                message: '异常 [HTTP-401], 用户未登录或登录已过期'
              });
            case 404:
              return resolve({
                success: false,
                code: 'HTTP-404',
                message: '异常 [HTTP-404], 请求地址不存在'
              });
            case 408:
              return resolve({
                success: false,
                code: 'HTTP-408',
                message: '异常 [HTTP-408], 请求超时'
              });
            case 500:
              if (url != '/rest/user/current') {
                Notice.error('HTTP-500', '服务器内部错误');
              }
              return resolve({
                success: false,
                code: 'HTTP-500',
                message: '异常 [HTTP-500], 服务端无法处理当前请求'
              });
            case 501:
              return resolve({
                success: false,
                code: 'HTTP-501',
                message: '异常 [HTTP-501], 服务端无法处理当前请求'
              });
            case 502:
            case 503:
            case 504:
              return resolve({
                success: false,
                code: `HTTP-${res.status}`,
                message: '无法访问服务, 请检查服务是否正常运行，或联系平台管理员。'
              });
            case 200:
              if (res.headers.get('Content-Length') === '0') {
                return resolve({
                  success: false,
                  message: '服务端无法处理当前请求, 请检查服务是否正常运行，或联系平台管理员查看系统日志。'
                });
              }

              if (res.headers.get('Content-Type')?.indexOf('application/json') !== -1) {
                return res.json().then(resolve);
              } else if (res.headers.get('Content-Type')?.indexOf('application/octet-stream') !== -1) {
                return res.blob().then(blob => {
                  const contentDisposition = res.headers.get('Content-Disposition') || '';
                  const filename = decodeFilename(contentDisposition);
                  const url = window.URL.createObjectURL(blob);
                  const temp_a_tag_for_download = document.createElement('a');
                  temp_a_tag_for_download.style.display = 'none';
                  temp_a_tag_for_download.href = url;
                  temp_a_tag_for_download.download = filename;
                  document.body.appendChild(temp_a_tag_for_download);
                  temp_a_tag_for_download.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(temp_a_tag_for_download);
                  return resolve({success: true, message: '文件下载成功'});
                }).catch(reject);
              } else {
                return resolve(res.blob());
              }
            default:
              Notice.error(`HTTP ${res.status}`, codeMessage[res.status]);
          }
        }).catch(err => {
          Notice.error('网络错误', err.message);
          return resolve({
            success: false,
            code: 'NETWORK_ERROR',
            message: err.message || '网络连接失败'
          });
        });
      }
  );
}

export async function GET(url: string | URL | Request) {
  return new Promise<any>((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: requestHeader(),
      mode: 'cors',
      cache: 'no-cache'})
        .then((res) => {
          if (res.status === 200) {
            const ct = res.headers.get('Content-Type') || '';
            if (ct.indexOf('application/json') !== -1) {
              return res.json().then(resolve);
            }
            return res.text().then((t) => resolve({success: true, data: t}));
          }
          if (res.status === 401) {
            sessionStorage.clear();
            window.dispatchEvent(new CustomEvent('auth-state-changed', {
              detail: {authenticated: false}}));
          }
          resolve({
            success: false,
            message: codeMessage[res.status as keyof typeof codeMessage] || `HTTP ${res.status}`});
        })
        .catch((err) => reject(err));
  });
}

function decodeFilename(contentDisposition: string): string {
  let filename = 'download';

  const filenameRegex = /filename\*=(?:utf-8|UTF-8)''([\w%.-]+)/i;
  let matches = filenameRegex.exec(contentDisposition);
  if (matches != null && matches[1]) {
    try {
      return decodeURIComponent(matches[1].replace(/\+/g, '%20'));
    } catch (e) {
      console.error('解码文件名失败', e);
    }
  }

  const fallbackRegex = /filename="?(.+?)"?(?:;|$)/i;
  matches = fallbackRegex.exec(contentDisposition);
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '');
    try {
      return decodeURIComponent(filename);
    } catch (e) {
      try {
        return decodeURIComponent(escape(filename));
      } catch (e2) {
        console.error('解码文件名失败', e2);
        return filename;
      }
    }
  }

  return filename;
}
