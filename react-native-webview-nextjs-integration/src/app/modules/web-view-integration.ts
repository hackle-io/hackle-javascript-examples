import {
  Config,
  createInstance,
  Decision,
  DecisionReason,
  FeatureFlagDecision,
  HackleEvent,
  HackleSubscriptionOperations,
  PageView,
  PropertyOperations,
  User,
} from "@hackler/javascript-sdk";
import { v4 as uuidv4 } from "uuid";
import { Emitter } from "./emitter";

interface Port {
  postMessage(serialized: string): void;
}

declare global {
  interface Window {
    ReactNativeWebView: Port;

    _hackle_injected: boolean;
  }
}

function promiseWithTimeout<T>(
  callback: (
    resolve: (value: T) => void,
    reject: (reason?: any) => void
  ) => void,
  {
    timeoutMillis = 5000,
    onTimeout,
  }: {
    timeoutMillis?: number;
    onTimeout: (
      resolve: (value: T) => void,
      reject: (reason?: any) => void
    ) => void;
  }
) {
  return new Promise<T>((resolve, reject) => {
    callback(resolve, reject);

    setTimeout(() => {
      onTimeout(resolve, reject);
    }, timeoutMillis);
  });
}

/**
 * WebView 여부에 따라 다른 인스턴스를 반환하도록 하는 Wrapper
 * @example const hackleClient = new HackleManager().createInstance("SDK_KEY")
 */
class HackleManager {
  private injectFlag = "_hackle_injected" as const;

  private isInjectedEnvironment() {
    if (typeof window === "undefined" || !window.ReactNativeWebView)
      return false;

    return window[this.injectFlag] === true;
  }
  createInstance(sdkKey: string, config: Config) {
    if (this.isInjectedEnvironment()) {
      const messageTransceiver = new WebViewMessageTransceiver(
        window.ReactNativeWebView
      );

      return new HackleWebViewClient(sdkKey, config, messageTransceiver);
    }

    return new HackleWebOnlyClient(sdkKey, config);
  }
}

class WebViewMessageTransceiver {
  cleanUp: () => void = () => {};

  constructor(readonly port: Port) {}

  addEventListener(_listener: EventListener) {
    // to work in both Android and iOS, useCapture should be true
    window.addEventListener("message", _listener, true);
    this.cleanUp = () => window.removeEventListener("message", _listener, true);
  }
}

/**
 * ReactNative WebView 환경에서만 동작하는 HackleClient
 */
