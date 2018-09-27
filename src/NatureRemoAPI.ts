import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import Properties = GoogleAppsScript.Properties.Properties;

import { Constants } from './Constants';

export class NatureRemoAPI {
  static getHostUrl(): string {
    return 'https://api.nature.global/1';
  }

  static getAppliancesUrl(): string {
    return this.getHostUrl() + '/appliances';
  }

  static getSignalsSendUrl(signalId: string): string {
    return this.getHostUrl() + '/signals/' + signalId + '/send';
  }

  private readonly token: string;
  private readonly properties: Properties;
  private readonly debug: boolean;

  constructor() {
    this.properties = PropertiesService.getScriptProperties();
    this.token = this.properties.getProperty(Constants.TOKEN);
    this.debug = this.properties.getProperty(Constants.DEBUG) == 'true';
  }

  private getAPI(url: string): HTTPResponse {
    console.log(url);
    if (this.debug) return null;

    const headers = {
      Authorization: 'Bearer ' + this.token,
      Accept: 'application/json'
    };
    const params: URLFetchRequestOptions = {
      method: 'get',
      headers: headers
    };
    return UrlFetchApp.fetch(url, params);
  }

  private postAPI(url: string, payload: object): HTTPResponse {
    console.log(url);
    if (this.debug) return null;

    const headers = {
      Authorization: 'Bearer ' + this.token,
      Accept: 'application/json'
    };
    const params: URLFetchRequestOptions = {
      method: 'post',
      headers: headers,
      payload: payload
    };
    return UrlFetchApp.fetch(url, params);
  }

  private postSignalSend(signalId: string): HTTPResponse {
    const url = NatureRemoAPI.getSignalsSendUrl(signalId);
    return this.postAPI(url, {});
  }

  private readonly commands = {
    roomba_start: () => {
      this.runCommand('roomba_clean');
      this.runCommand('roomba_clean');
    }
  };

  public runCommand(command: string): boolean {
    if (this.commands[command]) {
      this.commands[command]();
      return true;
    }

    const signalId = this.properties.getProperty(command);
    if (signalId == null) return false;

    this.postSignalSend(signalId);
    return true;
  }

  public authorize(auth: string): boolean {
    return auth == this.properties.getProperty(Constants.AUTH);
  }
}
