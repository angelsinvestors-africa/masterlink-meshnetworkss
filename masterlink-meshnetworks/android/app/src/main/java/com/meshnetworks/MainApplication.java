package com.meshnetworks;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.List;

// Import the native module package if required
import com.meshnetworks.WiFiDirectModulePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }
  
        @Override
        protected List<ReactPackage> getPackages() {
          // Automatically add packages using autolinking.
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Add your custom packages here
          packages.add(new WiFiDirectModulePackage());
          return packages;
        }
  
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