class HackleWebViewClient extends Emitter<{
  "user-updated": string;
}> {
  private messageFieldName = "_hackle_message";
  private resolverRecord = new Map();

  constructor(
    private readonly sdkKey: string,
    private readonly config: Config,
    private readonly messageTransceiver: WebViewMessageTransceiver
  ) {
    super();
    this.messageTransceiver.addEventListener((e) => {
      const event = e as MessageEvent;
      if (!event.data || event.data === "undefined") return;

      try {
        const data = JSON.parse(event.data);
        if (this.messageFieldName in data) {
          const { id, payload } = data[this.messageFieldName];

          if (id) {
            this.resolverRecord.get(id)?.(payload);
            this.resolverRecord.delete(id);
          }
        }
      } catch (err) {
        console.log(
          `[DEBUG] Hackle: Failed to parse message. If message not sent by hackle, please ignore this. ${err}`
        );
      }
    });
  }

  private createMessage(id: string, type: string, payload: any) {
    return JSON.stringify({
      [this.messageFieldName]: {
        id,
        type,
        payload,
      },
    });
  }

  private createId() {
    return uuidv4();
  }

  async getSessionId() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "getSessionId", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve("") }
    );
  }

  async getUser() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "getUser", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve({}) }
    );
  }

  setUser(user: User) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setUser", { user })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  setUserId(userId: string | undefined | null) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setUserId", { userId })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  setDeviceId(deviceId: string | undefined | null) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setDeviceId", { deviceId })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  setUserProperty(key: string, value: any) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setUserProperty", { key, value })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  setUserProperties(properties: Record<string, any>) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setUserProperties", { properties })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  updateUserProperties(operations: PropertyOperations) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "updateUserProperties", {
            operations: operations.toRecord(),
          })
        );

        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  updatePushSubscriptions(operations: HackleSubscriptionOperations) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "updatePushSubscriptions", {
            operations: operations.toRecord(),
          })
        );

        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  updateSmsSubscriptions(operations: HackleSubscriptionOperations) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "updateSmsSubscriptions", {
            operations: operations.toRecord(),
          })
        );

        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  updateKakaoSubscriptions(operations: HackleSubscriptionOperations) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "updateKakaoSubscriptions", {
            operations: operations.toRecord(),
          })
        );

        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  setPhoneNumber(phoneNumber: string) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "setPhoneNumber", { phoneNumber })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  unsetPhoneNumber() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "unsetPhoneNumber", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  resetUser() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "resetUser", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }

  variation(experimentKey: number): Promise<string> {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "variation", {
            experimentKey,
          })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve("A") }
    );
  }

  async variationDetail(experimentKey: number) {
    const id = this.createId();

    try {
      const payload = await promiseWithTimeout(
        (resolve) => {
          this.messageTransceiver.port.postMessage(
            this.createMessage(id, "variationDetail", {
              experimentKey,
            })
          );
          this.resolverRecord.set(id, resolve);
        },
        {
          onTimeout: (resolve, reject) => reject(),
        }
      );

      const { variation, reason, parameters } = payload as any;

      return Decision.of(
        variation,
        reason,
        new WebViewParameterConfig(parameters ?? {})
      );
    } catch {
      return Decision.of("A", DecisionReason.EXCEPTION);
    }
  }

  isFeatureOn(featureKey: number) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "isFeatureOn", {
            featureKey,
          })
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(false) }
    );
  }

  async featureFlagDetail(featureKey: number) {
    const id = this.createId();

    try {
      const payload = await promiseWithTimeout(
        (resolve) => {
          this.messageTransceiver.port.postMessage(
            this.createMessage(id, "featureFlagDetail", {
              featureKey,
            })
          );
          this.resolverRecord.set(id, resolve);
        },
        { onTimeout: (resolve, reject) => reject() }
      );
      const { isOn, reason, parameters } = payload as any;

      return new FeatureFlagDecision(
        isOn,
        reason,
        new WebViewParameterConfig(parameters ?? {}),
        undefined
      );
    } catch {
      return FeatureFlagDecision.off(DecisionReason.EXCEPTION);
    }
  }

  track(event: Event, user: User) {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "track", { event, user })
        );
        this.resolverRecord.set(id, resolve);
      },
      {
        onTimeout: (resolve) => resolve(null),
      }
    );
  }

  async trackPageView() {
    // not implemented
  }

  remoteConfig() {
    const remoteConfigGetter = (key: string, defaultValue: any) => {
      const id = this.createId();

      return promiseWithTimeout(
        (resolve) => {
          this.messageTransceiver.port.postMessage(
            this.createMessage(id, "remoteConfig", {
              key,
              defaultValue,
            })
          );
          this.resolverRecord.set(id, resolve);
        },
        { onTimeout: (resolve) => resolve(defaultValue) }
      );
    };

    return new WebViewRemoteConfig(remoteConfigGetter);
  }

  showUserExplorer() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "showUserExplorer", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      {
        onTimeout: (resolve) => resolve(null),
      }
    );
  }

  async hideUserExplorer() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "hideUserExplorer", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      {
        onTimeout: (resolve) => resolve(null),
      }
    );
  }

  fetch() {
    const id = this.createId();

    return promiseWithTimeout(
      (resolve) => {
        this.messageTransceiver.port.postMessage(
          this.createMessage(id, "fetch", null)
        );
        this.resolverRecord.set(id, resolve);
      },
      { onTimeout: (resolve) => resolve(null) }
    );
  }
}

/**
 * React Native WebView 환경이 아닌 경우 사용되는 hackleClient
 */
