import UIKit
import Capacitor

/// Bridge view controller that registers the app's local Capacitor plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(NousNativePlugin())
    }
}
