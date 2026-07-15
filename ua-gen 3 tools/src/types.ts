/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera';
export type OSType = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

export interface UserAgentItem {
  id: string;
  userAgent: string;
  browser: BrowserType;
  browserVersion: string;
  os: OSType;
  osVersion: string;
  device?: string;
  timestamp: number;
  starred: boolean;
  locale?: string;
  socialMedia?: string;
}

export interface EngineSettings {
  chromeMinVersion: number;
  chromeMaxVersion: number;
  firefoxMinVersion: number;
  firefoxMaxVersion: number;
  safariMinVersion: number;
  safariMaxVersion: number;
  locale: string;
  includeLayoutEngine: boolean;
}

export interface ToastState {
  message: string;
  visible: boolean;
  type: 'success' | 'info' | 'error';
}

export type ActiveTabType = 'generator' | 'results' | 'saved';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin' | 'sub-admin';
  createdAt: string;
}

