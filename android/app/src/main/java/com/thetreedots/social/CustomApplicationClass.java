package com.thetreedots.social;

import android.content.Context;
import android.os.UserManager;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;
import static android.os.Build.VERSION.SDK_INT;

import com.clevertap.android.sdk.ActivityLifecycleCallback;
import io.branch.referral.Branch;

public class CustomApplicationClass extends MultiDexApplication {
  @Override
  public void onCreate() {
    super.onCreate();

    if (SDK_INT >= 24) {
      UserManager um = getApplicationContext().getSystemService(UserManager.class);
      if (um == null || !um.isUserUnlocked()) return;
    }

    // DEVELOPMENT USE ONLY
    // Please comment below line when development is finished
    // Branch.enableLogging();

    // Branch object initialization
    Branch.getAutoInstance(this);

    // CleverTap
    ActivityLifecycleCallback.register(this);
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }
}
