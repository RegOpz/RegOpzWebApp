import promiseMiddleware from 'redux-promise';

export let LEFTMENUCLICK = 'LEFTMENUCLICK';

// TODO: Logout action for user
export function actionLeftMenuClick(isLeftMenu) {
  return {
    type: LEFTMENUCLICK,
    payload: isLeftMenu
  };
}
