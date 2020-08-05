import router from 'umi/router';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('dm.full.crm') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('dm.full.crm') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('dm.full.crm', JSON.stringify(proAuthority));
}

// 删除信息并且推出系统
export function removeInfoLoginOut() {
  localStorage.clear();
  router.push('/user/login');
}
