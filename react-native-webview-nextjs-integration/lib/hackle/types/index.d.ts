import { Emitter } from "./emitter";
import { Config, Decision, FeatureFlagDecision, HackleEvent, HackleSubscriptionOperations, PageView, PropertyOperations, User } from "@hackler/javascript-sdk";
interface Port {
    postMessage(serialized: string): void;
}
declare global {
    interface Window {
        ReactNativeWebView: Port;
        _hackle_injected: boolean;
    }
}
/**
 * WebView 여부에 따라 다른 인스턴스를 반환하도록 하는 Wrapper
 * @example const hackleClient = new HackleManager().createInstance("SDK_KEY")
 */
declare class HackleManager {
    private injectFlag;
    private isInjectedEnvironment;
    createInstance(sdkKey: string, config: Config): HackleWebViewClient | HackleWebOnlyClient;
}
declare class WebViewMessageTransceiver {
    readonly port: Port;
    cleanUp: () => void;
    constructor(port: Port);
    addEventListener(_listener: EventListener): void;
}
/**
 * ReactNative WebView 환경에서만 동작하는 HackleClient
 */
declare class HackleWebViewClient extends Emitter<{
    "user-updated": string;
}> {
    private readonly sdkKey;
    private readonly config;
    private readonly messageTransceiver;
    private messageFieldName;
    private resolverRecord;
    constructor(sdkKey: string, config: Config, messageTransceiver: WebViewMessageTransceiver);
    private createMessage;
    private createId;
    getSessionId(): Promise<unknown>;
    getUser(): Promise<unknown>;
    setUser(user: User): Promise<unknown>;
    setUserId(userId: string | undefined | null): Promise<unknown>;
    setDeviceId(deviceId: string | undefined | null): Promise<unknown>;
    setUserProperty(key: string, value: any): Promise<unknown>;
    setUserProperties(properties: Record<string, any>): Promise<unknown>;
    updateUserProperties(operations: PropertyOperations): Promise<unknown>;
    updatePushSubscriptions(operations: HackleSubscriptionOperations): Promise<unknown>;
    updateSmsSubscriptions(operations: HackleSubscriptionOperations): Promise<unknown>;
    updateKakaoSubscriptions(operations: HackleSubscriptionOperations): Promise<unknown>;
    setPhoneNumber(phoneNumber: string): Promise<unknown>;
    unsetPhoneNumber(): Promise<unknown>;
    resetUser(): Promise<unknown>;
    variation(experimentKey: number): Promise<string>;
    variationDetail(experimentKey: number): Promise<Decision>;
    isFeatureOn(featureKey: number): Promise<unknown>;
    featureFlagDetail(featureKey: number): Promise<FeatureFlagDecision>;
    track(event: Event, user: User): Promise<unknown>;
    trackPageView(): Promise<void>;
    remoteConfig(): WebViewRemoteConfig;
    showUserExplorer(): Promise<unknown>;
    hideUserExplorer(): Promise<unknown>;
    fetch(): Promise<unknown>;
}
/**
 * React Native WebView 환경이 아닌 경우 사용되는 hackleClient
 */
declare class HackleWebOnlyClient extends Emitter<{
    "user-updated": string;
}> {
    client: import("@hackler/javascript-sdk").HackleClient;
    constructor(sdkKey: string, config: Config);
    private emitUserUpdated;
    getSessionId(): Promise<string>;
    getUser(): Promise<User>;
    setUser(user: User): Promise<void>;
    setUserId(userId: string | undefined | null): Promise<void>;
    setDeviceId(deviceId: string): Promise<void>;
    setUserProperty(key: string, value: any): Promise<void>;
    setUserProperties(properties: Record<string, any>): Promise<void>;
    updateUserProperties(operations: PropertyOperations): Promise<void>;
    updatePushSubscriptions(operations: HackleSubscriptionOperations): Promise<void>;
    updateSmsSubscriptions(operations: HackleSubscriptionOperations): Promise<void>;
    updateKakaoSubscriptions(operations: HackleSubscriptionOperations): Promise<void>;
    setPhoneNumber(phoneNumber: string): Promise<void>;
    unsetPhoneNumber(): Promise<void>;
    resetUser(): Promise<void>;
    variation(experimentKey: number): Promise<string>;
    variationDetail(experimentKey: number): Promise<Decision>;
    isFeatureOn(featureKey: number): Promise<unknown>;
    featureFlagDetail(featureKey: number): Promise<FeatureFlagDecision>;
    track(event: HackleEvent): Promise<void>;
    trackPageView(option: PageView): Promise<void>;
    remoteConfig(): import("@hackler/javascript-sdk").HackleRemoteConfig;
    showUserExplorer(): Promise<void>;
    hideUserExplorer(): Promise<void>;
    fetch(): Promise<void>;
}
declare class WebViewRemoteConfig {
    private readonly configFetcher;
    constructor(configFetcher: (key: string, defaultValue: any) => any);
    get(key: string, defaultValue: any): Promise<any>;
}
export default HackleManager;
