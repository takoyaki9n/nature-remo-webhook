import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import TextOutput = GoogleAppsScript.Content.TextOutput;

import { NatureRemoAPI } from './NatureRemoAPI';
import { Constants } from './Constants';

declare var global: any;

global.doPost = (e: any): TextOutput => {
  const api = new NatureRemoAPI();
  if (api.authorize(e.parameter[Constants.AUTH])) {
    const command = e.parameter[Constants.COMMAND];
    if (api.runCommand(command)) {
      return ContentService.createTextOutput(command + ' succeed');
    } else {
      return ContentService.createTextOutput(command + ' failed');
    }
  }
  throw new Error('Authorization failed');
};