class HackleWebOnlyClient extends Emitter<{
  "user-updated": string;
}> {
  client;
  constructor(sdkKey: string, config: Config) {
    super();
    this.client = createInstance(sdkKey, config);
  }

  private emitUserUpdated() {
    this.emit("user-updated", JSON.stringify(this.getUser()));
  }

  getSessionId() {
    return Promise.resolve(this.client.getSessionId());
  }

  getUser() {
    return Promise.resolve(this.client.getUser());
  }

  setUser(user: User) {
    this.emitUserUpdated();
    return Promise.resolve(this.client.setUser(user));
  }

  setUserId(userId: string | undefined | null) {
    this.emitUserUpdated();
    return Promise.resolve(this.client.setUserId(userId));
  }

  setDeviceId(deviceId: string) {
    this.client.setDeviceId(deviceId);
    this.emitUserUpdated();
    return Promise.resolve();
  }
  setUserProperty(key: string, value: any) {
    this.emitUserUpdated();
    return Promise.resolve(this.client.setUserProperty(key, value));
  }
  setUserProperties(properties: Record<string, any>) {
    this.emitUserUpdated();
    return Promise.resolve(this.client.setUserProperties(properties));
  }
  updateUserProperties(operations: PropertyOperations) {
    this.emitUserUpdated();
    return Promise.resolve(this.client.updateUserProperties(operations));
  }
  updatePushSubscriptions(operations: HackleSubscriptionOperations) {
    return Promise.resolve(this.client.updatePushSubscriptions(operations));
  }
  updateSmsSubscriptions(operations: HackleSubscriptionOperations) {
    return Promise.resolve(this.client.updateSmsSubscriptions(operations));
  }
  updateKakaoSubscriptions(operations: HackleSubscriptionOperations) {
    return Promise.resolve(this.client.updateKakaoSubscriptions(operations));
  }
  setPhoneNumber(phoneNumber: string) {
    return Promise.resolve(this.client.setPhoneNumber(phoneNumber));
  }
  unsetPhoneNumber() {
    return Promise.resolve(this.client.unsetPhoneNumber());
  }
  resetUser() {
    // this.emitUserUpdated();
    return Promise.resolve(this.client.resetUser());
  }
  variation(experimentKey: number): Promise<string> {
    return Promise.resolve(this.client.variation(experimentKey));
  }
  variationDetail(experimentKey: number) {
    return Promise.resolve(this.client.variationDetail(experimentKey));
  }
  isFeatureOn(featureKey: number) {
    return Promise.resolve(this.client.isFeatureOn(featureKey));
  }
  featureFlagDetail(featureKey: number) {
    return Promise.resolve(this.client.featureFlagDetail(featureKey));
  }
  track(event: HackleEvent) {
    return Promise.resolve(this.client.track(event));
  }
  trackPageView(option: PageView) {
    return Promise.resolve(this.client.trackPageView(option));
  }
  remoteConfig() {
    return this.client.remoteConfig();
  }
  showUserExplorer() {
    return Promise.resolve(this.client.showUserExplorer());
  }
  hideUserExplorer() {
    return Promise.resolve(this.client.hideUserExplorer());
  }
  fetch() {
    return Promise.resolve(this.client.fetch());
  }
}

class WebViewParameterConfig {
  constructor(readonly parameters: Record<string, any>) {
    this.parameters = parameters;
  }

  get(key: string, defaultValue: string | number | boolean | null) {
    const parameterValue = this.parameters[key];

    if (parameterValue === null || parameterValue === undefined) {
      return defaultValue;
    }

    if (defaultValue === null || defaultValue === undefined) {
      return parameterValue;
    }

    if (typeof parameterValue === typeof defaultValue) {
      return parameterValue;
    }

    return defaultValue;
  }
}

class WebViewRemoteConfig {
  constructor(
    private readonly configFetcher: (key: string, defaultValue: any) => any
  ) {
    this.configFetcher = configFetcher;
  }

  async get(key: string, defaultValue: any) {
    try {
      const result = await this.configFetcher(key, defaultValue);
      if (!result) {
        throw new Error("invoke result data not exists");
      }

      switch (typeof defaultValue) {
        case "number":
          return Number(result);
        case "boolean":
          return Boolean(result);
        default:
          return result;
      }
    } catch (e) {
      console.error(
        `Unexpected exception while deciding remote config parameter[${key}]. Returning default value. : ${e}`
      );
      return defaultValue;
    }
  }
}

export default HackleManager;
